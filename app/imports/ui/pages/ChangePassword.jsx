import React from 'react';
import PropTypes from 'prop-types';
import { Bert } from 'meteor/themeteorchef:bert';
import { Container, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Profiles } from '/imports/api/profile/profile';

/**
 * ChangePassword page overrides the form’s submit event and call Meteor’s loginWithPassword().
 * Authentication errors modify the component’s state to be displayed
 */
class ChangePassword extends React.Component {

  state = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    error: '',
    redirectToReferer: false,
  };

  /** Initialize component state with properties for login and redirection. */
  constructor(props) {
    super(props);
    // Ensure that 'this' is bound to this component in these two functions.
    // https://medium.freecodecamp.org/react-binding-patterns-5-approaches-for-handling-this-92c651b5af56
    this.callback = this.callback.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onClickCancel = this.onClickCancel.bind(this);
    this.onClickSubmit = this.onClickSubmit.bind(this);
  }

  returnProfile(username) {
    return Profiles.findOne({ owner: username });
  }

  callback(error) {
    if (error) {
      Bert.alert({ type: 'danger', message: `Password update failed: ${error.reason}` });
      this.setState({ error: error.reason });
    } else {
      Bert.alert({ type: 'success', message: 'Password update succeeded' });
      this.setState({ redirectToReferer: true });
    }
  }

  /** Update the form controls each time the user interacts with them. */
  handleChange(e, { name, value }) {
    this.setState({ [name]: value });
  }

  onClickCancel() {
    this.setState({ redirectToReferer: true });
  }

  onClickSubmit() {
    const { oldPassword, newPassword, confirmNewPassword } = this.state;
    // if (this.returnProfile(this.props.currentUser)._id === this.props.doc._id) {
    if (newPassword === confirmNewPassword) {
      return (Accounts.changePassword(oldPassword, newPassword, (error) => this.callback(error)));
    }
    return (this.callback({ reason: 'Password match failed' }));
    // }
    // return (this.callback({ reason: 'Incorrect user' }));
  }

  /** Render the signin form. */
  render() {
    if (this.state.redirectToReferer) {
      return <Redirect exact to={`/account-settings/${this.returnProfile(Meteor.user().username)._id}`}/>;
    }
    return (
        <Container>
          <Grid textAlign="center" verticalAlign="middle" centered columns={2}>
            <Grid.Column>
              <Header as="h2" textAlign="center">Change Password</Header>
              <Form onSubmit={this.handleSubmit}>
                <Segment stacked>
                  <Form.Input
                      label="Old Password"
                      icon="lock"
                      iconPosition="left"
                      name="oldPassword"
                      placeholder="Old Password"
                      type="password"
                      onChange={this.handleChange}
                  />
                  <Form.Input
                      label="New Password"
                      icon="lock"
                      iconPosition="left"
                      name="newPassword"
                      placeholder="New Password"
                      type="password"
                      onChange={this.handleChange}
                  />
                  <Form.Input
                      label="Confirm New Password"
                      icon="lock"
                      iconPosition="left"
                      name="confirmNewPassword"
                      placeholder="Confirm New Password"
                      type="password"
                      onChange={this.handleChange}
                  />
                  <Grid>
                    <Grid.Row columns='equal'>
                      <Grid.Column textAlign='center'>
                        <Form.Button content="Submit" onClick={this.onClickSubmit}/>
                      </Grid.Column>
                      <Grid.Column textAlign='center'>
                        <Form.Button content="Cancel" onClick={this.onClickCancel}/>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Segment>
              </Form>
              {this.state.error === '' ? (
                  ''
              ) : (
                  <Message
                      error
                      header="Login was not successful"
                      content={this.state.error}
                  />
              )}
            </Grid.Column>
          </Grid>
        </Container>
    );
  }
}

/** Ensure that the React Router location object is available in case we need to redirect. */
ChangePassword.propTypes = {
  location: PropTypes.object,
  currentUser: PropTypes.string,
};

export default withTracker(() => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const subscription = Meteor.subscribe('Profiles');
  // Get access to Profile documents.
  return {
    currentUser: Meteor.user() ? Meteor.user().username : '',
    ready: subscription.ready(),
  };
})(ChangePassword);
