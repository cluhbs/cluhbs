import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Card, Header, Loader, Container } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { Profiles } from '/imports/api/profile/profile';
import { Clubs } from '/imports/api/club/club';
import ClubItem from '/imports/ui/components/ClubItem';

class UserHomePage extends React.Component {

  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {
    return (

        <div className='home'>
          <Container>
              <Header as='h1' textAlign='center'>
                Welcome {this.props.doc.firstName} {this.props.doc.lastName}!
              </Header>
              {this.props.doc.clubs == '' ? (
                <Header as='h3' textAlign='center' color='grey'>
                  No clubs to display. Saved clubs will display here.
                </Header>
              ) : (
                  <Card.Group>
                    {this.props.doc.clubs.map((club, index) => <ClubItem key={index} club={club}/>)}
                  </Card.Group>
              )}
          </Container>
        </div>

    );
  }
}

UserHomePage.propTypes = {
  doc: PropTypes.object,
  model: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('Profiles');
  const subscription2 = Meteor.subscribe('Clubs');

  return {
    doc: Profiles.findOne(),
    ready: subscription.ready(),
  };
})(UserHomePage);
