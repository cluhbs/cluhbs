import { Meteor } from 'meteor/meteor';
import { Profiles } from '../../api/profile/profile';

/** Initialize the database with a default data document. */
function addData(data) {
  console.log(`  Adding: ${data.firstName} ${data.lastName} (${data.owner})`);
  Profiles.insert(data);
}

/** Initialize the collection if empty. */
if (Profiles.find().count() === 0) {
  if (Meteor.settings.defaultProfiles) {
    console.log('Creating default Profiles.');
    Meteor.settings.defaultProfiles.map(data => addData(data));
  }
}

/** This subscription publishes only the documents associated with the logged in user */
Meteor.publish('Profiles', function publish() {
  // if (this.userId) {
  //   const username = Meteor.users.findOne(this.userId).username;
  //   return Profiles.find({ owner: username });
  // }
  if (this.userId) {
    return Profiles.find();
  }
  return this.ready();
});
