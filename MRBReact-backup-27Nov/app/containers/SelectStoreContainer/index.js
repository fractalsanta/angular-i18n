/*
 *
 * SelectStoreContainer
 *
 */

import React, { PropTypes } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import makeSelectSelectStoreContainer from "./selectors";
import SelectStore from "../../components/SelectStore";
import { getStoresHierarchy } from "./actions";
import { setCurrentStoreId, setCurrentStoreName } from "../AuthenticateContainer/actions";
import { push } from "react-router-redux";

export class SelectStoreContainer extends React.Component {

  render() {
    return (
      <div>
        <SelectStore {...this.props} />
      </div>
    );
  }
}

SelectStoreContainer.propTypes = {
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = makeSelectSelectStoreContainer();

function mapDispatchToProps(dispatch) {
  return {
    setCurrentStoreId: (store_id) => dispatch(setCurrentStoreId(store_id)),
    navigateToStores: () => dispatch(navigateToStores()),
    navigateBack: () => dispatch(push('/storepages')),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  SelectStoreContainer
);
