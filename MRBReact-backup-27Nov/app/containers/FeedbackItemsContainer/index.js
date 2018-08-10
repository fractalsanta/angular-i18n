/*
 *
 * FeedbackItemsContainer
 *
 */

import React, { PropTypes } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import makeSelectFeedbackItemsContainer from "./selectors";
import FeedbackItems from "../../components/FeedbackItems";

export class FeedbackItemsContainer extends React.Component {
  render() {
    return (
      <div>
        <FeedbackItems {...this.props} />
      </div>
    );
  }
}

FeedbackItemsContainer.propTypes = {};

const mapStateToProps = makeSelectFeedbackItemsContainer();

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  FeedbackItemsContainer
);
