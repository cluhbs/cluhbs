import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** Create a Meteor collection. */
const Interests = new Mongo.Collection('Interests');

/** Create a schema to constrain the structure of documents associated with this collection. */
const InterestSchema = new SimpleSchema({
  interest: { type: String },
  names: [String],
}, { tracker: Tracker });

/** Attach this schema to the collection. */
Interests.attachSchema(InterestSchema);

/** Make the collection and schema available to other code. */
export { Interests, InterestSchema };
