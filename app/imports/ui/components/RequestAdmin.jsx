import React from 'react';
import { Card, Image, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Bert } from 'meteor/themeteorchef:bert';
import { Meteor } from 'meteor/meteor';
import { Requests } from '/imports/api/request/request';
import { Profiles } from '/imports/api/profile/profile';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class RequestAdmin extends React.Component {

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(e, data) {
    const userProfile = Profiles.findOne({ owner: this.props.request.owner });
    /* eslint-disable-next-line */
    const affirm = confirm(`Are you sure you want to ${data.value} this request?`);
    if (affirm) {
      let message = 'Your request to become a club admin has been denied.';
      if (e.target.value === 'accept' || data.value === 'accept') {
        Meteor.call('updateRoles', {
          targetUserId: this.props.request.userId,
          roles: 'clubAdmin',
        });
        message = 'Your request to become a Club Admin has been approved. ' +
            'You may now add your club to the Club Directory by clicking on the Add Club tab in the Navigation Bar.';
      }
      const messages = userProfile.messages.concat(message);
      Profiles.update(userProfile._id, { $set: { messages } });
      Requests.remove(this.props.request._id, this.callback);
    }
  }

  callback(error) {
    if (error) {
      Bert.alert({ type: 'danger', message: `Action failed: ${error.message}` });
    } else {
      Bert.alert({ type: 'success', message: 'Action succeeded' });
    }
  }

  render() {
    return (
        <Card>
          <Card.Content>
            <Image floated='left' size='mini' src={this.props.request.image}/>
            <Card.Header>
              {this.props.request.firstName} {this.props.request.lastName}
            </Card.Header>
            <Card.Meta>{this.props.request.contactEmail}</Card.Meta>
            <Card.Description textAlign='left'>
              {this.props.request.message}
            </Card.Description>
          </Card.Content>
          <Button.Group>
            <Button onClick={this.onClick} value='accept' positive>Accept</Button>
            <Button onClick={this.onClick} value='deny' negative>Deny</Button>
          </Button.Group>
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
