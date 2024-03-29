/*
 *
 * NavigationContainer
 *
 */

import React, { PropTypes } from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import { createStructuredSelector } from "reselect";
import makeSelectNavigationContainer from "./selectors";
import Navigation from "../../components/Navigation";
import { toggleDrawer } from "./actions";
import { push } from "react-router-redux";
import { sendItemsInPostQueue } from "../DataContainer/actions";

export class NavigationContainer extends React.Component {

  render() {
    return <Navigation {...this.props} />;
  }
}

NavigationContainer.propTypes = {
};

const mapStateToProps = makeSelectNavigationContainer();

function mapDispatchToProps(dispatch) {
  return {
    toggleDrawer: () => dispatch(toggleDrawer()),
    navigateToFeedback: () => dispatch(push('/feedbackgroups')),
    navigateToCreateFeedback: () => dispatch(push('/createfeedback')),
    sendItemsInPostQueue: () => dispatch(sendItemsInPostQueue()),

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  NavigationContainer
);
