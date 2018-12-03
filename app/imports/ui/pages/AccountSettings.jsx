import React from 'react';
import { Grid, Loader, Header } from 'semantic-ui-react';
import { Profiles, ProfileSchema } from '/imports/api/profile/profile';
import { Bert } from 'meteor/themeteorchef:bert';
import AutoForm from 'uniforms-semantic/AutoForm';
import TextField from 'uniforms-semantic/TextField';
import RadioField from 'uniforms-semantic/RadioField';
import BoolField from 'uniforms-semantic/BoolField';
import SubmitField from 'uniforms-semantic/SubmitField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

/** Renders the Page for editing a single document. */
class AccountSettings extends React.Component {

  /** Bind 'this' so that a ref to the Form can be saved in formRef and communicated between render() and submit(). */
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
  }

  /** Notify the user of the results of the submit. */
  updateCallback(error) {
    if (error) {
      Bert.alert({ type: 'danger', message: `Profile update failed: ${error.message}` });
    } else {
      Bert.alert({ type: 'success', message: 'Profile update succeeded' });
    }
  }

  updateProfile(data) {
    const { _id, newClubNotifications, recommendClubs } = data;
    Profiles.update(_id, {
      $set: { newClubNotifications, recommendClubs },
    }, this.updateCallback(this.error));
  }

  /** On successful submit, insert the data. */
  submit(data) {
    this.updateProfile(data);
  }

  returnProfile(username) {
    return Profiles.findOne({ owner: username });
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    if (Meteor.user()) {
      if (this.returnProfile(Meteor.user().username)._id !== this.props.doc._id) {
        return (
            <Header as='h2' textAlign='center'>
              You do not have access to this page. Log in as this user to edit account settings.
            </Header>
        );
      }
    }
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  renderPage() {
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">Account Settings</Header>
            <AutoForm schema={ProfileSchema} onSubmit={this.submit} model={this.props.doc}>
              <Grid stackable>
                <Grid.Row>
                  <Header as='h3'>Notifications</Header>
                </Grid.Row>
                <Grid.Row columns='equal'>
                  <Grid.Column>
                    <Header as='h4'>New Club Notifications</Header>
                    <RadioField name='newClubNotifications'/>
                  </Grid.Column>
                  <Grid.Column>
                    <Header as='h4'>Club Recommendations</Header>
                    <BoolField name='recommendClubs'/>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Header as='h3'>Contact Information</Header>
                </Grid.Row>
                <Grid.Row columns={2}>
                  <Grid.Column>
                    <TextField name='contactEmail'/>
                  </Grid.Column>
                  <Grid.Column>
                    <TextField name='phoneNumber'/>
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
        </Grid>
    );
  }
}

/** Require the presence of a Profile document in the props object. Uniforms adds 'model' to the props, which we use. */
AccountSettings.propTypes = {
  doc: PropTypes.object,
  model: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  const subscription = Meteor.subscribe('Profiles');
  // Get access to Profile documents.
  return {
    doc: Profiles.findOne(documentId),
    ready: subscription.ready(),
  };
})(AccountSettings);
