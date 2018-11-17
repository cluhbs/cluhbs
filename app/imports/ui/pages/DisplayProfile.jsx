import React from 'react';
import { Grid, Loader, Header, Image, Button, List, Segment } from 'semantic-ui-react';
import { Profiles } from '/imports/api/profile/profile';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

/** Renders the Page for editing a single document. */
class EditProfile extends React.Component {

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
                    <Image src={this.props.doc.image} size='small'/>
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
                          <Button basic color='blue' as={NavLink} icon='edit'
                                  exact to="/profile-edit" content='Edit Profile'/>
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row columns={1}>
                        <Grid.Column>
                          <Grid as={Segment} celled relaxed='true'>
                            <Grid.Row columns={2} relaxed>
                              <Grid.Column>
                                <Header as='h4' attached='top' textAlign='center'>Interest Areas</Header>
                                <List bulleted>
                                  {this.props.doc.interests.map((item) => <List.Item key={item.toString()}
                                                                                     content={item}/>)}
                                </List>
                              </Grid.Column>
                              <Grid.Column>
                                <Header as='h4' attached='top' textAlign='center'>Clubs</Header>
                                {/* change this.props.doc.interests to this.props.doc.clubs when implemented */}
                                <List bulleted>
                                  {this.props.doc.interests.map((club) => <List.Item key={club.toString()}
                                                                                     content={club}/>)}
                                </List>
                              </Grid.Column>
                            </Grid.Row>
                          </Grid>
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
EditProfile.propTypes = {
  doc: PropTypes.object,
  model: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  const subscription = Meteor.subscribe('Profiles');
  // Get access to Profile documents.
  return {
    doc: Profiles.findOne(),
    ready: subscription.ready(),
  };
})(EditProfile);
