import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** Create a Meteor collection. */
const Requests = new Mongo.Collection('Requests');

/** Create a schema to constrain the structure of documents associated with this collection. */
const RequestSchema = new SimpleSchema({
  firstName: String,
  lastName: String,
  email: String,
  image: String,
  message: String,
  owner: String,
}, { tracker: Tracker });

/** Attach this schema to the collection. */
Requests.attachSchema(RequestSchema);

/** Make the collection and schema available to other code. */
export { Requests, RequestSchema };
