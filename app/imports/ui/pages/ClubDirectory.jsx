import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Header, Loader, Card, Dropdown } from 'semantic-ui-react';
import { Clubs } from '/imports/api/club/club';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import ClubItem from '/imports/ui/components/ClubItem';

const interestOptions = [
  { value: 'Academic', text: 'Academic' },
  { value: 'Cultural', text: 'Cultural' },
  { value: 'Ethnic', text: 'Ethnic' },
  { value: 'Fan Club', text: 'Fan Club' },
  { value: 'Fraternity', text: 'Fraternity' },
  { value: 'Honorary Society', text: 'Honorary Society' },
  { value: 'Leisure', text: 'Leisure' },
  { value: 'Political', text: 'Political' },
  { value: 'Professional', text: 'Professional' },
  { value: 'Recreational', text: 'Recreational' },
  { value: 'Religious', text: 'Religious' },
  { value: 'Service', text: 'Service' },
  { value: 'Sorority', text: 'Sorority' },
  { value: 'Spiritual', text: 'Spiritual' },
  { value: 'Sports', text: 'Sports' },
  { value: 'Student Affairs', text: 'Student Affairs' },
];

const interestLabel = label => ({ color: 'green', content: `${label.text}` });

let searching = [];

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class ClubDirectory extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: null,
    };
  }

  onChange = (e, data) => {
    this.setState({ selected: data.value });
    searching = data.value;
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const cardPadding = { padding: '30px 0px 0px 0px' };
    const contentStyle = { marginBottom: '50px' };
    const { selected } = this.state;
    const filterClubs = () => {
      if (searching.length === 0) {
        return this.props.clubs.map((club, index) => <ClubItem key={index} club={club}/>);
      }
      /* eslint-disable-next-line */
      return this.props.clubs.filter((club) => club.interests.some(r => searching.includes(r))).map((club, index) => <ClubItem key={index} club={club}/>);
    };
    return (
        <div style={contentStyle}>
        <Container>
          <Header as="h2" dividing textAlign="center">Club Directory</Header>
          <Dropdown
              placeholder='Select an Interest'
              fluid multiple selection
              options={interestOptions}
              renderLabel={interestLabel}
              value={selected}
              onChange={this.onChange}
          />
          <Card.Group style={cardPadding}>
            {filterClubs()}
          </Card.Group>
        </Container>
        </div>
    );
  }
}

/** Require an array of Stuff documents in the props. */
ClubDirectory.propTypes = {
  clubs: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Clubs and Profiles documents.
  const subscription = Meteor.subscribe('Clubs');
  const subscription2 = Meteor.subscribe('Profiles');
  return {
    clubs: Clubs.find({}).fetch().sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    }),
    ready: subscription.ready() && subscription2.ready(),
  };
})(ClubDirectory);
