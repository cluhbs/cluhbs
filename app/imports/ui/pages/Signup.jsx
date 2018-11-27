import React from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Container, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import { Accounts } from 'meteor/accounts-base';
import { Profiles } from '/imports/api/profile/profile';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';

/**
 * Signup component is similar to signin component, but we attempt to create a new user instead.
 */
class Signup extends React.Component {
  /** Initialize state fields. */
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', error: '', currentUser: '' };
    // Ensure that 'this' is bound to this component in these two functions.
    // https://medium.freecodecamp.org/react-binding-patterns-5-approaches-for-handling-this-92c651b5af56
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  createProfile() {
    const owner = Meteor.users.findOne().username;
    Profiles.insert({ owner });
  }

  returnProfile(owner) {
    return Profiles.findOne({ owner: owner });
  }

  /** Update the form controls each time the user interacts with them. */
  handleChange(e, { name, value }) {
    this.setState({ [name]: value });
  }

  /** Handle Signup submission using Meteor's account mechanism. */
  handleSubmit() {
    const { email, password } = this.state;
    Accounts.createUser({ email, username: email, password }, (err) => {
      if (err) {
        this.setState({ error: err.reason });
      } else {
        // browserHistory.push('/login');
        this.createProfile();
        this.setState({ error: '', currentUser: Meteor.user().username, redirectToReferer: true });
      }
    });
  }

  /** Display the signup form. */
  render() {
    // if correct authentication, redirect to page instead of login screen
    if (this.state.redirectToReferer) {
      const { from } = this.props.location.state ||
      { from: { pathname: `/profile-edit/${this.returnProfile(this.state.currentUser)._id}` } };
      return <Redirect to={from}/>;
    }
    // otherwise return the Register Form
    const isLogged = Meteor.userId() !== null;
    return isLogged ?
        (<Redirect to={{ pathname: '/home' }}/>) :
        (
            <Container>
              <Grid textAlign="center" verticalAlign="middle" centered columns={2}>
                <Grid.Column>
                  <Header as="h2" textAlign="center">
                    Register your account
                  </Header>
                  <Form onSubmit={this.handleSubmit}>
                    <Segment stacked>
                      <Form.Input
                          label="Email"
                          icon="user"
                          iconPosition="left"
                          name="email"
                          type="email"
                          placeholder="E-mail address"
                          onChange={this.handleChange}
                      />
                      <Form.Input
                          label="Password"
                          icon="lock"
                          iconPosition="left"
                          name="password"
                          placeholder="Password"
                          type="password"
                          onChange={this.handleChange}
                      />
                      <Form.Button content="Submit"/>
                    </Segment>
                  </Form>
                  <Message>
                    Already have an account? Log in <Link to="/signin">here</Link>.
                  </Message>
                  {this.state.error === '' ? (
                      ''
                  ) : (
                      <Message
                          error
                          header="Registration was not successful"
                          content={this.state.error}
                      />
                  )}
                </Grid.Column>
              </Grid>
            </Container>
        );
  }
}

/** Require the presence of a Profile document in the props object. Uniforms adds 'model' to the props, which we use. */
Signup.propTypes = {
  location: PropTypes.object,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
const SignupContainer = withTracker(() => ({
  // currentUser: Meteor.user() ? Meteor.user().username : '',
  // ready: Meteor.subscribe('ClubAdmin').ready() && Meteor.subscribe('Profiles').ready(),
}))(Signup);

/** Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter */
export default withRouter(SignupContainer);
