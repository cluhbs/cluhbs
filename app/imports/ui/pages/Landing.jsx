import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Grid, Icon, Header, Button } from 'semantic-ui-react';
import { Link, Redirect } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {

  render() {
    const contentStyle = { paddingBottom: '15px' };
    const isNotLogged = Meteor.userId() === null || Meteor.user() === undefined;
    if (!isNotLogged) {
      if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
        return (<Redirect to={{ pathname: '/request-admin' }}/>);
      }
      return (<Redirect to={{ pathname: '/home' }}/>);
    }
    return (
        <div style={contentStyle} className='landing-background'>
          <Grid container stackable centered>
            <Grid.Row>
              <div className='landing-first-grid-row'>
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
                  <Header as="h1" inverted>
                    Why clUHbs?
                  </Header>
                  <hr/>
                  <Header as="h3" inverted>
                    <Icon name='search'/>
                    <Header.Content inverted='true'>
                      Find Clubs Easily
                      <Header.Subheader inverted='true'>
                        Students are able to browse a well organized directory of all current student clubs with the
                        necessary information required to get involved
                      </Header.Subheader>
                    </Header.Content>
                  </Header>
                  <Header as="h3" inverted>
                    <Icon name='edit'/>
                    <Header.Content inverted='true'>
                      Manage Your Club
                      <Header.Subheader inverted='true'>
                        Club admins have the ability to edit the information of their club and have it displayed
                        onto
                        the club directory where interested students can find a way to contact them
                      </Header.Subheader>
                    </Header.Content>
                  </Header>
                  <Header as="h3" inverted>
                    <Icon name='group'/>
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
                <div className='landing-middle'>
                  <Header as="h1" inverted>
                    How to use clUHbs
                  </Header>
                  <hr/>
                  <Header as="h3" inverted>
                    <Icon name='pencil'/> Create your profile
                  </Header>
                  <Header as="h3" inverted>
                    <Icon name='tasks'/> Specify your interests
                  </Header>
                  <Header as="h3" inverted>
                    <Icon name='search'/> Search clubs in club directory
                  </Header>
                  <Header as="h3" inverted>
                    <Icon name='save'/> Save the clubs you want to get involved with
                  </Header>
                  <Header as="h3" inverted>
                    <Icon name='comment'/> Use club information to contact clubs or go to club meetings
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
