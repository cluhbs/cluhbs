import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Card, Header, Loader, Icon, Message, Grid, Accordion } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { Profiles, newClubNotificationOptions } from '/imports/api/profile/profile';
import { Clubs } from '/imports/api/club/club';
import ClubItem from '/imports/ui/components/ClubItem';
import { Redirect, Link } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';

class UserHomePage extends React.Component {

  state = {
    activeIndex: -1,
  };

  constructor(props) {
    super(props);
    this.dismissMessage = this.dismissMessage.bind(this);
    this.onClickAccordion = this.onClickAccordion.bind(this);
    this.updateNewClubs = this.updateNewClubs.bind(this);
    this.renderNewClubs = this.renderNewClubs.bind(this);
    this.renderMessages = this.renderMessages.bind(this);
    this.renderSavedClubs = this.renderSavedClubs.bind(this);
    this.renderRecommendedClubs = this.renderRecommendedClubs.bind(this);
  }

  returnClub(clubId) {
    return Clubs.findOne({ _id: clubId });
  }

  dismissMessage(event, data, userProfile, clubId) {
    const _id = userProfile._id;
    const messages = userProfile.messages.filter((x) => (x !== data.content));
    if (clubId) {
      const newClubs = userProfile.newClubs.filter((x) => (x !== clubId));
      Profiles.update(_id, { $set: { newClubs } });
    }
    Profiles.update(_id, { $set: { messages } });
    this.setState({ visible: false });
  }

  onClickAccordion(e, titleProps) {
    if (this.state.activeIndex === titleProps.index) {
      this.setState({ activeIndex: -1 });
    } else {
      this.setState({ activeIndex: titleProps.index });
    }
  }

  updateNewClubs(userProfile) {
    const _id = userProfile._id;
    if (userProfile.newClubNotifications === newClubNotificationOptions[2]) {
      Profiles.update(_id, { $set: { newClubs: [] } });
      console.log(newClubNotificationOptions[0]);
    }
    if (userProfile.newClubNotifications === newClubNotificationOptions[1]) {
      const newClubs =
          userProfile.newClubs.filter(
              /* eslint-disable-next-line */
              (clubId) => _.intersection(this.returnClub(clubId).interests, userProfile.interests).length > 0
          );
      Profiles.update(_id, { $set: { newClubs } });
    }
  }

  renderNewClubs(userProfile) {
    this.updateNewClubs(userProfile);
    return (
        userProfile.newClubs.map(
            (clubId, index) => <Message key={index} color='green'
                                        onDismiss={(e, data) => this.dismissMessage(e, data, userProfile, clubId)}>
              New Club: <Link to={`/club-info/${clubId}`}>{this.returnClub(clubId).name}</Link>
            </Message>,
        )
    );
  }

  renderMessages(userProfile) {
    return (
        <Accordion>
          <Accordion.Title active={this.state.activeIndex === 0} index={0}
                           onClick={(e, titleProps) => this.onClickAccordion(e, titleProps)}>
            <Header as='h2' textAlign='center'>
              {userProfile.messages.length + userProfile.newClubs.length > 0 ? (
                  <div>
                    <Icon name='exclamation circle' color='red'/> Messages <Icon name='dropdown'/>
                  </div>
              ) : (
                  <div>
                    Messages <Icon name='dropdown'/>
                  </div>
              )}
            </Header>
          </Accordion.Title>
          <Accordion.Content active={this.state.activeIndex === 0}>
            {(userProfile.messages.length + userProfile.newClubs.length === 0) ? (
                <Header as='h3' textAlign='center' color='grey'>No new messages.</Header>
            ) : (
                userProfile.messages.map((message, index) => <Message
                    key={index} content={message} color='teal'
                    onDismiss={(e, data) => this.dismissMessage(e, data, userProfile)}/>)
            )}
            {userProfile.newClubs.length === 0 ? ('') : (this.renderNewClubs(userProfile))}
          </Accordion.Content>
        </Accordion>
    );
  }

  renderSavedClubs(userProfile) {
    return (
        <Accordion>
          <Accordion.Title active={this.state.activeIndex === 1} index={1}
                           onClick={(e, titleProps) => this.onClickAccordion(e, titleProps)}>
            <Header as='h2' textAlign='center'>
              Your Saved Clubs ({userProfile.clubs.length})<Icon name='dropdown'/>
            </Header>
          </Accordion.Title>
          <Accordion.Content active={this.state.activeIndex === 1}>
            {userProfile.clubs.length === 0 ? (
                <Header as='h3' textAlign='center' color='grey'>
                  No clubs to display. Saved clubs will be displayed here.
                </Header>
            ) : (
                <Card.Group>
                  {userProfile.clubs.map((clubId, index) => <ClubItem key={index} club={this.returnClub(clubId)}/>)}
                </Card.Group>
            )}
          </Accordion.Content>
        </Accordion>
    );
  }

  sortClubsByInterest(a, b, userProfile) {
    const matchingInterestsA = _.intersection(a.interests, userProfile.interests);
    const matchingInterestsB = _.intersection(b.interests, userProfile.interests);
    if (matchingInterestsA.length > matchingInterestsB.length) {
      return -1;
    }
    if (matchingInterestsA.length < matchingInterestsB.length) {
      return 1;
    }
    return 0;
  }

  renderRecommendedClubs(userProfile) {
    const allClubs = Clubs.find().fetch();
    // get clubs that match user's interests
    /* eslint-disable-next-line */
    let clubs = allClubs.filter((x) => _.intersection(x.interests, userProfile.interests).length > 0);
    // filter out user's clubs
    clubs = clubs.filter((x) => userProfile.clubs.indexOf(x._id) === -1);
    clubs = clubs.sort((a, b) => this.sortClubsByInterest(a, b, userProfile));
    /* eslint-disable-next-line */
    const clubIds = _.pluck(clubs, '_id');
    // console.log(clubIds);
    return (
        <Accordion>
          <Accordion.Title active={this.state.activeIndex === 2} index={2}
                           onClick={(e, titleProps) => this.onClickAccordion(e, titleProps)}>
            <Header as='h2' textAlign='center'>
              Recommended Clubs ({clubIds.length})<Icon name='dropdown'/>
            </Header>
          </Accordion.Title>
          <Accordion.Content active={this.state.activeIndex === 2}>
            {(clubIds.length === 0) ? (
                <Header as='h3' textAlign='center' color='grey'>
                  No recommended clubs to display.
                </Header>
            ) : (
                <Card.Group>
                  {clubIds.map((clubId, index) => <ClubItem key={index} club={this.returnClub(clubId)}/>)}
                </Card.Group>
            )}
          </Accordion.Content>
        </Accordion>
    );
  }

  render() {
    if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
      return (<Redirect to={{ pathname: '/request-admin' }}/>);
    }
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {
    const userProfile = Profiles.findOne({ owner: Meteor.user().username });
    if (userProfile === undefined || userProfile === null || Meteor.user() === undefined) {
      return (<Redirect to={{ pathname: '/' }}/>);
    }
    return (
        <div className='home'>
          <Grid container>
            <Grid.Row columns='equal'>
              <Grid.Column>
                <Header as='h1' textAlign='center'>Welcome {userProfile.firstName} {userProfile.lastName}!</Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns='equal'>
              <Grid.Column>
                {this.renderMessages(userProfile)}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns='equal'>
              <Grid.Column>
                {this.renderSavedClubs(userProfile)}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns='equal'>
              <Grid.Column>
                {userProfile.recommendClubs ? this.renderRecommendedClubs(userProfile) : ''}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row/>
          </Grid>
        </div>
    );
  }
}

UserHomePage.propTypes = {
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('Profiles');
  const subscription2 = Meteor.subscribe('Clubs');

  return {
    ready: subscription.ready() && subscription2.ready(),
  };
})(UserHomePage);
