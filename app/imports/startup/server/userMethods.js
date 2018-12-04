import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

/* eslint-disable no-console */

Meteor.methods({
  'updateRoles'({ targetUserId, roles }) {
    const isLogged = Meteor.user();
    if (!isLogged || !Roles.userIsInRole(isLogged, 'admin')) {
      throw new Meteor.Error(403, 'Access denied');
    }
    Roles.setUserRoles(targetUserId, roles);
  },
});
