import React from 'react';
import { Requests, RequestSchema } from '/imports/api/request/request';
import { Grid, Segment, Header } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import TextField from 'uniforms-semantic/TextField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SubmitField from 'uniforms-semantic/SubmitField';
import HiddenField from 'uniforms-semantic/HiddenField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import { Bert } from 'meteor/themeteorchef:bert';
import { Meteor } from 'meteor/meteor';

/** Renders the Page for adding a document. */
class MakeRequest extends React.Component {

  /** Bind 'this' so that a ref to the Form can be saved in formRef and communicated between render() and submit(). */
  constructor(props) {
    super(props);
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
    const { firstName, lastName, email, image, message } = data;
    const owner = Meteor.user().username;
    Requests.insert({ firstName, lastName, email, image, message, owner },
        this.insertCallback);
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    const contentStyle = { marginBottom: '50px' };
    return (
        <div style={contentStyle}>
          <Grid container centered>
            <Grid.Column>
              <Header as="h2" textAlign="center">Make Request</Header>
              <AutoForm ref={(ref) => {
                this.formRef = ref;
              }} schema={RequestSchema} onSubmit={this.submit}>
                <Segment>
                  <TextField name='firstName'/>
                  <TextField name='lastName'/>
                  <TextField name='email'/>
                  <TextField name='image'/>
                  <LongTextField name='message'/>
                  <SubmitField value='Submit'/>
                  <ErrorsField/>
                  <HiddenField name='owner' value='fakeuser@foo.com'/>
                </Segment>
              </AutoForm>
            </Grid.Column>
          </Grid>
        </div>
    );
  }
}

export default MakeRequest;
