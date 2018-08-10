/*
 *
 * AboveStoreSearchContainer
 *
 */

import React, { PropTypes } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import makeSelectAboveStoreSearchContainer from "./selectors";
import AboveStoreSearch from "../../components/AboveStoreSearch";
import { toggleCriteriaCompleted, changeCriteriaPageTitle } from "./actions";
import { displaySelectedDocuments } from "../StoreProgressContainer/actions";

export class AboveStoreSearchContainer extends React.Component {
  render() {
    console.log(this.props);
    return (
      <div>
        <AboveStoreSearch {...this.props} />
      </div>
    );
  }
}

AboveStoreSearchContainer.propTypes = {};

const mapStateToProps = makeSelectAboveStoreSearchContainer();

function mapDispatchToProps(dispatch) {
  return {
    toggleCriteriaCompleted: completed =>
      dispatch(toggleCriteriaCompleted(completed)),
    changeCriteriaPageTitle: pageTitle =>
      dispatch(changeCriteriaPageTitle(pageTitle)),
    displaySelectedDocuments: selectedDocuments =>
      dispatch(displaySelectedDocuments(selectedDocuments))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  AboveStoreSearchContainer
);
