import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import 'semantic-ui-css/semantic.css';
import { Roles } from 'meteor/alanning:roles';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Landing from '../pages/Landing';
import EditProfile from '../pages/EditProfile';
import DisplayProfile from '../pages/DisplayProfile';
import ClubDirectorySuperAdmin from '../pages/ClubDirectorySuperAdmin';
import ManageClubAdmin from '../pages/ManageClubAdmin';
import ClubDirectory from '../pages/ClubDirectory';
import RequestList from '../pages/RequestList';
import RequestListAdmin from '../pages/RequestListAdmin';
import AddClub from '../pages/AddClub';
import MakeRequest from '../pages/MakeRequest';
import EditClub from '../pages/EditClub';
import DisplayClub from '../pages/DisplayClub';
import NotFound from '../pages/NotFound';
import Signin from '../pages/Signin';
import Signup from '../pages/Signup';
import Signout from '../pages/Signout';

/** Top-level layout component for this application. Called in imports/startup/client/startup.jsx. */
class App extends React.Component {
  render() {
    return (
        <Router>
          <div>
            <NavBar/>
            <Switch>
              <Route exact path="/" component={Landing}/>
              <Route path="/signin" component={Signin}/>
              <Route path="/signup" component={Signup}/>
              <ProtectedRoute path="/profile" component={DisplayProfile}/>
              <ProtectedRoute path="/profile-edit" component={EditProfile}/>
              <ProtectedRoute path="/list" component={ClubDirectory}/>
              <ProtectedRoute path="/request-list" component={RequestList}/>
              <ProtectedRoute path="/manage" component={ManageClubAdmin}/>
              <ProtectedRoute path="/add" component={AddClub}/>
              <ProtectedRoute path="/make-request" component={MakeRequest}/>
              <ProtectedRoute path="/club-edit/:_id" component={EditClub}/>
              <ProtectedRoute path="/club-info/:_id" component={DisplayClub}/>
              <AdminProtectedRoute path="/admin" component={ClubDirectorySuperAdmin}/>
              <AdminProtectedRoute path="/request-admin" component={RequestListAdmin}/>
              <ProtectedRoute path="/signout" component={Signout}/>
              <Route component={NotFound}/>
            </Switch>
            <Footer/>
          </div>
        </Router>
    );
  }
}

/**
 * ProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const isLogged = Meteor.userId() !== null;
      return isLogged ?
          (<Component {...props} />) :
          (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
      );
    }}
  />
);

/**
 * AdminProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const AdminProtectedRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={(props) => {
          const isLogged = Meteor.userId() !== null;
          const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
          return (isLogged && isAdmin) ?
              (<Component {...props} />) :
              (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
              );
        }}
    />
);

/** Require a component and location to be passed to each ProtectedRoute. */
ProtectedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  location: PropTypes.object,
};

/** Require a component and location to be passed to each AdminProtectedRoute. */
AdminProtectedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  location: PropTypes.object,
};

export default App;
