import React from 'react';
import { Grid, Loader, Header, Segment, Input, Button, List, Image } from 'semantic-ui-react';
import { Clubs, ClubSchema } from '/imports/api/club/club';
import { Profiles, defaultInterests } from '/imports/api/profile/profile';
import { Bert } from 'meteor/themeteorchef:bert';
import AutoForm from 'uniforms-semantic/AutoForm';
import TextField from 'uniforms-semantic/TextField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SubmitField from 'uniforms-semantic/SubmitField';
import HiddenField from 'uniforms-semantic/HiddenField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

/** Renders the Page for editing a single document. */
class EditClub extends React.Component {

  state = {
    createdClub: false,
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
    this.createClub = this.createClub.bind(this);
    this.updateClub = this.updateClub.bind(this);
    this.handleInterestChange = this.handleInterestChange.bind(this);
    this.onClickAddInterest = this.onClickAddInterest.bind(this);
    this.onClickDeleteInterest = this.onClickDeleteInterest.bind(this);
    this.onClickClearInterest = this.onClickClearInterest.bind(this);
  }

  /** On successful submit, insert the data. */
  submit(data) {
    if (this.props.location.pathname === '/club-add') {
      this.createClub(data);
    } else {
      this.updateClub(data);
    }
    this.setState({ disabledAdd: true });
    this.setState({ clear: false });
  }

  insertCallback(error) {
    if (error) {
      Bert.alert({ type: 'danger', message: `Add failed: ${error.message}` });
    } else {
      Bert.alert({ type: 'success', message: 'Add succeeded' });
    }
  }

  updateCallback(error) {
    if (error) {
      Bert.alert({ type: 'danger', message: `Club update failed: ${error.message}` });
    } else {
      Bert.alert({ type: 'success', message: 'Club update succeeded' });
    }
  }

  createClub(data) {
    const { name, image, website, description, meetTime, location, contactPerson, contactEmail } = data;
    const owner = Meteor.user().username;
    let interests = [];
    if (!this.state.disabledAdd) {
      interests = this.state.addedInterest;
    }
    // add user as a member of the club, insert club
    const userProfile = Profiles.findOne({ owner: owner });
    const members = [userProfile._id];
    Clubs.insert({
      name, image, website, description, meetTime, location, contactPerson, contactEmail,
      interests, members, owner,
    }, this.insertCallback);
    // add club to user's clubs
    const insertedClub = Clubs.findOne({ owner: owner })._id;
    const clubs = userProfile.clubs.concat(insertedClub);
    Profiles.update(userProfile._id, { $set: { clubs: clubs } });
    this.setState({ createdClub: true });
  }

  updateClub(data) {
    const { name, website, image, contactPerson, contactEmail, meetTime, location, description, _id } = data;
    let interests = this.props.doc.interests.filter((x) => (x !== this.state.deletedInterest));
    if (this.state.clear) {
      interests = [];
    }
    if (!this.state.disabledAdd) {
      interests = this.props.doc.interests.concat(this.state.addedInterest);
    }
    Clubs.update(_id, {
      $set: { name, website, image, contactPerson, contactEmail, meetTime, location, description, interests },
    }, this.updateCallback(this.error));
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

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  renderPage() {
    if (this.props.location.pathname === '/club-add' && this.state.createdClub) {
      return (<Redirect to={`/club-edit/${Clubs.findOne({ owner: this.props.currentUser })._id}`}/>);
    }
    if (this.props.location.pathname === '/club-add' &&
        Clubs.findOne({ owner: this.props.currentUser }) !== undefined) {
      return (
          <Header as='h2' textAlign='center'>
            You are only allowed to manage one club. If you wish to manage another club, create another account and
            request to be a club admin.
          </Header>
      );
    }
    return (
        <div className='edit-club-background'>
          <Grid container centered>
            <Grid.Column>
              {this.props.location.pathname === '/club-add' ? (
                  <Header as="h1" textAlign="center">Add Club</Header>
              ) : (
                  <Header as="h1" textAlign="center">Edit Club Information</Header>
              )}
              <AutoForm schema={ClubSchema} onSubmit={this.submit} model={this.props.doc}>
                <Segment>
                  <Grid>
                    <Grid.Row>
                      <Grid.Column>
                        <Header as='h3'>General Information</Header>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns='equal'>
                      <Grid.Column>
                        <TextField name='name'/>
                      </Grid.Column>
                      <Grid.Column>
                        <TextField name='website'/>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns='equal'>
                      <Grid.Column width={2}>
                        {this.props.doc ? (
                            <Image src={this.props.doc.image} size='small' as='a' href={this.props.doc.image}
                                   target='_blank'/>
                        ) : ''}
                      </Grid.Column>
                      <Grid.Column verticalAlign='middle'>
                        <TextField name='image' placeholder='Paste url to image'/>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns='equal'>
                      <Grid.Column>
                        <Header as='h3'>Contact Information</Header>
                        <TextField name='contactPerson'/>
                        <TextField name='contactEmail'/>
                      </Grid.Column>
                      <Grid.Column>
                        <Header as='h3'>Meeting Information</Header>
                        <TextField name='meetTime'/>
                        <TextField name='location'/>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column>
                        <LongTextField name='description'/>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={2}>
                      <Grid.Column>
                        <Header as='h3'>Add Interests</Header>
                        <Input id='interestInput' list='interestList' name='interest' placeholder='Select'
                               value={this.state.interest}
                               onChange={this.handleInterestChange}
                               action={<Button icon='plus' color='green' disabled={this.state.disabledAdd}
                                               onClick={this.onClickAddInterest}/>}
                        />
                        <datalist id='interestList'>
                          {this.props.doc ? (
                              defaultInterests.filter((x) => this.props.doc.interests.indexOf(x) === -1).map(
                                  (item) => <option key={item} value={item}/>,
                              )
                          ) : (
                              defaultInterests.map((item) => <option key={item} value={item}/>))
                          }
                        </datalist>
                      </Grid.Column>
                      <Grid.Column>
                        <Grid>
                          <Grid.Row columns={2}>
                            <Grid.Column>
                              <Header as='h3'>Club Interests</Header>
                            </Grid.Column>
                            <Grid.Column textAlign='right'>
                              <Button inverted color='red' content='Clear All' onClick={this.onClickClearInterest}/>
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                        <Grid.Row>
                          <List>
                            {this.props.doc ?
                                (this.props.doc.interests.map((item) => <List.Item key={item.toString()}>
                                  <Button inverted compact circular color='red' size='mini' content='X'
                                          value={item.toString()} onClick={this.onClickDeleteInterest}/> {item}
                                </List.Item>)) : ''}
                          </List>
                        </Grid.Row>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={1}>
                      <Grid.Column>
                        <SubmitField value='Submit'/>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                  <ErrorsField/>
                  {this.props.doc ? (
                      <HiddenField name='owner'/>
                  ) : (
                      <HiddenField name='owner' value='fakeuser@foo.com'/>
                  )}
                </Segment>
              </AutoForm>
            </Grid.Column>
          </Grid>
        </div>
    );
  }
}

/** Require the presence of a Stuff document in the props object. Uniforms adds 'model' to the props, which we use. */
EditClub.propTypes = {
  doc: PropTypes.object,
  model: PropTypes.object,
  ready: PropTypes.bool.isRequired,
  location: PropTypes.object,
  currentUser: PropTypes.string,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe('Clubs');
  return {
    doc: (documentId) ? Clubs.findOne(documentId) : undefined,
    currentUser: Meteor.user() ? Meteor.user().username : '',
    ready: subscription.ready(),
  };
})(EditClub);
