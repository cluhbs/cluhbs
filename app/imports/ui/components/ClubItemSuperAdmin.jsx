import React from 'react';
import { Card, Image, Label, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class ClubItemSuperAdmin extends React.Component {
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
            <Link to={`/edit/${this.props.club._id}`}><Button>Edit</Button></Link>
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
