import React from 'react';
import { Card, Image, Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class Club extends React.Component {
  render() {
    return (
        <Card href='#card-example-link-card' color='green' centered>
          <Card.Content>
            <Image fluid src={this.props.club.image}/>
            <Card.Header>
              {this.props.club.name}
            </Card.Header>
            <Card.Meta>
              {this.props.club.website}
            </Card.Meta>
            <Card.Description>
              {this.props.club.description}
            </Card.Description>
          </Card.Content>
          <Card.Content>
            <Card.Description>Meeting Times: {this.props.club.meetTime}</Card.Description>
            <Card.Description>Location: {this.props.club.location}</Card.Description>
            <Card.Description>Contact: {this.props.club.contact}</Card.Description>
          </Card.Content>
          <Card.Content>
            <Label.Group tag color='green'>
              <Label as='a'>
                {this.props.club.interest}
              </Label>
            </Label.Group>
          </Card.Content>
        </Card>
    );
  }
}

/** Require a document to be passed to this component. */
Club.propTypes = {
  club: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(Club);
