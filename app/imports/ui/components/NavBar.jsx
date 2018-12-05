import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { Menu, Dropdown, Loader, Image } from 'semantic-ui-react';
import { Roles } from 'meteor/alanning:roles';
import { Clubs } from '/imports/api/club/club';
import { Profiles } from '/imports/api/profile/profile';

/** The NavBar appears at the top of every page. Rendered by the App Layout component. */
class NavBar extends React.Component {

  returnProfile(username) {
    return Profiles.findOne({ owner: username });
  }

  renderWelcomeNavLink() {
    if (this.props.currentUser === '') {
      return (
          <Menu.Item as={NavLink} activeClassName="" exact to="/">
            <Image src='/images/cluhbs-wg.png' size='tiny'/>
          </Menu.Item>
      );
    }
    if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
      return (
          <Menu.Item as={NavLink} activeClassName="active" exact to="/request-admin" key='request-admin'>
            <Image src='/images/cluhbs-wg.png' size='tiny'/>
          </Menu.Item>
      );
    }
    return (
        <Menu.Item as={NavLink} activeClassName="" exact to="/home" key='home'>
          <Image src='/images/cluhbs-wg.png' size='tiny'/>
        </Menu.Item>
    );
  }

  renderClubAdminMenu() {
    if (Clubs.findOne({ owner: this.props.currentUser }) !== undefined) {
      return (
          <Menu.Item as={NavLink} activeClassName="active" exact to={`/club-info/${Clubs.findOne()._id}`}
                     key={'manage'}>Manage Club</Menu.Item>
      );
    }
    return (<Menu.Item as={NavLink} activeClassName="active" exact to="/add" key='add'>Add Club</Menu.Item>);
  }

  renderDropdown() {
    if (this.props.currentUser === '') {
      return (
          <Dropdown pointing="top right" icon={'user'}>
            <Dropdown.Menu>
              <Dropdown.Item icon="user" text="Log in" as={NavLink} exact to="/signin"/>
              <Dropdown.Item icon="add user" text="Register" as={NavLink} exact to="/signup"/>
            </Dropdown.Menu>
          </Dropdown>
      );
    }
    if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
      return (
          <Dropdown text={this.props.currentUser} pointing="top right" icon={'user'}>
            <Dropdown.Menu>
              <Dropdown.Item icon="sign out" text="Sign Out" as={NavLink} exact to="/signout"/>
            </Dropdown.Menu>
          </Dropdown>
      );
    }
    if (Roles.userIsInRole(Meteor.userId(), 'clubAdmin')) {
      return (
          <Dropdown text={this.props.currentUser} pointing="top right" icon={'user'}>
            <Dropdown.Menu>
              <Dropdown.Item icon="user" text="My Profile" as={NavLink}
                             exact to={`/profile/${this.returnProfile(this.props.currentUser)._id}`}/>
              <Dropdown.Item icon="sign out" text="Sign Out" as={NavLink} exact to="/signout"/>
            </Dropdown.Menu>
          </Dropdown>
      );
    }
    return (
        <Dropdown text={this.props.currentUser} pointing="top right" icon={'user'}>
          <Dropdown.Menu>
            <Dropdown.Item icon="user" text="My Profile" as={NavLink}
                           exact to={`/profile/${this.returnProfile(this.props.currentUser)._id}`}/>
            <Dropdown.Item icon="add" text="Make Request" as={NavLink} exact to="/make-request"/>
            <Dropdown.Item icon="sign out" text="Sign Out" as={NavLink} exact to="/signout"/>
          </Dropdown.Menu>
        </Dropdown>
    );
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  renderPage() {
    const menuStyle = { marginBottom: '12px', size: '20px', color: 'white' };
    return (
        <Menu style={menuStyle} attached="top" borderless inverted>
          {this.renderWelcomeNavLink()}
          <Menu.Item as={NavLink} activeClassName="active" exact to="/list" key='list'>Club Directory</Menu.Item>
          {Roles.userIsInRole(Meteor.userId(), 'clubAdmin') ? this.renderClubAdminMenu() : ''}
          <Menu.Item position="right">
            {this.renderDropdown()}
          </Menu.Item>
        </Menu>
    );
  }
}

/** Declare the types of all properties. */
NavBar.propTypes = {
  currentUser: PropTypes.string,
  ready: PropTypes.bool,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
const NavBarContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
  ready: Meteor.subscribe('ClubAdmin').ready() && Meteor.subscribe('Profiles').ready(),
}))(NavBar);

/** Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter */
export default withRouter(NavBarContainer);
