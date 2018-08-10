/*
 *
 * DrawerContainer
 *
 */

import React, { PropTypes } from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import { createStructuredSelector } from "reselect";
import makeSelectDrawerContainer from "./selectors";
import Drawer from "../../components/Drawer";
import { toggleDrawer } from "./actions";
import { push } from "react-router-redux";
import { sendItemsInPostQueue } from "../DataContainer/actions";

export class DrawerContainer extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return <Drawer {...this.props} />;
  }
}

DrawerContainer.propTypes = {};

const mapStateToProps = makeSelectDrawerContainer();

function mapDispatchToProps(dispatch) {
  return {
      toggleDrawer: () => dispatch(toggleDrawer()),
      navigateToFeedback: () => dispatch(push('/feedbackgroups')),
        navigateToCreateFeedback: () => dispatch(push('/createfeedback')),
        sendItemsInPostQueue: () => dispatch(sendItemsInPostQueue()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContainer);
