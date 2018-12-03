import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Header, Loader, Card, Dropdown, Menu, Button } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import ClubItem from '/imports/ui/components/ClubItem';
import { Clubs } from '/imports/api/club/club';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class ClubDirectory extends React.Component {

  state = {
    clubs: [],
    searchBy: 'interests',
    currentInterests: [],
  };

  constructor(props) {
    super(props);
    this.handleInterestChange = this.handleInterestChange.bind(this);
    this.handleGeneralChange = this.handleGeneralChange.bind(this);
    this.createOptions = this.createOptions.bind(this);
    this.setSearchBy = this.setSearchBy.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.onClickClear = this.onClickClear.bind(this);
  }

  createOptions() {
    // this.searchBy = searchByList.map((value, index) => ({ key: index, value: value, text: value }));
    this.searchBy = [
      { key: 1, value: 'interests', text: 'Interest' },
      { key: 2, value: 'name', text: 'Name' },
      { key: 3, value: 'description', text: 'Description' },
      { key: 4, value: 'meetTime', text: 'Meeting Times' },
      { key: 5, value: 'location', text: 'Location' },
      { key: 6, value: 'contactPerson', text: 'Contact Person' },
      { key: 7, value: 'contactEmail', text: 'Contact Email' },
    ];
    /* eslint-disable-next-line */
    for (const category of this.searchBy) {
      /* eslint-disable-next-line */
      const list = _.uniq(_.pluck(this.props.clubs, category.value).flatten()).sort();
      this[category.value] = list.map((value, index) => ({ key: index, value: value, text: value }));
    }
  }

  returnClub(clubId) {
    return Clubs.findOne({ _id: clubId });
  }

  setSearchBy(event, data) {
    this.setState({ searchBy: data.value });
  }

  handleAddition(e, { value }, category) {
    const clubs = this.props.clubs.filter((x) => (x[category].toUpperCase().indexOf(value.toUpperCase()) !== -1));
    this.setState({ clubs: clubs });
  }

  handleGeneralChange(event, data, category) {
    const clubs = this.props.clubs.filter((x) => (x[category].toUpperCase().indexOf(data.value.toUpperCase()) !== -1));
    this.setState({ clubs: clubs });
  }

  handleInterestChange(event, data) {
    /* eslint-disable-next-line */
    const clubs = this.props.clubs.filter((x) => _.intersection(x.interests, data.value).length === data.value.length);
    this.setState({ clubs: clubs });
    this.setState({ currentInterests: data.value });
  }

  onClickClear() {
    this.setState({ clubs: [] });
    this.setState({ currentInterests: [] });
  }

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
            <Menu>
              <Dropdown selection defaultValue='interests' options={this.searchBy}
                        onChange={(e, data) => this.setSearchBy(e, data)}/>
              {this.state.searchBy === 'interests' ? (
                  <Dropdown placeholder='Search by Interests' fluid multiple search selection
                            options={this.interests} value={this.state.currentInterests} icon='search'
                            onChange={(event, data) => this.handleInterestChange(event, data)}
                  />
              ) : (
                  <Dropdown placeholder={`Search By ${this.state.searchBy}`} deburr fluid search selection
                            options={this[this.state.searchBy]} icon='search' allowAdditions additionLabel=''
                            onChange={(event, data) => this.handleGeneralChange(event, data, this.state.searchBy)}
                            onAddItem={(e, data) => this.handleAddition(e, data, this.state.searchBy)}
                  />
              )}
              <Button negative onClick={this.onClickClear}>Clear</Button>
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
