import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Header, Loader, Card, Dropdown, Menu } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import ClubItem from '/imports/ui/components/ClubItem';
// import SearchBar from '/imports/ui/components/SearchBar';
import { Clubs } from '/imports/api/club/club';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class ClubDirectory extends React.Component {

  state = {
    clubs: [],
    searchBy: 'Interest',
    searchQuery: '',
  };

  constructor(props) {
    super(props);
    this.handleInterestSearchChange = this.handleInterestSearchChange.bind(this);
    this.handleNameSearchChange = this.handleNameSearchChange.bind(this);
    this.createOptions = this.createOptions.bind(this);
    this.setSearchBy = this.setSearchBy.bind(this);
    this.handleNameAddition = this.handleNameAddition.bind(this);
  }

  createOptions() {
    /* eslint-disable-next-line */
    const interestList = _.uniq(_.pluck(this.props.clubs, 'interests').flatten()).sort();
    /* eslint-disable-next-line */
    const clubNameList = _.uniq(_.pluck(this.props.clubs, 'name').flatten()).sort();
    const searchByList = ['Interest', 'Name'];
    this.interests = interestList.map((interest, index) => ({ key: index, value: interest, text: interest }));
    this.clubNames = clubNameList.map((interest, index) => ({ key: index, value: interest, text: interest }));
    this.searchBy = searchByList.map((interest, index) => ({ key: index, value: interest, text: interest }));
  }

  returnClub(clubId) {
    return Clubs.findOne({ _id: clubId });
  }

  setSearchBy(event, data) {
    event.preventDefault();
    this.setState({ searchBy: data.value });
  }

  handleNameAddition(e, { value }) {
    const clubs = this.props.clubs.filter((x) => (x.name.toUpperCase().indexOf(value.toUpperCase()) !== -1));
    this.setState({ clubs: clubs });
  }

  handleInterestSearchChange(event, data) {
    event.preventDefault();
    /* eslint-disable-next-line */
    const clubs = this.props.clubs.filter((x) => _.intersection(x.interests, data.value).length === data.value.length);
    this.setState({ clubs: clubs });
  }

  handleNameSearchChange(event, data) {
    event.preventDefault();
    const clubs = this.props.clubs.filter((x) => (x.name.toUpperCase().indexOf(data.value.toUpperCase()) !== -1));
    this.setState({ clubs: clubs });
  }

  handleSearchChange = (e, { searchQuery }) => this.setState({ searchQuery });

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const cardPadding = { padding: '30px 0px 0px 0px' };
    const contentStyle = { marginBottom: '50px' };
    if (this.interests === undefined) {
      this.createOptions();
    }
    return (
        <div style={contentStyle}>
          <Container>
            <Header as="h2" dividing textAlign="center">Club Directory</Header>
            {/* <SearchBar/> */}
            <Menu>
              <Dropdown selection defaultValue='Interest' options={this.searchBy}
                        onChange={(e, data) => this.setSearchBy(e, data)}/>
              {this.state.searchBy === 'Interest' ? (
                  <Dropdown placeholder='Search by Interests' fluid multiple search selection
                            options={this.interests} icon='search'
                            onChange={(event, data) => this.handleInterestSearchChange(event, data)}
                  />
              ) : (
                  <Dropdown placeholder='Search by Club Name' deburr fluid search selection clearable='true'
                            options={this.clubNames} icon='search' allowAdditions
                            onChange={(event, data) => this.handleNameSearchChange(event, data)}
                            onAddItem={(e, data) => this.handleNameAddition(e, data)}
                  />
              )}
            </Menu>
            <Card.Group style={cardPadding}>
              {this.state.clubs.length === 0 ? (
                  this.props.clubs.map((club, index) => <ClubItem key={index} club={club}/>)
              ) : (
                  this.state.clubs.map((club, index) => <ClubItem key={index} club={this.returnClub(club._id)}/>))
              }
            </Card.Group>
          </Container>
        </div>
    );
  }
}

/** Require an array of Stuff documents in the props. */
ClubDirectory.propTypes = {
  clubs: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
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
})(ClubDirectory);
