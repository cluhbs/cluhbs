import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Grid, Icon, Header, Button } from 'semantic-ui-react';
import { Link, Redirect } from 'react-router-dom';
import { Clubs } from '/imports/api/club/club';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
  render() {
    const contentStyle = { marginBottom: '50px' };
    const isLogged = Meteor.userId() !== null;
    return isLogged ?
        (<Redirect to={{ pathname: '/home' }}/>) :
        (
            <div style={contentStyle}>
              <Grid container stackable centered>
                <Grid.Row>
                  <div className='landing-background'>
                    <div className='landing-title'>
                      <Header inverted>
                        clUHbs
                      </Header>
                    </div>
                    <div className='landing-subtitle'>
                      <Header inverted>
                        an easy way to find clubs at the University of Hawaiʻi at Mānoa
                      </Header>
                    </div>
                    <div className='button'>
                      <Button size='huge' color='green' as={Link} to="/signin">Get Started</Button>
                    </div>
                  </div>
                </Grid.Row>
                <Grid.Row columns={2}>
                  <Grid.Column>
                    <div className='landing-middle'>
                      <Header as="h1">
                        Why clUHbs?
                      </Header>
                      <hr/>
                      <Header as="h3">
                        <Icon name='search'/>
                        <Header.Content>
                          Find Clubs Easily
                          <Header.Subheader>
                            Students are able to browse a well organized directory of all current student clubs with the
                            necessary information required to get involved
                          </Header.Subheader>
                        </Header.Content>
                      </Header>
                      <Header as="h3">
                        <Icon name='edit'/>
                        <Header.Content>
                          Manage Your Club
                          <Header.Subheader>
                            Club admins have the ability to edit the information of their club and have it displayed
                            onto
                            the club directory where interested students can find a way to contact them
                          </Header.Subheader>
                        </Header.Content>
                      </Header>
                      <Header as="h3">
                        <Icon name='group'/>
                        <Header.Content>
                          Make Lasting Friendships
                          <Header.Subheader>
                            clUHbs helps build a better sense of community at the University of Hawaiʻi at Mānoa by
                            introducing students to others that have common interests
                          </Header.Subheader>
                        </Header.Content>
                      </Header>
                    </div>
                  </Grid.Column>
                  <Grid.Column>
                    <div className='landing-middle'>
                      <Header as="h1">
                        How to use clUHbs
                      </Header>
                      <hr/>
                      <Header as="h3">
                        1. Create your profile
                      </Header>
                      <Header as="h3">
                        2. Specify your interests
                      </Header>
                      <Header as="h3">
                        3. Search clubs in club directory
                      </Header>
                      <Header as="h3">
                        4. Save the clubs you want to get involved with
                      </Header>
                      <Header as="h3">
                        5. Use club information to contact clubs or go to club meetings
                      </Header>
                    </div>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
        );
  }
}

export default Landing;
