import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Grid, Icon, Header, Button } from 'semantic-ui-react';
import { Link, Redirect } from 'react-router-dom';
import { Clubs } from '/imports/api/club/club';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
  render() {
    const isLogged = Meteor.userId() !== null;
    return isLogged ?
        (<Redirect to={{ pathname: '/home'}}/>) :
        (<div className='landing-background'>
          <Grid container stackable centered>
            <Grid.Row>
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
                <Button size='huge' color='green' as={Link} to="/signup">Get Started</Button>
              </div>
            </Grid.Row>
            <Grid.Row columns={2}>
              <Grid.Column>
                <div className="landing-middle">
                  <Header as="h1" inverted>
                    Why clUHbs?
                  </Header>
                  <hr/>
                  <Header as="h3" inverted>
                    <Icon inverted name='search'/>
                    <Header.Content inverted='true'>
                      Find Clubs Easily
                      <Header.Subheader inverted='true'>
                        Students are able to browse a well organized directory of all current student clubs with the
                        necessary information required to get involved
                      </Header.Subheader>
                    </Header.Content>
                  </Header>
                  <Header as="h3" inverted>
                    <Icon inverted name='edit'/>
                    <Header.Content inverted='true'>
                      Manage Your Club
                      <Header.Subheader inverted='true'>
                        Club admins have the ability to edit the information of their club and have it displayed onto
                        the club directory where interested students can find a way to contact them
                      </Header.Subheader>
                    </Header.Content>
                  </Header>
                  <Header as="h3" inverted>
                    <Icon inverted name='group'/>
                    <Header.Content inverted='true'>
                      Make Lasting Friendships
                      <Header.Subheader inverted='true'>
                        clUHbs helps build a better sense of community at the University of Hawaiʻi at Mānoa by
                        introducing students to others that have common interests
                      </Header.Subheader>
                    </Header.Content>
                  </Header>
                </div>
              </Grid.Column>
              <Grid.Column>
                <div className="landing-middle">
                  <Header as="h1" inverted>
                    How to use clUHbs
                  </Header>
                  <hr/>
                  <Header as="h3" inverted>
                    1. Create your profile
                  </Header>
                  <Header as="h3" inverted>
                    2. Specify your interests
                  </Header>
                  <Header as="h3" inverted>
                    3. Search clubs in club directory
                  </Header>
                  <Header as="h3" inverted>
                    4. Add clubs to {'your clubs'}
                  </Header>
                  <Header as="h3" inverted>
                    5. Contact club admins using given contact information
                  </Header>
                  <Header as="h3" inverted>
                    6. Have fun getting involved with your club!
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
