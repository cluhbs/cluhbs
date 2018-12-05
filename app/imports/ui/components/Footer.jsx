import React from 'react';
import { Grid, List, Image } from 'semantic-ui-react';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
class Footer extends React.Component {
  render() {
    const gridPadding = { paddingTop: '36px', paddingLeft: '160px', paddingRight: '160px', paddingBottom: '25px', marginBottom: '0px' };
    const bolded = { fontWeight: 'bold' };
    const linkColor = { color: 'green' };
    return (
        <div className="footer-background">
          <Grid container centered style={gridPadding}>
            <Grid.Row columns={4}>
              <Grid.Column>
                <Grid.Row>
                  <Image src='/images/cluhbs-footer.png'/>
                </Grid.Row>
              </Grid.Column>
              <Grid.Column>
                <p style={bolded}>CONNECT</p>
                <hr/>
                <List>
                  <List.Item style={linkColor} href='https://github.com/cluhbs' target='_blank'>CLUHBS</List.Item>
                  <List.Item style={linkColor} href='https://cluhbs.github.io/' target='_blank'>MORE INFO</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column>
                <p style={bolded}>HELP</p>
                <hr/>
                <List>
                  <List.Item style={linkColor} href='tbd'>HELP PAGE</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column>
                <p style={bolded}>DEVELOPERS</p>
                <hr/>
                <List>
                  <List.Item>KATHLEEN DY</List.Item>
                  <List.Item>KYLIE LIN</List.Item>
                  <List.Item>LEISHA SOBERANO-KEAWEMAUHILI</List.Item>
                  <List.Item>KEANU WILLIAMS</List.Item>
                </List>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
    );
  }
}

export default Footer;
