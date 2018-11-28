import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class Request extends React.Component {
  render() {
    return (
        <Card centered itemsPerRow={2}>
          <Card.Content>
            <Image floated='left' size='mini' src={this.props.request.image} />
            <Card.Header>
              {this.props.request.firstName} {this.props.request.lastName}
              </Card.Header>
            <Card.Meta>{this.props.request.email}</Card.Meta>
            <Card.Description>
              {this.props.request.message}
            </Card.Description>
          </Card.Content>
        </Card>
    );
  }
}

/** Require a document to be passed to this component. */
Request.propTypes = {
  request: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(Request);
