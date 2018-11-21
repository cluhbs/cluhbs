import React from 'react';
import { Card, Image, Label, Container } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class ClubItem extends React.Component {
  render() {
    return (
        <Card color='green' centered>
          <Card.Content>
            <Container textAlign='center'>
              <Image style={{ height: '190px', paddingBottom: '10px' }} src={this.props.club.image}/>
            </Container>
            <Card.Header content={this.props.club.name}/>
            <Card.Meta>
              <a href={this.props.club.website} rel='noopener noreferrer' target='_blank'>{this.props.club.website}</a>
            </Card.Meta>
            <Card.Description>
              {this.props.club.description.substring(0, 250)}{(this.props.club.description.length > 250) ? '...' : ''}
            </Card.Description>
            <Card.Description><Link to={`/club-info/${this.props.club._id}`}>Learn More</Link></Card.Description>
          </Card.Content>
          <Card.Content>
            <Label.Group tag color='green'>
              {this.props.club.interests.map((interest, index) => <Label key={index} content={interest}/>)}
            </Label.Group>
          </Card.Content>
        </Card>
    );
  }
}

/** Require a document to be passed to this component. */
ClubItem.propTypes = {
  club: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(ClubItem);
