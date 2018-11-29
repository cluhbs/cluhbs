import React from 'react';
import { Grid, Loader, Header, Input, Button, List, Image } from 'semantic-ui-react';
import { Profiles, ProfileSchema, defaultInterests } from '/imports/api/profile/profile';
import { Bert } from 'meteor/themeteorchef:bert';
import AutoForm from 'uniforms-semantic/AutoForm';
import TextField from 'uniforms-semantic/TextField';
import SubmitField from 'uniforms-semantic/SubmitField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

/** Renders the Page for editing a single document. */
class EditProfile extends React.Component {

  state = {
    disabledAdd: true,
    clear: false,
    interest: '',
    addedInterest: '',
    deletedInterest: '',
  };

  /** Bind 'this' so that a ref to the Form can be saved in formRef and communicated between render() and submit(). */
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.handleInterestChange = this.handleInterestChange.bind(this);
    this.onClickAddInterest = this.onClickAddInterest.bind(this);
    this.onClickDeleteInterest = this.onClickDeleteInterest.bind(this);
    this.onClickClearInterest = this.onClickClearInterest.bind(this);
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
    const {
      firstName, lastName, image, phoneNumber, contactEmail, _id,
    } = data;
    let interests = this.props.doc.interests.filter((x) => (x !== this.state.deletedInterest));
    if (this.state.clear) {
      interests = [];
    }
    if (!this.state.disabledAdd) {
      interests = this.props.doc.interests.concat(this.state.addedInterest);
    }
    Profiles.update(_id, {
      $set: {
        firstName,
        lastName,
        image,
        contactEmail,
        phoneNumber,
        interests,
      },
    }, this.updateCallback(this.error));
  }

  /** On successful submit, insert the data. */
  submit(data) {
    this.updateProfile(data);
    this.setState({ disabledAdd: true });
    this.setState({ clear: false });
  }

  handleInterestChange(event) {
    event.preventDefault();
    this.setState({ interest: event.target.value });
    this.setState({ addedInterest: event.target.value });
    if (event.target.value === '') {
      this.setState({ disabledAdd: true });
    } else {
      this.setState({ disabledAdd: false });
    }
  }

  onClickAddInterest() {
    this.setState({ interest: '' });
  }

  onClickDeleteInterest(event) {
    this.setState({ deletedInterest: event.target.value });
  }

  onClickClearInterest() {
    this.setState({ clear: true });
  }

  returnProfile(username) {
    return Profiles.findOne({ owner: username });
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    if (this.returnProfile(Meteor.user().username)._id !== this.props.doc._id) {
      return (
          <Header as='h2' textAlign='center'>
            You do not have access to this page. Log in as this user to edit the profile.
          </Header>
      );
    }
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
                <Grid.Row columns='equal'>
                  <Grid.Column width={2}>
                    <Image src={this.props.doc.image} size='small' as='a' href={this.props.doc.image} target='_blank'/>
                  </Grid.Column>
                  <Grid.Column verticalAlign='middle'>
                    <TextField name='image' placeholder='Paste url to image'/>
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row columns={1}>
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
                <Grid.Row columns={1} textAlign='center'>
                  <Header as='h3'>Interest Areas</Header>
                </Grid.Row>
                <Grid.Row columns={2}>
                  <Grid.Column>
                    <Header as='h3'>Add Interests</Header>
                    <Input id='interestInput' list='interestList' name='interest' placeholder='Select'
                           value={this.state.interest}
                           onChange={this.handleInterestChange}
                           action={
                             <Button icon='plus' color='green' disabled={this.state.disabledAdd}
                                     onClick={this.onClickAddInterest}
                             />
                           }
                    />
                    <datalist id='interestList'>
                      {defaultInterests.filter((x) => this.props.doc.interests.indexOf(x) === -1).map((item) => <option
                          key={item} value={item}/>)}
                    </datalist>
                  </Grid.Column>
                  <Grid.Column>
                    <Grid>
                      <Grid.Row columns={2}>
                        <Grid.Column>
                          <Header as='h3'>Your Interests</Header>
                        </Grid.Column>
                        <Grid.Column textAlign='right'>
                          <Button inverted color='red' content='Clear All' onClick={this.onClickClearInterest}/>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                    <Grid.Row>
                      <List>
                        {this.props.doc.interests.map((item) => <List.Item key={item.toString()}>
                          {/* <Icon link name='minus circle' color='red' value={item} */}
                          {/* onClick={this.onClickDeleteInterest}/> {item} */}
                          <Button inverted compact circular color='red' size='mini' content='X' value={item.toString()}
                                  onClick={this.onClickDeleteInterest}/> {item}
                        </List.Item>)}
                      </List>
                    </Grid.Row>
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
  // Get access to Profile documents.
  return {
    doc: Profiles.findOne(documentId),
    ready: subscription.ready(),
  };
})(EditProfile);
