import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Stuffs } from '/imports/api/stuff/stuff';
import { Container, Card, Header, Image, Input, Label } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class ClubDirectory extends React.Component {

  /** Render the page once subscriptions have been received. */
  render() {
    const searchBar = { padding: '30px 0px 30px 0px' };
    return (
        <Container>
          <Header as="h1" dividing textAlign="center">Club Directory</Header>
          <Input style={searchBar} fluid icon='search' placeholder='Search...' />
          <Card.Group itemsPerRow={4}>
            <Card href='#card-example-link-card' color='green'>
              {/* eslint-disable-next-line */}
              <Image fluid src='http://static1.squarespace.com/static/57e48324579fb35bcfcd4bd6/t/57e4a2f615d5db083266d200/1541540054230/?format=1500w'/>
              <Card.Content>
                <Card.Header>American Institute of Architecture Students</Card.Header>
                <Card.Meta><a>aiashawaii.com</a></Card.Meta>
                <Card.Description>AIAS Hawaii is a student-run, non-profit organization whose
                  mission is to promote excellence in architectural education, training, and
                  practice; to foster an appreciation of architecture and related disciplines;
                  to enrich communities in a spirit of collaboration; and to organize students
                  and combine efforts to advance the art and science of architecture.
                </Card.Description>
              </Card.Content>
                <Card.Content>
                  <Label.Group tag color='green'>
                    <Label as='a'>Academic</Label>
                    <Label as='a'>Professional</Label>
                  </Label.Group>
                </Card.Content>
            </Card>
            <Card href='#card-example-link-card' color='green'>
              {/* eslint-disable-next-line */}
              <Image fluid src='https://ckiuhm.weebly.com/uploads/8/6/7/3/86734930/11994145-1125200664174836-55470367-o_orig.jpg'/>
              <Card.Content>
                <Card.Header>Circle K International at the University of Hawaii at Manoa</Card.Header>
                <Card.Meta><a>ckiuhm.weebly.com</a></Card.Meta>
                <Card.Description>Circle K International (CKI) at the University of
                  Hawai`i at Manoa was founded in 1978. We are a premier
                  collegiate community service club, leadership development,
                  and friendship organization in the world.
                </Card.Description>
              </Card.Content>
                <Card.Content>
                  <Label as='a' color='green' tag>Service</Label>
                </Card.Content>
            </Card>
            <Card href='#card-example-link-card' color='green'>
              {/* eslint-disable-next-line */}
              <Image fluid centered size='small' src='https://static1.squarespace.com/static/5209b34be4b00fb51876dab6/t/53c7ebbce4b075b2a1fa3a85/1405610964121/?format=500w'/>
              <Card.Content>
                <Card.Header>Delta Sigma Pi</Card.Header>
                <Card.Meta><a>dspuhm.com</a></Card.Meta>
                <Card.Description>Delta Sigma Pi is a professional fraternity organized
                  to foster the study of business in universities; to encourage
                  scholarship and social activity, and to further a higher standard of
                  commercial ethics and culture and the civic and commercial welfare
                  of the community.
                </Card.Description>
              </Card.Content>
                <Card.Content>
                  <Label.Group tag color='green'>
                    <Label as='a'>Fraternity</Label>
                    <Label as='a'>Sorority</Label>
                  </Label.Group>
                </Card.Content>
            </Card>
            <Card href='#card-example-link-card' color='green'>
              {/* eslint-disable-next-line */}
              <Image fluid src='http://manoa.hawaii.edu/rio/timpuyog/img/timpuyogbanner.png'/>
              <Card.Content>
                <Card.Header>Timpuyog Organization</Card.Header>
                <Card.Meta><a>http://manoa.hawaii.edu/rio/timpuyog</a></Card.Meta>
                <Card.Description>Timpuyog (“togetherness”) is the organization of
                  students enrolled in various courses offered by the Ilokano Language
                  and Literature Program (ILLP) at UH Mānoa.
                </Card.Description>
              </Card.Content>
              <Card.Content>
                <Label.Group tag color='green'>
                  <Label as='a'>Ethnic</Label>
                  <Label as='a'>Cultural</Label>
                </Label.Group>
              </Card.Content>
            </Card>
            <Card href='#card-example-link-card' color='green'>
              {/* eslint-disable-next-line */}
              <Image fluid src='http://www2.hawaii.edu/~jugglers/images/rainbow.gif'/>
              <Card.Content>
                <Card.Header>Rainbow Jugglers Juggling Club</Card.Header>
                <Card.Meta><a>www.rainbowjugglers.org</a></Card.Meta>
                <Card.Description>
                </Card.Description>
              </Card.Content>
              <Card.Content>
                <Label.Group tag color='green'>
                  <Label as='a'>Sports</Label>
                  <Label as='a'>Leisure</Label>
                </Label.Group>
              </Card.Content>
            </Card>
          </Card.Group>
        </Container>
    );
  }
}

/** Require an array of Stuff documents in the props. */
ClubDirectory.propTypes = {
  stuffs: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe('Stuffs');
  return {
    stuffs: Stuffs.find({}).fetch(),
    ready: subscription.ready(),
  };
})(ClubDirectory);
