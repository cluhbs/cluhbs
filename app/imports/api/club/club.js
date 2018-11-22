import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** Create a Meteor collection. */
const Clubs = new Mongo.Collection('Clubs');

/** Create a schema to constrain the structure of documents associated with this collection. */
const ClubSchema = new SimpleSchema({
  image: { type: String, optional: true },
  name: { type: String },
  website: { type: String, optional: true },
  description: { type: String },
  meetTime: { type: String },
  location: { type: String },
  contactPerson: { type: String },
  contactEmail: { type: String },
  interests: { type: Array, defaultValue: [] },
  'interests.$': { type: String, min: 1 },
  members: { type: Array, defaultValue: [] },
  'members.$': { type: String },
  owner: { type: String },
}, { tracker: Tracker });

/** Attach this schema to the collection. */
Clubs.attachSchema(ClubSchema);

/** Make the collection and schema available to other code. */
export { Clubs, ClubSchema };
