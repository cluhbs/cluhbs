import React from 'react';
import { Dropdown } from 'semantic-ui-react';

const interestOptions = [
  { key: 1, value: 'Academic', text: 'Academic' },
  { key: 2, value: 'Cultural', text: 'Cultural' },
  { key: 3, value: 'Ethnic', text: 'Ethnic' },
  { key: 4, value: 'Fan Club', text: 'Fan Club' },
  { key: 5, value: 'Fraternity', text: 'Fraternity' },
  { key: 6, value: 'Honorary Society', text: 'Honorary Society' },
  { key: 7, value: 'Leisure', text: 'Leisure' },
  { key: 8, value: 'Political', text: 'Political' },
  { key: 9, value: 'Professional', text: 'Professional' },
  { key: 10, value: 'Recreational', text: 'Recreational' },
  { key: 11, value: 'Religious', text: 'Religious' },
  { key: 12, value: 'Service', text: 'Service' },
  { key: 13, value: 'Sorority', text: 'Sorority' },
  { key: 14, value: 'Spiritual', text: 'Spiritual' },
  { key: 15, value: 'Sport', text: 'Sport' },
  { key: 16, value: 'Student Affairs', text: 'Student Affairs' },
];

const interestLabel = label => ({ color: 'green', content: `${label.text}` });
const selectedInterests = [];

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
    selectedInterests.push(data.value);
    console.log(selectedInterests);
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
    );
  }

}

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default SearchBar;
