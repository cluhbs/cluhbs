import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Card, Header, Loader, Container } from 'semantic-ui-react';
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

  render() {
    if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
      return (<Redirect to={{ pathname: '/request-admin' }}/>);
    }
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {
    const userProfile = Profiles.findOne({ owner: Meteor.user().username });
    const padding = { paddingBottom: '25px' };
    return (
        <div className='home'>
          <Container>
            <Header as='h1' textAlign='center'>
              Welcome {userProfile.firstName} {userProfile.lastName}!
            </Header>
            {userProfile.clubs.length === 0 ? (
                <Header as='h3' textAlign='center' color='grey'>
                  No clubs to display. Saved clubs will be displayed here.
                </Header>
            ) : (
                <Card.Group style={padding}>
                  {userProfile.clubs.map((clubId, index) => <ClubItem key={index} club={this.returnClub(clubId)}/>)}
                </Card.Group>
            )}
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
