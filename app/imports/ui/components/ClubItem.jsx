import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Card, Image, Label, Container } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, Link } from 'react-router-dom';
import { Profiles } from '/imports/api/profile/profile';
import { Bert } from 'meteor/themeteorchef:bert';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class ClubItem extends React.Component {

  constructor(props) {
    super(props);
    this.onClickSaveClub = this.onClickSaveClub.bind(this);
  }

  updateCallback(error) {
    if (error) {
      Bert.alert({ type: 'danger', message: `Profile update failed: ${error.message}` });
    } else {
      Bert.alert({ type: 'success', message: 'Profile update succeeded' });
    }
  }

  onClickSaveClub() {
    const userProfile = Profiles.findOne({ owner: this.props.currentUser.username });
    const clubs = userProfile.clubs.push(this.props.club);
    Profiles.update(userProfile._id, { $set: { clubs } }, this.updateCallback(this.error));
  }

  render() {
    Meteor.subscribe('Profiles');
    // const userProfile = Profiles.findOne({ owner: this.props.currentUser.username });
    return (
        <Card color='green' centered>
          {/* <Label corner='right' icon='star' color='yellow' onClick={this.onClickSaveClub}></Label> */}
          <Card.Content>
            <Container textAlign='center'>
              <Image style={{ height: '190px', paddingBottom: '10px' }} src={this.props.club.image}/>
            </Container>
            <Card.Header content={this.props.club.name}/>
            <Card.Meta>
              <a href={this.props.club.website}>{this.props.club.website}</a>
            </Card.Meta>
            <Card.Description>
              {this.props.club.description.substring(0, 250)}{(this.props.club.description.length > 250) ? '...' : ''}
            </Card.Description>
            <Card.Description textAlign='right'>
              <Link to={`/club-info/${this.props.club._id}`}>Learn More</Link>
            </Card.Description>
          </Card.Content>
          <Card.Content>
            <Label.Group tag color='green'>
              {this.props.club.interests.map((interest, index) => <Label key={index} content={interest}/>)}
            </Label.Group>
          </Card.Content>
          {/* <Card.Content>
            <Button icon='star' color='yellow' onClick={this.onClickSaveClub} />
          </Card.Content> */}
        </Card>
    );
  }
}

/** Require a document to be passed to this component. */
ClubItem.propTypes = {
  club: PropTypes.object.isRequired,
  currentUser: PropTypes.string,
};

const ClubItemContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
}))(ClubItem);

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(ClubItemContainer);
