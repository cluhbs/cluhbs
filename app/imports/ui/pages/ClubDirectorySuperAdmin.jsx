import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Header, Loader, Card } from 'semantic-ui-react';
import { Clubs } from '/imports/api/club/club';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import ClubItemSuperAdmin from '/imports/ui/components/ClubItemSuperAdmin';
import SearchBar from '/imports/ui/components/SearchBar';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class ClubDirectorySuperAdmin extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const cardPadding = { padding: '30px 0px 0px 0px' };
    return (
        <Container>
          <Header as="h2" dividing textAlign="center">Club Directory</Header>
          <SearchBar/>
          <Card.Group itemsPerRow={3} style={cardPadding}>
            {this.props.clubs.map((club, index) => <ClubItemSuperAdmin key={index} club={club} />)}
          </Card.Group>
        </Container>
    );
  }
}

/** Require an array of Stuff documents in the props. */
ClubDirectorySuperAdmin.propTypes = {
  clubs: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe('Clubs');
  return {
    clubs: Clubs.find({}).fetch(),
    ready: subscription.ready(),
  };
})(ClubDirectorySuperAdmin);
