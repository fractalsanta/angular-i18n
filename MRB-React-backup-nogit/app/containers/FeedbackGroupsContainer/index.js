/*
 *
 * FeedbackGroupsContainer
 *
 */

import React, { PropTypes } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import makeSelectFeedbackGroupsContainer from "./selectors";
import FeedbackGroups from "../../components/FeedbackGroups";
import {fetchFeedbackGroups, selectFeedbackByTitle} from "./actions";

export class FeedbackGroupsContainer extends React.Component {

  render() {
    return (
      <div>
        <FeedbackGroups {...this.props} />
      </div>
    );
  }
}

FeedbackGroupsContainer.propTypes = {
};

const mapStateToProps = makeSelectFeedbackGroupsContainer();

function mapDispatchToProps(dispatch) {
  return {
    selectFeedbackByTitle: (feedbackTitle) => dispatch(selectFeedbackByTitle(feedbackTitle))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  FeedbackGroupsContainer
);
