import React from 'react';
import { Card, Image, Label, Container, Button, Loader } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, Link } from 'react-router-dom';
import { Bert } from 'meteor/themeteorchef:bert';
import { Roles } from 'meteor/alanning:roles';
import { Profiles, deletedClubNotificationOptions } from '/imports/api/profile/profile';
import { Clubs } from '/imports/api/club/club';
import { Admin } from '/imports/api/admin/admin';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class ClubItem extends React.Component {

  state = {
    redirectToReferer: false,
  };

  constructor(props) {
    super(props);
    this.onClickSaveClub = this.onClickSaveClub.bind(this);
    this.onClickDeleteClub = this.onClickDeleteClub.bind(this);
  }

  onClickDeleteClub() {
    /* eslint-disable-next-line */
    if (confirm(`Are you sure you want to delete ${this.props.club.name}?`)) {
      const allProfiles = Profiles.find().fetch();
      /* eslint-disable-next-line */
      for (const profile of allProfiles) {
        let message = `${this.props.club.name} has been removed from the Club Directory.`;
        const newClubs = profile.newClubs.filter((x) => (x !== this.props.club._id));
        if (this.props.club.members.indexOf(profile._id) > -1) {
          const memberProfile = Profiles.findOne({ _id: profile._id });
          const clubs = memberProfile.clubs.filter((x) => (x !== this.props.club._id));
          message += ' You are no longer a member of this club.';
          Profiles.update(profile._id, { $set: { clubs } });
          if (profile.deletedClubNotifications === deletedClubNotificationOptions[1]) {
            Profiles.update(profile._id, { $set: { messages: profile.messages.concat(message) } });
          }
        }
        if (profile.deletedClubNotifications === deletedClubNotificationOptions[0]) {
          Profiles.update(profile._id, { $set: { messages: profile.messages.concat(message) } });
        }
        Profiles.update(profile._id, { $set: { newClubs } });
      }
      const allAdmin = Admin.find().fetch();
      /* eslint-disable-next-line */
      for (const admin of allAdmin) {
        const newClubs = admin.newClubs.filter((x) => (x !== this.props.club._id));
        const updatedClubs = admin.updatedClubs.filter((x) => (x !== this.props.club._id));
        const message = `${this.props.club.name} has been removed from the Club Directory.`;
        const messages = admin.messages.concat(message);
        Admin.update(admin._id, { $set: { newClubs, updatedClubs, messages } });
      }
      Clubs.remove(this.props.club._id, this.deleteCallback);
    }
  }

  deleteCallback(error) {
    if (error) {
      Bert.alert({ type: 'danger', message: `Delete failed: ${error.message}` });
    } else {
      Bert.alert({ type: 'success', message: 'The club has been successfully deleted.' });
    }
  }

  updateCallback(error) {
    if (error) {
      Bert.alert({ type: 'danger', message: `Profile update failed: ${error.message}` });
    } else {
      Bert.alert({ type: 'success', message: 'Profile update succeeded' });
    }
  }

  onClickSaveClub(isMember) {
    const userProfile = Profiles.findOne({ owner: this.props.currentUser });
    let clubs = [];
    let members = [];
    if (isMember) {
      // remove club from member and member from club
      clubs = userProfile.clubs.filter((x) => (x !== this.props.club._id));
      members = this.props.club.members.filter((x) => (x !== userProfile._id));
    } else {
      clubs = userProfile.clubs.concat(this.props.club._id);
      members = this.props.club.members.concat(userProfile._id);
    }
    if (this.props.location.pathname === '/home') {
      this.setState({ redirectToReferer: true });
    }
    Profiles.update(userProfile._id, { $set: { clubs: clubs } });
    Clubs.update(this.props.club._id, { $set: { members: members } }, this.updateCallback(this.error));
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    if (this.state.redirectToReferer) {
      // reload the page
      return <Link to='/home'/>;
    }
    return (this.props.ready) ? this.renderItem() : <Loader active>Getting data</Loader>;
  }

  renderButtons(userProfile, userClub) {
    if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
      return (
          <Button.Group>
            <Button as={Link} to={`/club-edit/${this.props.club._id}`}>Edit</Button>
            <Button negative onClick={this.onClickDeleteClub}>Delete</Button>
          </Button.Group>
      );
    }
    if (userClub) {
      if (userClub._id === this.props.club._id) {
        return (<Button icon='edit' color='blue' as={Link} to={`/club-edit/${this.props.club._id}`}/>);
      }
    }
    if (userProfile) {
      if (this.props.club.members.indexOf(userProfile._id) > -1) {
        return (<Button icon='check' color='green' onClick={() => this.onClickSaveClub(true)}/>);
      }
    }
    return (<Button icon='star' color='yellow' onClick={() => this.onClickSaveClub(false)}/>);
  }

  renderLabels(userProfile, userClub) {
    if (userClub) {
      if (userClub._id === this.props.club._id) {
        return (<Label corner='right' icon='edit' color='blue'/>);
      }
    }
    if (userProfile) {
      if (this.props.club.members.indexOf(userProfile._id) > -1) {
        return (<Label corner='right' icon='check' color='green'/>);
      }
    }
    return '';
  }

  renderItem() {
    const userProfile = Profiles.findOne({ owner: this.props.currentUser });
    const userClub = Clubs.findOne({ owner: this.props.currentUser });
    return (
        <Card centered>
          {this.props.currentUser !== '' ? this.renderLabels(userProfile, userClub) : ''}
          <Card.Content>
            <Container textAlign='center'>
              <Image style={{ height: '190px', paddingBottom: '10px' }} src={this.props.club.image}/>
            </Container>
            <Card.Header content={this.props.club.name}/>
            <Card.Meta>
              <a href={this.props.club.website}>{this.props.club.website}</a>
            </Card.Meta>
            <Card.Description>
              {this.props.club.description.substring(0, 250)}{(this.props.club.description.length > 250) ? '...' : ''}
            </Card.Description>
            <Card.Description textAlign='right'>
              <Link to={`/club-info/${this.props.club._id}`}>Learn More</Link>
            </Card.Description>
          </Card.Content>
          <Card.Content>
            <Label.Group tag color='green'>
              {this.props.club.interests.map((interest, index) => <Label key={index} content={interest}/>)}
            </Label.Group>
          </Card.Content>
          {this.props.currentUser !== '' ? this.renderButtons(userProfile, userClub) : ''}
        </Card>
    );
  }
}

/** Require a document to be passed to this component. */
ClubItem.propTypes = {
  club: PropTypes.object,
  currentUser: PropTypes.string,
  ready: PropTypes.bool,
  location: PropTypes.object,
};

const ClubItemContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
  ready: Meteor.subscribe('Profiles').ready() && Meteor.subscribe('ClubAdmin').ready(),
}))(ClubItem);

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(ClubItemContainer);
