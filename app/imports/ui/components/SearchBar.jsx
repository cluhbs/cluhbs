import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import { Meteor } from "meteor/meteor";
import ClubItem from '/imports/ui/components/ClubItem';

const interestOptions = [
  { key: 1, value: 'Academic', text: 'Academic' },
  { key: 9, value: 'Professional', text: 'Professional' },
  { key: 3, value: 'Ethnic', text: 'Ethnic' },
  { key: 2, value: 'Cultural', text: 'Cultural' },
  { key: 4, value: 'Fan Club', text: 'Fan Club' },
  { key: 5, value: 'Fraternity', text: 'Fraternity' },
  { key: 13, value: 'Sorority', text: 'Sorority' },
  { key: 7, value: 'Leisure', text: 'Leisure' },
  { key: 10, value: 'Recreational', text: 'Recreational' },
  { key: 6, value: 'Honorary Society', text: 'Honorary Society' },
  { key: 8, value: 'Political', text: 'Political' },
  { key: 11, value: 'Religious', text: 'Religious' },
  { key: 14, value: 'Spiritual', text: 'Spiritual' },
  { key: 12, value: 'Service', text: 'Service' },
  { key: 15, value: 'Sport', text: 'Sport' },
  { key: 16, value: 'Student Affairs', text: 'Student Affairs' },
];

const interestLabel = label => ({ color: 'green', content: `${label.text}` });

class SearchBar extends React.Component {
  constructor() {
    super();
    this.state = {
      searchQuery: '',
      selected: null,
    };
  }

  onChange = (e, data) => {
    console.log(data.value);
    this.setState({ selected: data.value });
  }

  onSearchChange = (e, data) => {
    console.log(data.searchQuery);
    this.setState({ searchQuery: data.searchQuery });
  }

  render() {
    const { searchQuery, selected } = this.state;
    return (
        <Dropdown
            placeholder='Select an Interest'
            fluid multiple search selection
            options={interestOptions}
            renderLabel={interestLabel}
            searchQuery={searchQuery}
            value={selected}
            onChange={this.onChange}
            onSearchChange={this.onSearchChange}
        />
        <ClubItem/>
    );
  }

}

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe('Clubs');
  const subscription2 = Meteor.subscribe('Profiles');
  return {
    clubs: Clubs.find({}).fetch().sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    }),
    ready: subscription.ready() && subscription2.ready(),
  };
})(SearchBar);
