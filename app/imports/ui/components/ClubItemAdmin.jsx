import React from 'react';
import { Card, Image, Label, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { Bert } from 'meteor/themeteorchef:bert';
import { Clubs } from '/imports/api/club/club';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class ClubItemSuperAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.remove = this.remove.bind(this);
  }

  remove() {
    /* eslint-disable-next-line */
    if (confirm(`Are you sure you want to delete ${this.props.club.name}?`)) {
      Clubs.remove(this.props.club._id, this.deleteCallback);
    }
  }

  deleteCallback(error) {
    if (error) {
      Bert.alert({ type: 'danger', message: `Delete failed: ${error.message}` });
    } else {
      Bert.alert({ type: 'success', message: 'The club has been successfully deleted.' });
    }
  }

  render() {
    return (
        <Card href='#card-example-link-card' color='green' centered>
          <Card.Content>
            <Image fluid src={this.props.club.image}/>
            <Card.Header>
              {this.props.club.name}
            </Card.Header>
            <Card.Meta>
              <a href={this.props.club.website} rel='noopener noreferrer' target='_blank'>{this.props.club.website}</a>
            </Card.Meta>
            <Card.Description>
              {this.props.club.description}
            </Card.Description>
          </Card.Content>
          <Card.Content>
            <Card.Description><strong>Meeting Times:</strong> {this.props.club.meetTime}</Card.Description>
            <Card.Description><strong>Location:</strong> {this.props.club.location}</Card.Description>
            <Card.Description><strong>Contact Person:</strong> {this.props.club.contactPerson}</Card.Description>
            <Card.Description><strong>Contact Info:</strong> {this.props.club.contact}</Card.Description>
          </Card.Content>
          <Card.Content>
            <Label.Group tag color='green'>
              <Label as='a'>
                {this.props.club.interest}
              </Label>
            </Label.Group>
          </Card.Content>
          <Card.Content>
            <Link to={`/club-edit/${this.props.club._id}`}><Button>Edit</Button></Link>
            <Button negative>Delete</Button>
          </Card.Content>
        </Card>
    );
  }
}

/** Require a document to be passed to this component. */
ClubItemSuperAdmin.propTypes = {
  club: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(ClubItemSuperAdmin);
