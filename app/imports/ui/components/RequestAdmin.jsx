import React from 'react';
import { Card, Image, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Bert } from 'meteor/themeteorchef:bert';
import { Requests } from '/imports/api/request/request';


/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class RequestAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    /* eslint-disable-next-line */
    var affirm = confirm("Do you really want to delete this contact?");
    if (affirm) {
      Requests.remove(this.props.request._id, this.deleteCallback);
    }
  }

  deleteCallback(error) {
    if (error) {
      Bert.alert({ type: 'danger', message: `delete failed: ${error.message}` });
    } else {
      Bert.alert({ type: 'success', message: 'delete succeeded' });
    }
  }

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
          <Card.Content extra>
            <Button onClick={this.onClick}>Delete</Button>
          </Card.Content>
        </Card>
    );
  }
}

/** Require a document to be passed to this component. */
RequestAdmin.propTypes = {
  request: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(RequestAdmin);
