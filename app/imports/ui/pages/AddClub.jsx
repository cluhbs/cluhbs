import React from 'react';
import { Grid, Segment, Header, Image, Input, Button } from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import TextField from 'uniforms-semantic/TextField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SubmitField from 'uniforms-semantic/SubmitField';
import HiddenField from 'uniforms-semantic/HiddenField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import { Bert } from 'meteor/themeteorchef:bert';
import { Meteor } from 'meteor/meteor';
import { Clubs, ClubSchema } from '/imports/api/club/club';
import { Profiles, defaultInterests } from '/imports/api/profile/profile';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react/dist/commonjs/elements/List/List';

/** Renders the Page for adding a document. */
class AddClub extends React.Component {

  state = {
    image: '',
    interests: [],
  }

  /** Bind 'this' so that a ref to the Form can be saved in formRef and communicated between render() and submit(). */
  constructor(props) {
    super(props);
    this.state = { error: '', currentClub: '', redirectToReferer: false };
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
        <div className='edit-club-background'>
          <Grid container centered>
            <Grid.Column>
              <Header as="h1" textAlign="center">Edit Club Information</Header>
              <AutoForm schema={ClubSchema} onSubmit={this.submit} model={null}>
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
                        <Image src={this.state.image} size='small' as='a' href={this.state.image}
                               target='_blank'/>
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
                          {defaultInterests.filter((x) => this.state.interests.indexOf(x) === -1).map(
                              (item) => <option key={item} value={item}/>,
                          )}
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
                            {this.state.interests.map((item) => <List.Item key={item.toString()}>
                              <Button inverted compact circular color='red' size='mini' content='X'
                                      value={item.toString()} onClick={this.onClickDeleteInterest}/> {item}
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
                  </Grid>
                  <ErrorsField/>
                  <HiddenField name='owner'/>
                </Segment>
              </AutoForm>
            </Grid.Column>
          </Grid>
        </div>
    );
  }
}

AddClub.propTypes = {
  location: PropTypes.object,
};

export default AddClub;
