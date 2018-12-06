import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** Create a Meteor collection. */
const Admin = new Mongo.Collection('Admin');
const newClubNotificationOptionsA = [
  'Notify me of any new clubs',
  'Do not send me notifications when new clubs are added to the Club Directory',
];
const updatedClubNotificationOptions = [
  'Notify me of any changes to current club information',
  'Do not notify me of any changes to current club information',
];

/** Create a schema to constrain the structure of documents associated with this collection. */
const AdminSchema = new SimpleSchema({
  phoneNumber: { type: String, optional: true, label: 'Phone Number' },
  contactEmail: { type: String, optional: true, label: 'Contact Email' },
  newClubs: { type: Array, optional: true, defaultValue: [] },
  'newClubs.$': { type: String },
  newClubNotifications: {
    type: String, defaultValue: newClubNotificationOptionsA[0], allowedValues: newClubNotificationOptionsA, label: '',
  },
  updatedClubs: { type: Array, optional: true, defaultValue: [] },
  'updatedClubs.$': { type: String },
  updatedClubNotifications: {
    type: String,
    defaultValue: updatedClubNotificationOptions[0], allowedValues: updatedClubNotificationOptions, label: '',
  },
  emailNotifications: { type: Boolean, optional: true, defaultValue: false, label: 'Send me email notifications' },
  textNotifications: { type: Boolean, optional: true, defaultValue: false, label: 'Send me text notifications' },
  messages: { type: Array, defaultValue: [] },
  'messages.$': { type: String, min: 1 },
  owner: { type: String },
}, { tracker: Tracker });

/** Attach this schema to the collection. */
Admin.attachSchema(AdminSchema);

/** Make the collection and schema available to other code. */
export { Admin, AdminSchema, newClubNotificationOptionsA, updatedClubNotificationOptions };
