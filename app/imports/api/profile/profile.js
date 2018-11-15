import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** Create a Meteor collection. */
const Profiles = new Mongo.Collection('Profiles');
const defaultInterests = ['Art', 'Academic', 'Music'];

/** Create a schema to constrain the structure of documents associated with this collection. */
const ProfileSchema = new SimpleSchema({
  firstName: String,
  lastName: String,
  image: { type: String, optional: true, defaultValue: '' },
  phoneNumber: { type: String, optional: true },
  contactEmail: { type: String, defaultValue: '' },
  interests: { type: Array, optional: true },
  'interests.$': { type: String },
  owner: { type: String },
}, { tracker: Tracker });

/** Attach this schema to the collection. */
Profiles.attachSchema(ProfileSchema);

/** Make the collection and schema available to other code. */
export { Profiles, ProfileSchema, defaultInterests };
