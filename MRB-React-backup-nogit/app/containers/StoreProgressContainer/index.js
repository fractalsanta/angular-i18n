/*
 *
 * StoreProgressContainer
 *
 */

import React, { PropTypes } from "react";
import { connect } from "react-redux";
import selectStoreProgressContainer from "./selectors";
import StoreProgress from "../../components/StoreProgress";
import {
  fetchStoresWithDetails,
  updateSelectedDate,
  selectStoreForDate,
  loadAboveStoreSearch,
  displaySelectedDocuments
} from "./actions";

export class StoreProgressContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false
    };
  }

  dateSelectHandler = date => {
    if (date !== "Invalid date") {
      this.setState({
        modalOpen: false
      });
      this.props.updateSelectedDate(date);
    } else {
    }
  };

  render() {
    return (
      <StoreProgress
        dateSelectHandler={this.dateSelectHandler}
        modalOpen={this.state.modalOpen}
        {...this.props}
      />
    );
  }
}

StoreProgressContainer.propTypes = {};

const mapStateToProps = selectStoreProgressContainer();

function mapDispatchToProps(dispatch) {
  return {
    // fetchStoresWithDetails: () => dispatch(fetchStoresWithDetails()),
    updateSelectedDate: date => dispatch(updateSelectedDate(date)),
    loadAboveStoreSearch: () => dispatch(loadAboveStoreSearch()),
    selectStoreForDate: sys_id => dispatch(selectStoreForDate(sys_id)),
    displaySelectedDocuments: selectedDocuments => dispatch(displaySelectedDocuments(selectedDocuments))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  StoreProgressContainer
);
