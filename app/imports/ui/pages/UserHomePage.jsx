import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Grid, Header, Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { Clubs } from '/imports/api/club/club';

class UserHomePage extends React.Component {

  render() {

    return (

        <div>
          <Grid container stackable centered>
            <Grid.Row>
              <Header as='h1'>
                Welcome {this.props.currentUser}!
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
  currentUser: PropTypes.string,
};

const UserHomePageContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
}))(UserHomePage);

export default withRouter(UserHomePageContainer);
