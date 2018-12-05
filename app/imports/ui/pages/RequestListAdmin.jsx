import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Header, Loader, Card } from 'semantic-ui-react';
import { Requests } from '/imports/api/request/request';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import RequestAdmin from '/imports/ui/components/RequestAdmin';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class RequestListAdmin extends React.Component {
  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const contentStyle = { marginBottom: '50px' };
    return (
        <div style={contentStyle}>
          <Container>
            <Header as="h2" textAlign="center">Request List</Header>
            <Card.Group centered itemsPerRow={2}>
              {this.props.requests.map((request, index) => <RequestAdmin key={index} request={request}/>)}
            </Card.Group>
          </Container>
        </div>
    );
  }
}

/** Require an array of Stuff documents in the props. */
RequestListAdmin.propTypes = {
  requests: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe('RequestsAdmin');
  return {
    requests: Requests.find({}).fetch(),
    ready: subscription.ready(),
  };
})(RequestListAdmin);
