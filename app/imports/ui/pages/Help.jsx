import React from 'react';
import { Header, Grid, Segment } from 'semantic-ui-react';

class Help extends React.Component {
  render() {
    const style = { paddingBottom: "20px" };
    return (
        <div style={style}>
        <Grid centered container divided="vertically">
          <Grid.Row>
            <Header as="h1" textAlign="center">Frequently Asked Questions (FAQ)</Header>
          </Grid.Row>
          <Grid.Row>
            <Segment.Group size='huge'>
              <Segment><b>Q: How do I make an account?</b></Segment>
              <Segment>A: Press the user icon on the top right and select <i>Register</i>. From there you can follow
              the directions on the screen to proceed with creating your account.</Segment>
            </Segment.Group>
            <Segment.Group size='huge'>
              <Segment><b>Q: Do I have to make an account to view club information?</b></Segment>
              <Segment>A: No, you do not have to. By selecting the <i>Club Directory</i> option in the navigation bar, you have access to all the clubs listed on the website. If you are interested in a specific club's information, select <i>Learn More</i> on the club's card.</Segment>
            </Segment.Group>
            <Segment.Group size='huge'>
              <Segment><b>Q: What if I don't see a club on the Club Directory page?</b></Segment>
              <Segment>A: If a club is not listed on the <i>Club Directory</i> page, the club admin did not make an account on the site yet. To view the full list of clubs, visit the official UH Mānoa Approved RIOs site <a href="https://docs.google.com/spreadsheets/u/1/d/1vK_ixq3a86uXjHXy9oNnyYHwAvyU9smNPKuJU6OYd-Q/edit?usp=sharing">here</a>.</Segment>
            </Segment.Group>
            <Segment.Group size='huge'>
              <Segment><b>Q: How do I add a club to the Club Directory?</b></Segment>
              <Segment>A: In order to add a club to the <i>Club Directory</i>, you must first request to become a club admin. To do so, you have to press the user icon after signing in and select <i>Make Request</i>.</Segment>
            </Segment.Group>
            <Segment.Group size='huge'>
              <Segment><b>Q: How do I turn off my notifications?</b></Segment>
              <Segment>A: After being signed in, select the user icon in the top right corner, and select <i>Account Settings</i>. From there, you can turn off your notifications.</Segment>
            </Segment.Group>
            <Segment.Group size='huge'>
              <Segment><b>Q: How do I change my password?</b></Segment>
              <Segment>A: Click the user icon and select <i>Account Settings</i>. You can change your password there.</Segment>
            </Segment.Group>
          </Grid.Row>
        </Grid>
        </div>
    );
  }
}

export default Help;
