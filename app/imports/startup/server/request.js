import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Requests } from '../../api/request/request.js';

/** Initialize the database with a default data document. */
function addData(data) {
  console.log(`  Adding: ${data.email} (${data.owner})`);
  Requests.insert(data);
}

/** Initialize the collection if empty. */
if (Requests.find().count() === 0) {
  if (Meteor.settings.defaultRequests) {
    console.log('Creating default request.');
    Meteor.settings.defaultRequests.map(data => addData(data));
  }
}

/** This subscription publishes only the documents associated with the logged in user */
Meteor.publish('Requests', function publish() {
  if (this.userId) {
    const username = Meteor.users.findOne(this.userId).username;
    return Requests.find({ owner: username });
  }
  return this.ready();
});

/** This subscription publishes all documents regardless of user, but only if the logged in user is the Admin. */
Meteor.publish('RequestsAdmin', function publish() {
  if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
    return Requests.find();
  }
  return this.ready();
});
