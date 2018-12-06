import React from 'react';
import { Header, Grid, List } from 'semantic-ui-react';

class ContactUs extends React.Component {
  render() {
    return (
        <Grid container centered divided="vertically">
          <Grid.Row>
            <Header as='h1' textAlign="center">Contact Us</Header>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Header as="h2" textAlign="center">Have any questions or suggestions?</Header>
              <Header as="h5" textAlign="center" color='grey'>Email us
                at <a href="mailto:cluhbs@hawaii.edu">cluhbs@hawaii.edu</a> (not a real email address) if you have any
                questions not listed on the <a href="#/help">help</a> page or suggestions to improve the site.</Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2} divided>
            <Grid.Column centered>
            <List bulleted centered floated="left">
              <List.Header as="h2" content="Developers" />
              <List.Item>
                <Header as='h3'>Kathleen Dy</Header>
                <List.List>
                  <List.Item>
                    <Header as='h4'>Major: Computer Science</Header>
                  </List.Item>
                </List.List>
              </List.Item>
              <List.Item>
                <Header as='h3'>Kylie Lin</Header>
                <List.List>
                  <List.Item>
                    <Header as='h4'>Major: Computer Engineering</Header>
                  </List.Item>
                </List.List>
              </List.Item>
              <List.Item>
                <Header as='h3'>Leisha Soberano-Keawemauhili</Header>
                <List.List>
                  <List.Item>
                    <Header as='h4'>Major: Computer Science</Header>
                  </List.Item>
                </List.List>
              </List.Item>
              <List.Item>
                <Header as='h3'>Keanu Williams</Header>
                <List.List>
                  <List.Item>
                    <Header as='h4'>Major: Computer Science</Header>
                  </List.Item>
                </List.List>
              </List.Item>
            </List>
            </Grid.Column>
            <Grid.Column>
              <Header as="h2" textAlign="center">Support Us</Header>
              <List>
                <List.Item>
                  <Header as="h3" textAlign="center"><a href="https://www.gofundme.com/">GoFundMe</a></Header>
                </List.Item>
                <List.Item>
                  <Header as="h3" textAlign="center"><a href="https://www.venmo.com/">Venmo</a></Header>
                </List.Item>
              </List>
            </Grid.Column>
          </Grid.Row>
        </Grid>
    );
  }
}

export default ContactUs;
