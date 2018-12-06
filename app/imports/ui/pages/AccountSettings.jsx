import React from 'react';
import { Grid, Loader, Header, Button, Segment } from 'semantic-ui-react';
import { Bert } from 'meteor/themeteorchef:bert';
import AutoForm from 'uniforms-semantic/AutoForm';
import TextField from 'uniforms-semantic/TextField';
import RadioField from 'uniforms-semantic/RadioField';
import BoolField from 'uniforms-semantic/BoolField';
import SubmitField from 'uniforms-semantic/SubmitField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Roles } from 'meteor/alanning:roles';
import { Profiles, ProfileSchema } from '/imports/api/profile/profile';
import { Admin, AdminSchema } from '/imports/api/admin/admin';

/** Renders the Page for editing a single document. */
class AccountSettings extends React.Component {

  state = {
    clicked: false,
  };

  /** Bind 'this' so that a ref to the Form can be saved in formRef and communicated between render() and submit(). */
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.onClickChangePassword = this.onClickChangePassword.bind(this);
    this.renderChangePassword = this.renderChangePassword.bind(this);
  }

  /** Notify the user of the results of the submit. */
  updateCallback(error) {
    if (error) {
      Bert.alert({ type: 'danger', message: `Account update failed: ${error.message}` });
    } else {
      Bert.alert({ type: 'success', message: 'Account update succeeded' });
    }
  }

  updateProfile(data) {
    const {
      _id, newClubNotifications, deletedClubNotifications, recommendClubs,
      contactEmail, phoneNumber, emailNotifications, textNotifications,
    } = data;
    Profiles.update(_id, {
      $set: {
        newClubNotifications, deletedClubNotifications, recommendClubs,
        contactEmail, phoneNumber, emailNotifications, textNotifications
      },
    }, this.updateCallback(this.error));
  }

  updateAdmin(data) {
    const {
      _id, newClubNotifications, updatedClubNotifications, contactEmail, phoneNumber,
      emailNotifications, textNotifications,
    } = data;
    Admin.update(_id, {
      $set: {
        newClubNotifications, updatedClubNotifications, contactEmail, phoneNumber,
        emailNotifications, textNotifications,
      },
    }, this.updateCallback(this.error));
  }

  onClickChangePassword() {
    this.setState({ clicked: true });
  }

  renderChangePassword() {
    if (this.state.clicked) {
      return (
          <Segment>Change Password</Segment>
      );
    }
    return (<Button onClick={this.onClickChangePassword}>Change Password</Button>);
  }

  /** On successful submit, insert the data. */
  submit(data) {
    if (this.props.isAdmin) {
      this.updateAdmin(data);
    }
    this.updateProfile(data);
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    if (Meteor.user()) {
      let checkUser = false;
      if (this.props.isAdmin) {
        if (Admin.findOne({ owner: Meteor.user().username })._id === this.props.doc._id) {
          checkUser = true;
        }
      } else {
        /* eslint-disable-next-line */
        if (Profiles.findOne({ owner: Meteor.user().username })._id === this.props.doc._id) {
          checkUser = true;
        }
      }
      if (!checkUser) {
        return (
            <Header as='h2' textAlign='center'>
              You do not have access to this page. Log in as this user to edit account settings.
            </Header>
        );
      }
    }
    if (this.state.clicked) {
      return (<Redirect exact to={'/change-password'}/>);
    }
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  renderPage() {
    return (
        <Grid container centered>
          <Grid.Row columns='equal'>
            <Grid.Column>
              <Header as="h2" textAlign="center">Account Settings</Header>
              <AutoForm schema={this.props.isAdmin ? AdminSchema : ProfileSchema}
                        onSubmit={this.submit} model={this.props.doc}>
                <Grid stackable>
                  <Grid.Row>
                    <Header as='h3'>Password</Header>
                  </Grid.Row>
                  <Grid.Row>
                    <Button basic color='teal' onClick={this.onClickChangePassword}>Change Password</Button>
                  </Grid.Row>
                  <Grid.Row>
                    <Header as='h3'>Notifications</Header>
                  </Grid.Row>
                  <Grid.Row columns='equal'>
                    <Grid.Column>
                      <Header as='h4'>New Club Notifications</Header>
                      <RadioField name='newClubNotifications'/>
                    </Grid.Column>
                    {this.props.isAdmin ? (
                        <Grid.Column>
                          <Header as='h4'>Updated Club Notifications</Header>
                          <RadioField name='updatedClubNotifications'/>
                        </Grid.Column>
                    ) : (
                        <Grid.Column>
                          <Header as='h4'>Deleted Club Notifications</Header>
                          <RadioField name='deletedClubNotifications'/>
                        </Grid.Column>
                    )}
                  </Grid.Row>
                  <Grid.Row columns='equal'>
                    {this.props.isAdmin ? (
                        ''
                    ) : (
                        <Grid.Column>
                          <Header as='h4'>Club Recommendations</Header>
                          <BoolField name='recommendClubs'/>
                        </Grid.Column>
                    )}
                  </Grid.Row>
                  <Grid.Row>
                    <Header as='h3'>Contact Information</Header>
                  </Grid.Row>
                  <Grid.Row columns={2} verticalAlign='middle'>
                    <Grid.Column>
                      <TextField name='contactEmail'/>
                    </Grid.Column>
                    <Grid.Column>
                      <BoolField name='emailNotifications'/>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns={2} verticalAlign='middle'>
                    <Grid.Column>
                      <TextField name='phoneNumber'/>
                    </Grid.Column>
                    <Grid.Column>
                      <BoolField name='textNotifications'/>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns={1}>
                    <Grid.Column>
                      <SubmitField value='Submit'/>
                    </Grid.Column>
                  </Grid.Row>
                  <ErrorsField/>
                </Grid>
              </AutoForm>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row/>
        </Grid>
    );
  }
}

/** Require the presence of a Profile document in the props object. Uniforms adds 'model' to the props, which we use. */
AccountSettings.propTypes = {
  isAdmin: PropTypes.bool,
  doc: PropTypes.object,
  model: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  const subscription = Meteor.subscribe('Profiles');
  const subscription2 = Meteor.subscribe('Admin');
  // Get access to Profile documents.
  return {
    isAdmin: Roles.userIsInRole(Meteor.userId(), 'admin'),
    doc: (Roles.userIsInRole(Meteor.userId(), 'admin')) ? Admin.findOne(documentId) : Profiles.findOne(documentId),
    ready: subscription.ready() && subscription2.ready(),
  };
})(AccountSettings);
