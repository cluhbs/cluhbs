import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Header, Loader, Card, Accordion, Icon, Message } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Clubs } from '/imports/api/club/club';
import { Requests } from '/imports/api/request/request';
import { Admin, newClubNotificationOptionsA, updatedClubNotificationOptions } from '/imports/api/admin/admin';
import RequestAdmin from '/imports/ui/components/RequestAdmin';
import { Link } from 'react-router-dom';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class RequestListAdmin extends React.Component {

  state = {
    activeIndex: -1,
  };

  constructor(props) {
    super(props);
    this.dismissMessage = this.dismissMessage.bind(this);
    this.onClickAccordion = this.onClickAccordion.bind(this);
    this.renderNewClubs = this.renderNewClubs.bind(this);
    this.renderUpdatedClubs = this.renderUpdatedClubs.bind(this);
    this.renderMessages = this.renderMessages.bind(this);
    this.renderRequestList = this.renderRequestList.bind(this);
  }

  returnClub(clubId) {
    return Clubs.findOne({ _id: clubId });
  }

  dismissMessage(event, data, admin, clubId, type) {
    const _id = admin._id;
    if (clubId) {
      if (type === 'new') {
        const newClubs = admin.newClubs.filter((x) => (x !== clubId));
        Admin.update(_id, { $set: { newClubs } });
      }
      if (type === 'update') {
        const updatedClubs = admin.updatedClubs.filter((x) => (x !== clubId));
        Admin.update(_id, { $set: { updatedClubs } });
      }
    } else {
      const messages = admin.messages.filter((x) => (x !== data.content));
      Admin.update(_id, { $set: { messages } });
    }
    this.setState({ visible: false });
  }

  onClickAccordion(e, titleProps) {
    if (this.state.activeIndex === titleProps.index) {
      this.setState({ activeIndex: -1 });
    } else {
      this.setState({ activeIndex: titleProps.index });
    }
  }

  renderNewClubs(admin) {
    const _id = admin._id;
    if (admin.newClubNotifications === newClubNotificationOptionsA[1]) {
      Admin.update(_id, { $set: { newClubs: [] } });
    }
    return (
        admin.newClubs.map(
            (clubId, index) => <Message key={index} color='green'
                                        onDismiss={(e, data) => this.dismissMessage(e, data, admin, clubId, 'new')}>
              New Club: <Link to={`/club-info/${clubId}`}>{this.returnClub(clubId).name}</Link>
            </Message>,
        )
    );
  }

  renderUpdatedClubs(admin) {
    const _id = admin._id;
    if (admin.updatedClubNotifications === updatedClubNotificationOptions[1]) {
      Admin.update(_id, { $set: { updatedClubs: [] } });
    }
    return (
        admin.updatedClubs.map(
            (clubId, index) => <Message key={index} color='teal'
                                        onDismiss={(e, data) => this.dismissMessage(e, data, admin, clubId, 'update')}>
              Updated Club: <Link to={`/club-info/${clubId}`}>{this.returnClub(clubId).name}</Link>
            </Message>,
        )
    );
  }

  renderMessages(admin) {
    const x = 0;
    const totalCount = admin.newClubs.length + admin.updatedClubs.length + admin.messages.length;
    return (
        <Accordion>
          <Accordion.Title active={this.state.activeIndex === x} index={x}
                           onClick={(e, titleProps) => this.onClickAccordion(e, titleProps)}>
            <Header as='h2' textAlign='center'>
              {totalCount > 0 ? (
                  <div>
                    <Icon name='exclamation circle' color='red'/> Messages ({totalCount}) <Icon name='dropdown'/>
                  </div>
              ) : (
                  <div>
                    Messages ({totalCount})<Icon name='dropdown'/>
                  </div>
              )}
            </Header>
          </Accordion.Title>
          <Accordion.Content active={this.state.activeIndex === x}>
            {(totalCount === 0) ? (
                <Header as='h3' textAlign='center' color='grey'>No new messages.</Header>
            ) : (
                admin.messages.map((message, index) => <Message
                    key={index} content={message} color='violet'
                    onDismiss={(e, data) => this.dismissMessage(e, data, admin)}/>)
            )}
            {admin.newClubs.length === 0 ? ('') : (this.renderNewClubs(admin))}
            {admin.updatedClubs.length === 0 ? ('') : (this.renderUpdatedClubs(admin))}
          </Accordion.Content>
        </Accordion>
    );
  }

  renderRequestList() {
    const x = 1;
    return (
        <Accordion>
          <Accordion.Title active={this.state.activeIndex === x} index={x}
                           onClick={(e, titleProps) => this.onClickAccordion(e, titleProps)}>
            <Header as='h2' textAlign='center'>
              {this.props.requests.length > 0 ? (
                  <div>
                    <Icon name='exclamation circle' color='red'/> Requests ({this.props.requests.length})
                    <Icon name='dropdown'/>
                  </div>
              ) : (
                  <div>
                    Requests ({this.props.requests.length})<Icon name='dropdown'/>
                  </div>
              )}
            </Header>
          </Accordion.Title>
          <Accordion.Content active={this.state.activeIndex === x}>
            {(this.props.requests.length === 0) ? (
                <Header as='h3' textAlign='center' color='grey'>
                  No new requests.
                </Header>
            ) : (
                <Card.Group centered>
                  {this.props.requests.map((request, index) => <RequestAdmin key={index} request={request}/>)}
                </Card.Group>
            )}
          </Accordion.Content>
        </Accordion>
    );
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const admin = Admin.findOne({ owner: this.props.currentUser });
    return (
        <Container>
          <Header as="h1" textAlign="center">Welcome!</Header>
          {this.renderMessages(admin)}
          {this.renderRequestList()}
        </Container>
    );
  }
}

/** Require an array of Stuff documents in the props. */
RequestListAdmin.propTypes = {
  currentUser: PropTypes.string.isRequired,
  requests: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe('RequestsAdmin');
  const subscription2 = Meteor.subscribe('Admin');
  return {
    currentUser: Meteor.user() ? Meteor.user().username : '',
    requests: Requests.find({}).fetch(),
    ready: subscription.ready() && subscription2.ready(),
  };
})(RequestListAdmin);
