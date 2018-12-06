import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Admin } from '../../api/admin/admin';

function addData(data) {
  console.log(`  Adding: ${data.owner}`);
  Admin.insert(data);
}

/** Initialize the collection if empty. */
if (Admin.find().count() === 0) {
  if (Meteor.settings.defaultAdmin) {
    console.log('Creating default Admin.');
    Meteor.settings.defaultAdmin.map(data => addData(data));
  }
}

/** This subscription publishes only the documents associated with the logged in user */
Meteor.publish('Admin', function publish() {
  if (this.userId) {
    return Admin.find();
  }
  return this.ready();
});
