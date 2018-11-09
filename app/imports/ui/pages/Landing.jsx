import React from 'react';
import { Grid, Icon, Header, Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
  render() {
    return (

        <Grid columns={2} centered stackable container>

          <Grid.Column textAlign='center'>
            <div className='landing_middle'>
              <Header as='h1' inverted>
                <Icon size='big' name='user' inverted/>
                <Header.Content>
                  Create an Account
                  <Header.Subheader>
                    Let others get to know you a little better by making your own personal account, where you can
                    include what you are interested in.
                  </Header.Subheader>
                </Header.Content>
              </Header>
              <Header as='h1' inverted>
                <Icon size='big' name='search' inverted/>
                <Header.Content>
                  Discover Clubs
                  <Header.Subheader>
                    Browse different clubs located on the University of Hawaii at Manoa campus. You can find
                    brief descriptions of the club, location and meeting times, and information on who you can
                    contact to get involved.
                  </Header.Subheader>
                </Header.Content>
              </Header>
              <Header as='h1' inverted>
                <Icon size='big' name='users' inverted/>
                <Header.Content>
                  Don't See Your Club on the List?
                  <Header.Subheader>
                    Request access to become a club admin and have your club displayed along with the rest of the clubs
                    on the site. In the event of meeting time or location changes, as club admin you are able to
                    edit the information in your club, so other new interested students may see the changes.
                  </Header.Subheader>
                </Header.Content>
              </Header>
            </div>
          </Grid.Column>

          <Grid.Column textAlign="center" verticalAlign='middle'>
            <Header as="h1">
              What are you waiting for? <br/> Log in or Register now!
            </Header>
            <Button size="big" as={NavLink} exact to="/signin">Log in</Button>
            <Button size="big" as={NavLink} exact to="/signup">Register</Button>
          </Grid.Column>

        </Grid>
    );
  }
}

export default Landing;
