import React from 'react';
import { Grid, Loader, Header, Image } from 'semantic-ui-react';
import { Profiles, ProfileSchema } from '/imports/api/profile/profile';
import { Bert } from 'meteor/themeteorchef:bert';
import AutoForm from 'uniforms-semantic/AutoForm';
import TextField from 'uniforms-semantic/TextField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SubmitField from 'uniforms-semantic/SubmitField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import HiddenField from 'uniforms-semantic/HiddenField';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

/** Renders the Page for editing a single document. */
class EditProfile extends React.Component {

  /** Bind 'this' so that a ref to the Form can be saved in formRef and communicated between render() and submit(). */
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.updateCallback = this.updateCallback.bind(this);
    // console.log(Meteor.user().username);
  }

  /** Notify the user of the results of the submit. */
  updateCallback(error) {
    if (error) {
      Bert.alert({ type: 'danger', message: `Profile update failed: ${error.message}` });
    } else {
      Bert.alert({ type: 'success', message: 'Profile update succeeded' });
    }
  }

  createProfile(data) {
    const {
      firstName,
      lastName,
      image,
      phoneNumber,
      contactEmail,
      interests,
    } = data;
    const owner = Meteor.user().username;
    Profiles.insert({
      firstName,
      lastName,
      image,
      phoneNumber,
      contactEmail,
      interests,
      owner,
    }, this.updateCallback(this.error));
  }

  updateProfile(data) {
    const {
      firstName,
      lastName,
      image,
      phoneNumber,
      contactEmail,
      interests,
      _id,
    } = data;
    Profiles.update(_id, {
      $set: {
        firstName,
        lastName,
        image,
        phoneNumber,
        contactEmail,
        interests,
      },
    }, this.updateCallback(this.error));
  }

  /** On successful submit, insert the data. */
  submit(data) {
    // if (Profiles.find().count() === 0) {
    if (this.props.doc == null) {
      this.createProfile(data);
    } else {
      this.updateProfile(data);
    }
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  renderPage() {
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">Edit Profile</Header>
            <AutoForm schema={ProfileSchema} onSubmit={this.submit} model={this.props.doc}>
              <Grid stackable>
                <Grid.Row>
                  <Header as='h3'>General Information</Header>
                </Grid.Row>
                <Grid.Row columns='equal'>
                  <Grid.Column>
                    <TextField name='firstName'/>
                  </Grid.Column>
                  <Grid.Column>
                    <TextField name='lastName'/>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={1}>
                  <Grid.Column>
                    <TextField name='image' placeholder='Paste url to image'/>
                  </Grid.Column>
                  {/*<Grid.Column>
                    <Image src={`${this.props.doc.image}`} size='large' />
                  </Grid.Column>*/}
                </Grid.Row>

                <Grid.Row columns={1}>
                  <Header as='h3'>Contact Information</Header>
                </Grid.Row>

                <Grid.Row columns={2}>
                  <Grid.Column>
                    <TextField name='phoneNumber'/>
                  </Grid.Column>
                  <Grid.Column>
                    <TextField name='contactEmail'/>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={1}>
                  <Header as='h3'>Additional Information</Header>
                </Grid.Row>
                <Grid.Row columns={1}>
                  <Grid.Column>
                  <LongTextField name='interests'/>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={1}>
                  <Grid.Column>
                  <SubmitField value='Submit'/>
                  </Grid.Column>
                </Grid.Row>
                <ErrorsField/>
                <HiddenField name='owner' value='fakeuser@foo.com'/>
              </Grid>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

/** Require the presence of a Profile document in the props object. Uniforms adds 'model' to the props, which we use. */
EditProfile.propTypes = {
  doc: PropTypes.object,
  model: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  const subscription = Meteor.subscribe('Profiles');
  // const username = Meteor.user().username;
  // console.log(username);
  // Get access to Profile documents.
  return {
    doc: Profiles.findOne(),
    ready: subscription.ready(),
  };
})(EditProfile);
