import React from 'react';
import { Grid, Loader, Header, Image, Button, List, Segment } from 'semantic-ui-react';
import { Profiles } from '/imports/api/profile/profile';
import { Clubs } from '/imports/api/club/club';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/** Renders the Page for displaying a single document. */
class DisplayProfile extends React.Component {

  returnClub(clubId) {
    return Clubs.findOne({ _id: clubId });
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
                          <Header as="h1" textAlign="center">
                            {this.props.doc.firstName} {this.props.doc.lastName}</Header>
                          <Header.Subheader>Contact Email: {this.props.doc.contactEmail}</Header.Subheader>
                          {(this.props.doc.phoneNumber) ? (
                              <Header.Subheader>Phone Number: {this.props.doc.phoneNumber}</Header.Subheader>) : ''
                          }
                        </Grid.Column>
                        <Grid.Column textAlign='right' width={4}>
                          {(Meteor.user().username === this.props.doc.owner) ? (
                              <Button basic color='blue' as={Link} icon='edit' content='Edit Profile'
                                      to={`/profile-edit/${this.props.doc._id}`}/>
                          ) : ''}
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row columns={1}>
                        <Grid.Column>
                          <Segment>
                            <Grid celled relaxed>
                              <Grid.Row columns={2} relaxed='true'>
                                <Grid.Column>
                                  <Header as='h4' attached='top' textAlign='center'>Interest Areas</Header>
                                  <List bulleted>
                                    {this.props.doc.interests.map((item, index) => <List.Item key={index}
                                                                                              content={item}/>)}
                                  </List>
                                </Grid.Column>
                                <Grid.Column>
                                  <Header as='h4' attached='top' textAlign='center'>Clubs</Header>
                                  <List bulleted>
                                    {this.props.doc.clubs.map(
                                        (clubId, index) => <List.Item key={index} as={Link}
                                                                      to={`/club-info/${this.returnClub(clubId)._id}`}>
                                          {this.returnClub(clubId).name}</List.Item>,
                                    )}
                                  </List>
                                </Grid.Column>
                              </Grid.Row>
                            </Grid>
                          </Segment>
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
DisplayProfile.propTypes = {
  doc: PropTypes.object,
  model: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  const subscription = Meteor.subscribe('Profiles');
  const subscription2 = Meteor.subscribe('Clubs');
  // Get access to Profile documents.
  return {
    doc: Profiles.findOne(documentId),
    ready: subscription.ready() && subscription2.ready(),
  };
})(DisplayProfile);
