import React from 'react';
import { Grid, Loader, Header, Image, Button, List, Segment, Container } from 'semantic-ui-react';
import { Clubs } from '/imports/api/club/club';
import { Profiles } from '/imports/api/profile/profile';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Bert } from 'meteor/themeteorchef:bert';

/** Renders the Page for displaying a single document. */
class DisplayClub extends React.Component {

  constructor(props) {
    super(props);
    this.onClickSaveClub = this.onClickSaveClub.bind(this);
  }

  updateCallback(error) {
    if (error) {
      Bert.alert({ type: 'danger', message: `Profile update failed: ${error.message}` });
    } else {
      Bert.alert({ type: 'success', message: 'Profile update succeeded' });
    }
  }

  onClickSaveClub(isMember) {
    const userProfile = Profiles.findOne({ owner: this.props.currentUser.username });
    let clubs = [];
    let members = [];
    if (isMember) {
      // remove club from member and member from club
      clubs = userProfile.clubs.filter((x) => (x !== this.props.doc._id));
      members = this.props.doc.members.filter((x) => (x !== userProfile._id));
    } else {
      clubs = userProfile.clubs.concat(this.props.doc._id);
      members = this.props.doc.members.concat(userProfile._id);
    }
    Profiles.update(userProfile._id, { $set: { clubs: clubs } });
    Clubs.update(this.props.doc._id, { $set: { members: members } }, this.updateCallback(this.error));
  }

  returnProfile(memberId) {
    return Profiles.findOne({ _id: memberId });
  }

  returnProfile2(username) {
    return Profiles.findOne({ owner: username });
  }

  renderButtons() {
    if (Roles.userIsInRole(Meteor.userId(), 'admin') || (Roles.userIsInRole(Meteor.userId(), 'clubAdmin')
        && this.props.doc.owner === this.props.currentUser.username)) {
      return (<Button basic color='blue' as={Link} icon='edit' content='Edit Club'
                      to={`/club-edit/${this.props.doc._id}`}/>);
    }
    const userProfile = this.returnProfile2(this.props.currentUser.username);
    if (userProfile) {
      if (this.props.doc.members.indexOf(userProfile._id) > -1) {
        return (<Button icon='check' color='green' onClick={() => this.onClickSaveClub(true)}/>);
      }
      return (<Button icon='star' color='yellow' onClick={() => this.onClickSaveClub(false)}/>);
    }
    return '';
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  renderPage() {
    return (
        <Grid container>
          <Grid.Row>
            <Grid.Column>
              <Grid as={Segment}>
                <Grid.Row columns='equal'>
                  <Grid.Column width={4}>
                    <Image src={this.props.doc.image} size='medium'/>
                  </Grid.Column>
                  <Grid.Column>
                    <Grid>
                      <Grid.Row columns='equal'>
                        <Grid.Column textAlign='center'>
                          <Header as="h1" textAlign="center">{this.props.doc.name}</Header>
                          {(this.props.doc.website) ? (
                              <Header.Subheader><strong>Club Website: </strong>
                                <a href={this.props.doc.website}>{this.props.doc.website}</a>
                                <a href={this.props.doc.website} rel='noopener noreferrer'
                                   target='_blank'>{this.props.doc.website}</a>
                              </Header.Subheader>) : ''
                          }
                          <Grid container>
                            <Grid.Row/>
                            <Grid.Row columns='equal'>
                              <Grid.Column>
                                <Header.Subheader><strong>Contact Person: </strong>
                                  {this.props.doc.contactPerson}</Header.Subheader>
                                <Header.Subheader><strong>Contact Email: </strong>
                                  {this.props.doc.contactEmail}</Header.Subheader>
                              </Grid.Column>
                              <Grid.Column>
                                <Header.Subheader><strong>Meeting Times: </strong>{this.props.doc.meetTime}
                                </Header.Subheader>
                                <Header.Subheader><strong>Location: </strong>{this.props.doc.location}
                                </Header.Subheader>
                              </Grid.Column>
                            </Grid.Row>
                          </Grid>
                        </Grid.Column>
                        <Grid.Column textAlign='right' width={4}>
                          {this.props.currentUser ? this.renderButtons() : ''}
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row columns={1}>
                        <Grid.Column>
                          <Container>{this.props.doc.description}</Container>
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row columns={1}>
                        <Grid.Column>
                          <Container>
                            <Grid celled relaxed>
                              <Grid.Row columns='equal' relaxed='true'>
                                <Grid.Column>
                                  <Header as='h4' attached='top' textAlign='center'>Interest Areas</Header>
                                  <List bulleted>
                                    {this.props.doc.interests.map((item, index) => <List.Item key={index}
                                                                                              content={item}/>)}
                                  </List>
                                </Grid.Column>
                                <Grid.Column>
                                  <Header as='h4' attached='top' textAlign='center'>Members</Header>
                                  <List bulleted>
                                    {this.props.doc.members.map(
                                        (memberId,
                                         index) => <List.Item
                                            key={index} as={Link} to={`/profile/${this.returnProfile(memberId)._id}`}
                                            content={`${this.returnProfile(memberId).firstName}
                                            ${this.returnProfile(memberId).lastName}`}/>,
                                    )}
                                  </List>
                                </Grid.Column>
                              </Grid.Row>
                            </Grid>
                          </Container>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
    );
  }
}

/** Require the presence of a Profile document in the props object. Uniforms adds 'model' to the props, which we use. */
DisplayClub.propTypes = {
  currentUser: PropTypes.object,
  doc: PropTypes.object,
  model: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  const subscription = Meteor.subscribe('Clubs');
  const subscription2 = Meteor.subscribe('Profiles');
  return {
    doc: Clubs.findOne(documentId),
    ready: subscription.ready() && subscription2.ready(),
    currentUser: Meteor.user(),
  };
})(DisplayClub);
