import React from 'react';
import { Grid, Loader, Header, Image, Button, List, Segment, Container } from 'semantic-ui-react';
import { Clubs } from '/imports/api/club/club';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/** Renders the Page for displaying a single document. */
class DisplayClub extends React.Component {

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
                          {Roles.userIsInRole(Meteor.userId(), 'clubAdmin') &&
                          (this.props.doc.owner === this.props.currentUser.username) ? (
                              <Button basic color='blue' as={Link} icon='edit' content='Edit Club'
                                      to={`/club-edit/${this.props.doc._id}`}/>
                          ) : ''}
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
                                    {this.props.doc.members.map((member, index) => <List.Item key={index}
                                                                                                content={member}/>)}
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
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe('Clubs');
  return {
    doc: Clubs.findOne(documentId),
    ready: subscription.ready(),
    currentUser: Meteor.user(),
  };
})(DisplayClub);
