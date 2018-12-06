import React from 'react';
import { Grid, Segment, Header, Container } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import TextField from 'uniforms-semantic/TextField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SubmitField from 'uniforms-semantic/SubmitField';
import HiddenField from 'uniforms-semantic/HiddenField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import { Meteor } from 'meteor/meteor';
import { Profiles } from '/imports/api/profile/profile';
import { Requests, RequestSchema } from '/imports/api/request/request';
import PropTypes from 'prop-types';

/** Renders the Page for adding a document. */
class MakeRequest extends React.Component {

  /** Bind 'this' so that a ref to the Form can be saved in formRef and communicated between render() and submit(). */
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.insertCallback = this.insertCallback.bind(this);
  }

  /** Notify the user of the results of the submit. If successful, clear the form. */
  insertCallback(error) {
    if (error) {
      Bert.alert({ type: 'danger', message: `Add failed: ${error.message}` });
    } else {
      Bert.alert({ type: 'success', message: 'Add succeeded' });
    }
  }

  /** On submit, insert the data. */
  submit(data) {
    const { firstName, lastName, contactEmail, image, message, userId, owner } = data;
    Requests.insert({ firstName, lastName, contactEmail, image, message, userId, owner },
        this.insertCallback);
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    const contentStyle = { marginBottom: '50px' };
    const userRequest = this.props.requests.filter((x) => x.userId === Meteor.userId());
    const userProfile = Profiles.findOne({ owner: this.props.currentUser });
    return (
        <Container>
          {userRequest.length === 0 ? (
              <div style={contentStyle}>
              <Grid container centered>
                <Grid.Column>
                  <Header as="h2" textAlign="center">Make Request</Header>
                  <AutoForm schema={RequestSchema} onSubmit={this.submit}
                            model={userProfile}>
                    <Segment>
                      <TextField name='firstName'/>
                      <TextField name='lastName'/>
                      <TextField name='contactEmail'/>
                      <TextField name='image'/>
                      <LongTextField name='message'/>
                      <SubmitField value='Submit'/>
                      <ErrorsField/>
                      <HiddenField name='owner'/>
                      <HiddenField name='userId' value={Meteor.userId()}/>
                    </Segment>
                  </AutoForm>
                </Grid.Column>
              </Grid>
              </div>
          ) : (
              <Header as='h3' textAlign='center' color='grey'>
                You have already submitted a Club Admin Request.
                You will be notified when your request has been processed.
              </Header>
          )
          }
        </Container>
    );
  }
}

MakeRequest.propTypes = {
  currentUser: PropTypes.string.isRequired,
  requests: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe('Requests');
  return {
    currentUser: Meteor.user() ? Meteor.user().username : '',
    requests: Requests.find({}).fetch(),
    ready: subscription.ready(),
  };
})(MakeRequest);
