import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** Create a Meteor collection. */
const Profiles = new Mongo.Collection('Profiles');
const defaultInterests =
    ['Academic', 'Cultural', 'Health', 'Professional', 'Honorary Society', 'Student Affairs',
      'Literary', 'Publications', 'Service', 'Spirit', 'Sports', 'Recreation', 'Leisure', 'Music',
      'Art', 'Culinary', 'Digital Art', 'Dance', 'Drama/Theatre', 'Fine Arts', 'Performing Arts', 'Visual Art',
      'Civil', 'Religious/Spiritual', 'Fraternity/Sorority', 'Leadership', 'Political'].sort();
const defaultImage = 'https://www.mautic.org/media/images/default_avatar.png';

/** Create a schema to constrain the structure of documents associated with this collection. */
const ProfileSchema = new SimpleSchema({
  firstName: { type: String, defaultValue: '' },
  lastName: { type: String, defaultValue: '' },
  image: { type: String, defaultValue: defaultImage },
  phoneNumber: { type: String, optional: true, label: 'Phone Number' },
  contactEmail: { type: String, defaultValue: '' },
  interests: { type: Array, optional: true, defaultValue: [] },
  'interests.$': { type: String, min: 1 },
  owner: { type: String },
}, { tracker: Tracker });

/** Attach this schema to the collection. */
Profiles.attachSchema(ProfileSchema);

/** Make the collection and schema available to other code. */
export { Profiles, ProfileSchema, defaultInterests, defaultImage };
