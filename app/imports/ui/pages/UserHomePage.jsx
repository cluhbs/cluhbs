import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Grid, Header, Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { Profiles } from '/imports/api/profile/profile';
import { Clubs } from '/imports/api/club/club';

class UserHomePage extends React.Component {

  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {
    return (

        <div>
          <Grid container stackable centered>
            <Grid.Row>
              <Header as='h1'>
                Welcome {this.props.doc.firstName} {this.props.doc.lastName}!
              </Header>

            </Grid.Row>
            <Grid.Row>

            </Grid.Row>
          </Grid>
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

  return {
    doc: Profiles.findOne(),
    ready: subscription.ready(),
  };
})(UserHomePage);
