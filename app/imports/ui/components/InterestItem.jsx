import React from 'react';
import { Icon, List } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class InterestItem extends React.Component {
  render() {
    return (
        <List.Item>
          <Icon link name='minus circle' color='red' onClick={this.onClickDeleteInterest}/>
          <List.Content content={this.props.doc.interest}/>
        </List.Item>
    );
  }
}

/** Require a document to be passed to this component. */
InterestItem.propTypes = {
  doc: PropTypes.object.isRequired,
  key: PropTypes.String,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(InterestItem);
