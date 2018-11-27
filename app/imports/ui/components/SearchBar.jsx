import React from 'react';
import { Dropdown } from 'semantic-ui-react';

const interestOptions = [
  { key: 1, value: 'ac', text: 'Academic' },
  { key: 9, value: 'pr', text: 'Professional' },
  { key: 3, value: 'et', text: 'Ethnic' },
  { key: 2, value: 'cl', text: 'Cultural' },
  { key: 4, value: 'fc', text: 'Fan Club' },
  { key: 5, value: 'fr', text: 'Fraternity' },
  { key: 13, value: 'sr', text: 'Sorority' },
  { key: 7, value: 'le', text: 'Leisure' },
  { key: 10, value: 'rc', text: 'Recreational' },
  { key: 6, value: 'hs', text: 'Honorary Society' },
  { key: 8, value: 'pl', text: 'Political' },
  { key: 11, value: 'rl', text: 'Religious' },
  { key: 14, value: 'sp', text: 'Spiritual' },
  { key: 12, value: 'sr', text: 'Service' },
  { key: 15, value: 'st', text: 'Sport' },
  { key: 16, value: 'sa', text: 'Student Affairs' },
];

const interestLabel = label => ({ color: 'green', content: `${label.text}` });

const SearchBar = () => (
    <Dropdown placeholder='Select an Interest' fluid multiple search selection options={interestOptions}
              renderLabel={interestLabel}/>
);

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default SearchBar;
