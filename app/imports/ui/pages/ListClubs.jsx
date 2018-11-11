import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Header, Loader, Card, Input } from 'semantic-ui-react';
import { Stuffs } from '/imports/api/stuff/stuff';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import Club from '/imports/ui/components/Club';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class ListClubs extends React.Component {

  clubs = [{
    image: 'http://static1.squarespace.com/static/57e48324579fb35bcfcd4bd6/t/' +
        '57e4a2f615d5db083266d200/1541540054230/?format=1500w',
    name: 'American Institute of Architecture Students',
    website: 'aiashawaii.com',
    description: 'AIAS Hawaii is a student-run, non-profit organization whose mission is to promote excellence in' +
        'architectural education, training, and practice; to foster an appreciation of architecture and related' +
        'disciplines; to enrich communities in a spirit of collaboration; and to organize students and combine' +
        'efforts to advance the art and science of architecture.',
    meetTime: 'Tues 5-7pm',
    location: 'Honolulu, Hi 96822',
    contact: '1(808)293-1830',
    interest: 'Academic',
  },
    {
      image: 'https://ckiuhm.weebly.com/uploads/8/6/7/3/86734930/11994145-1125200664174836-55470367-o_orig.jpg',
      name: 'Circle K International at the University of Hawaii at Manoa',
      website: 'ckiuhm.weebly.com',
      description: 'Circle K International (CKI) at the University of Hawai`i at Manoa was founded in 1978.' +
          'We are a premier collegiate community service club, leadership development, and friendship' +
          'organization in the world.',
      meetTime: 'MWF 1:30-4pm',
      location: '2500 Campus Rd',
      contact: '1(808)123-4567',
      interest: 'Service',
    },
    {
      image: 'http://manoa.hawaii.edu/rio/timpuyog/img/timpuyogbanner.png',
      name: 'Timpuyog Organization',
      website: 'http://manoa.hawaii.edu/rio/timpuyog',
      description: 'Timpuyog (“togetherness”) is the organization of students enrolled in various courses' +
          'offered by the Ilokano Language and Literature Program (ILLP) at UH Mānoa.',
      meetTime: 'All weekdays 2-5pm',
      location: 'Queen Liliuokalani Center',
      contact: '1(808)231-5768',
      interest: 'Cultural',
    },
  ];

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const searchBar = { padding: '30px 0px 30px 0px' };
    return (
        <Container>
          <Header as="h2" textAlign="center">List Clubs</Header>
          <Input style={searchBar} fluid icon='search' placeholder='Search...' />
          <Card.Group itemsPerRow={3}>
            {this.clubs.map((club, index) => <Club key={index} club={club} />)}
          </Card.Group>
        </Container>
    );
  }
}

/** Require an array of Stuff documents in the props. */
ListClubs.propTypes = {
  stuffs: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe('Stuff');
  return {
    stuffs: Stuffs.find({}).fetch(),
    ready: subscription.ready(),
  };
})(ListClubs);
