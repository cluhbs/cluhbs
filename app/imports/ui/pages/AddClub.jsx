import React from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import TextField from 'uniforms-semantic/TextField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SubmitField from 'uniforms-semantic/SubmitField';
import HiddenField from 'uniforms-semantic/HiddenField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import { Bert } from 'meteor/themeteorchef:bert';
import { Meteor } from 'meteor/meteor';
import { Clubs, ClubSchema } from '/imports/api/club/club';
import { Profiles } from '/imports/api/profile/profile';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

/** Renders the Page for adding a document. */
class AddClub extends React.Component {

  /** Bind 'this' so that a ref to the Form can be saved in formRef and communicated between render() and submit(). */
  constructor(props) {
    super(props);
    this.state = { error: '', currentClub: '', redirectToReferer: false };
    this.submit = this.submit.bind(this);
    this.insertCallback = this.insertCallback.bind(this);
    this.formRef = null;
  }

  /** Notify the user of the results of the submit. If successful, clear the form. */
  insertCallback(error) {
    if (error) {
      Bert.alert({ type: 'danger', message: `Add failed: ${error.message}` });
    } else {
      Bert.alert({ type: 'success', message: 'Add succeeded' });
      this.formRef.reset();
    }
  }

  /** On submit, insert the data. */
  submit(data) {
    const { name, image, website, description, meetTime, location, contactPerson, contactEmail, interests } = data;
    const owner = Meteor.user().username;
    const memberId = Profiles.findOne({ owner: owner })._id;
    const members = [memberId];
    Clubs.insert({ name, image, website, description, meetTime, location, contactPerson, contactEmail,
          interests, members, owner }, this.insertCallback);
    const insertedClub = Clubs.findOne({ owner: owner })._id;
    const clubs = [insertedClub];
    Profiles.update(memberId, { $set: { clubs: clubs } });
    this.setState({ error: '', currentClub: insertedClub, redirectToReferer: true });

  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    const { from } = this.props.location.state || { from: { pathname: `/club-info/${this.state.currentClub}` } };
    // if correct authentication, redirect to page instead of login screen
    if (this.state.redirectToReferer) {
      return <Redirect to={from}/>;
    }
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">Add Club</Header>
            <AutoForm ref={(ref) => { this.formRef = ref; }} schema={ClubSchema} onSubmit={this.submit}>
              <Segment>
                <TextField name='name'/>
                <TextField name='image'/>
                <TextField name='website'/>
                <LongTextField name='description'/>
                <TextField name='meetTime'/>
                <TextField name='location'/>
                <TextField name='contactPerson'/>
                <TextField name='contactEmail'/>
                <TextField name='interests'/>
                <SubmitField value='Submit'/>
                <ErrorsField/>
                <HiddenField name='owner' value='fakeuser@foo.com'/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

AddClub.propTypes = {
  location: PropTypes.object,
};

export default AddClub;
