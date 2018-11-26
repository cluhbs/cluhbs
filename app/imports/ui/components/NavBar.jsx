import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { Menu, Dropdown, Header } from 'semantic-ui-react';
import { Roles } from 'meteor/alanning:roles';
import { Clubs } from '/imports/api/club/club';

/** The NavBar appears at the top of every page. Rendered by the App Layout component. */
class NavBar extends React.Component {
  render() {
    const menuStyle = { marginBottom: '10px' };
    Meteor.subscribe('ClubAdmin');
    return (
        <Menu style={menuStyle} attached="top" borderless inverted color='green'>
          <Menu.Item as={NavLink} activeClassName="" exact to="/">
            <Header inverted as='h1'>clUHbs</Header>
          </Menu.Item>
          {(this.props.currentUser && (this.props.currentUser !== 'admin@foo.com')) ? (
              [<Menu.Item as={NavLink} activeClassName="active" exact to="/list" key='list'>Club Directory</Menu.Item>]
          ) : ''}
          {Roles.userIsInRole(Meteor.userId(), 'clubAdmin') &&
          (Clubs.findOne({ owner: this.props.currentUser }) !== undefined) ? (
                <Menu.Item as={NavLink} activeClassName="active" exact to={`/club-info/${Clubs.findOne()._id}`}
                          key={'manage'}>Manage Club</Menu.Item>
          ) : ''}
          {Roles.userIsInRole(Meteor.userId(), 'admin') ? (
              [<Menu.Item as={NavLink} activeClassName="active" exact to="/request-list"
                          key='request-list'>Requests</Menu.Item>,
                  <Menu.Item as={NavLink} activeClassName="active" exact to="/add" key='add'>Add Club</Menu.Item>,
                <Menu.Item as={NavLink} activeClassName="active" exact to="/admin"
                           key='admin'>Club Directory</Menu.Item>]
          ) : ''}
          <Menu.Item position="right">
            {this.props.currentUser === '' ? (
                <Dropdown pointing="top right" icon={'user'}>
                  <Dropdown.Menu>
                    <Dropdown.Item icon="user" text="Log in" as={NavLink} exact to="/signin"/>
                    <Dropdown.Item icon="add user" text="Register" as={NavLink} exact to="/signup"/>
                  </Dropdown.Menu>
                </Dropdown>
            ) : (
                <Dropdown text={this.props.currentUser} pointing="top right" icon={'user'}>
                  <Dropdown.Menu>
                    <Dropdown.Item icon="user" text="My Profile" as={NavLink} exact to="/profile"/>
                    <Dropdown.Item icon="sign out" text="Sign Out" as={NavLink} exact to="/signout"/>
                  </Dropdown.Menu>
                </Dropdown>
            )}
          </Menu.Item>
        </Menu>
    );
  }
}

/** Declare the types of all properties. */
NavBar.propTypes = {
  currentUser: PropTypes.string,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
const NavBarContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
}))(NavBar);

/** Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter */
export default withRouter(NavBarContainer);
