import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Header, Loader, Card } from 'semantic-ui-react';
import { Requests } from '/imports/api/request/request';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import Request from '/imports/ui/components/Request';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class RequestList extends React.Component {
  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    return (
        <Container>
          <Header as="h2" textAlign="center">Request List</Header>
          <Card.Group>
            {this.props.requests.map((request, index) => <Request key={index} request={request} />)}
          </Card.Group>
        </Container>
    );
  }
}

/** Require an array of Stuff documents in the props. */
RequestList.propTypes = {
  requests: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe('Requests');
  return {
    requests: Requests.find({}).fetch(),
    ready: subscription.ready(),
  };
})(RequestList);
