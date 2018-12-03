import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Card, Header, Loader, Container, Message } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { Profiles } from '/imports/api/profile/profile';
import { Clubs } from '/imports/api/club/club';
import ClubItem from '/imports/ui/components/ClubItem';
import { Redirect } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';

class UserHomePage extends React.Component {

  returnClub(clubId) {
    return Clubs.findOne({ _id: clubId });
  }

  dismissMessage(event, data, userProfile) {
    const messages = userProfile.messages.filter((x) => (x !== data.content));
    const _id = userProfile._id;
    Profiles.update(_id, {
      $set: { messages },
    });
    this.setState({ visible: false });
  }

  renderRecommendedClubs(userProfile) {
    const allClubs = Clubs.find().fetch();
    // get clubs that match user's interests
    /* eslint-disable-next-line */
    const clubs = allClubs.filter((x) => _.intersection(x.interests, userProfile.interests).length > 0);
    // filter out user's clubs
    const clubs2 = clubs.filter((x) => userProfile.clubs.indexOf(x._id) === -1);
    return (
        <Container>
          <Header as='h2' textAlign='center'>Recommended Clubs</Header>
          <Card.Group>
            {clubs2.map((club, index) => <ClubItem key={index} club={this.returnClub(club._id)}/>)}
          </Card.Group>
        </Container>
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
          <Container>
            <Header as='h1' textAlign='center'>Welcome {userProfile.firstName} {userProfile.lastName}!</Header>
            <Container>
              {userProfile.messages.length === 0 ? (
                  <Header as='h3' textAlign='center' color='grey'>
                    No new messages.
                  </Header>
              ) : (
                  userProfile.messages.map(
                      (message, index) => <Message key={index} content={message} color='teal'
                                                   onDismiss={(e, data) => this.dismissMessage(e, data, userProfile)}/>,
                  )
              )}
            </Container>
            <Header as='h2' textAlign='center'>Your Saved Clubs</Header>
            {userProfile.clubs.length === 0 ? (
                <Header as='h3' textAlign='center' color='grey'>
                  No clubs to display. Saved clubs will be displayed here.
                </Header>
            ) : (
                <Card.Group>
                  {userProfile.clubs.map((clubId, index) => <ClubItem key={index} club={this.returnClub(clubId)}/>)}
                </Card.Group>
            )}
            {userProfile.recommendClubs ? this.renderRecommendedClubs(userProfile) : ''}
          </Container>
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
