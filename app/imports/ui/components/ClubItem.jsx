import React from 'react';
import { Card, Image, Label, Container, Button, Loader } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, Link } from 'react-router-dom';
import { Bert } from 'meteor/themeteorchef:bert';
import { Profiles } from '/imports/api/profile/profile';
import { Clubs } from '/imports/api/club/club';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class ClubItem extends React.Component {

  state = {
    icon: 'star',
    color: 'yellow',
  };

  constructor(props) {
    super(props);
    this.onClickSaveClub = this.onClickSaveClub.bind(this);
    this.changeIcon = this.changeIcon.bind(this);
  }

  updateCallback(error) {
    if (error) {
      Bert.alert({ type: 'danger', message: `Profile update failed: ${error.message}` });
    } else {
      Bert.alert({ type: 'success', message: 'Profile update succeeded' });
    }
  }

  changeIcon(isMember) {
    if (isMember) {
      this.setState({ icon: 'star' });
      this.setState({ color: 'yellow' });
    } else {
      this.setState({ icon: 'check' });
      this.setState({ color: 'green' });
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
    Profiles.update(userProfile._id, { $set: { clubs: clubs } });
    Clubs.update(this.props.club._id, { $set: { members: members } }, this.updateCallback(this.error));
    this.changeIcon(isMember);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.icon !== nextState.icon) {
      return false;
    }
    return true;
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderItem() : <Loader active>Getting data</Loader>;
  }

  renderItem() {
    const userProfile = Profiles.findOne({ owner: this.props.currentUser });
    const userClub = Clubs.findOne({ owner: this.props.currentUser });
    return (
        <Card centered>
          {(userClub._id === this.props.club._id) ? (
              <Label corner='right' icon='edit' color='blue'/>
          ) : (
              (this.props.club.members.indexOf(userProfile._id) > -1) ? (
                  <Label corner='right' icon='check' color='green'/>
              ) : '')
          }
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
          {(userClub._id === this.props.club._id) ? (
              <Button icon='edit' color='blue' as={Link} to={`/club-edit/${this.props.club._id}`}/>
          ) : (
              (this.props.club.members.indexOf(userProfile._id) > -1) ? (
                  <Button icon='check' color='green' onClick={() => this.onClickSaveClub(true)}/>
              ) : (
                  <Button icon={this.state.icon} color={this.state.color} onClick={() => this.onClickSaveClub(false)}/>
              ))
          }
        </Card>
    );
  }
}

/** Require a document to be passed to this component. */
ClubItem.propTypes = {
  club: PropTypes.object.isRequired,
  currentUser: PropTypes.string,
  ready: PropTypes.bool,
};

const ClubItemContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
  ready: Meteor.subscribe('Profiles').ready() && Meteor.subscribe('ClubAdmin').ready(),
}))(ClubItem);

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(ClubItemContainer);
