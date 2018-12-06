import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Grid, Header, Button, Image } from 'semantic-ui-react';
import { Link, Redirect } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {

  render() {
    const contentStyle = { paddingBottom: '15px' };
    const gridStyle = { paddingTop: '15px' };
    const isNotLogged = Meteor.userId() === null || Meteor.user() === undefined;
    if (!isNotLogged) {
      if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
        return (<Redirect to={{ pathname: '/request-admin' }}/>);
      }
      return (<Redirect to={{ pathname: '/home' }}/>);
    }
    return (
        <div style={contentStyle} className='landing-background'>
          <Grid style={gridStyle} container stackable centered>
            <Grid.Row>
              <div className='landing-first-grid-row'>
                <div className='landing-title'>
                  <Image centered src='/images/landing-header.png' size='big'/>
                </div>
                <div className='landing-subtitle'>
                  <Header as='h1' textAlign='centered' inverted>
                    A DIRECTORY OF CLUBS OFFERED TO THE UH MĀNOA COMMUNITY
                  </Header>
                </div>
                <div className='button'>
                  <Button size='large' color='green' as={Link} to="/signup">REGISTER</Button>
                  <Button size='large' as={Link} to="/signin">LOG IN</Button>
                </div>
              </div>
            </Grid.Row>
          </Grid>
          <div className='landing-middle'>
            <Grid>
              <Grid.Row columns={2} verticalAlign='middle'>
                <Grid.Column width={8}>
                  <Header as='h1'>
                    FIND A CLUB RIGHT FOR YOU
                  </Header>
                  <hr/>
                  <Header.Content size='medium'>
                    Browse through the Club Directory and discover a club that fits your interests and schedule.
                  </Header.Content>
                  <Header.Content>
                    Or create an account to save your favorites and stay updated.
                  </Header.Content>
                </Grid.Column>
                <Grid.Column width={8}>
                    <Image src='/images/club-directory1.png' size='big' floated='right'/>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={2} verticalAlign='middle'>
                <Grid.Column width={8}>
                  <Image src='/images/add-club2.png' size='big' floated='left'/>
                </Grid.Column>
                <Grid.Column textAlign='right' width={8}>
                  <Header as='h1'>
                    ADD YOUR CLUB TO THE DIRECTORY
                  </Header>
                  <hr/>
                  <Header.Content>
                    Are you part of a club that would like to be featured in the clUHbs directory?
                  </Header.Content>
                  <Header.Content>
                    Become a Club Admin and share your club with the UH Mānoa Community.
                  </Header.Content>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={8}>
                  <Header as='h1'>
                    CONNECT AND JOIN
                  </Header>
                  <hr/>
                  <Header.Content>
                    Attend club meetings or contact the club admin to join and create lasting relationships.
                  </Header.Content>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        </div>
    );
  }
}

export default Landing;
