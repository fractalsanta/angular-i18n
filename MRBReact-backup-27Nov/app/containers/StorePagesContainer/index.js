import React, { PropTypes } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import makeSelectStorePagesContainer from "./selectors";
import StorePages from "../../components/StorePages";

import { toggleDrawer } from "./actions";
import { viewImage, uploadImage } from './actions';


export class StorePagesContainer extends React.Component {

  render() {
    return (
      <div>
        <StorePages {...this.props} />
      </div>
    );
  }
}

StorePagesContainer.propTypes = {
};

const mapStateToProps = makeSelectStorePagesContainer();

function mapDispatchToProps(dispatch) {
  return {
    viewImage: image  => dispatch(viewImage(image)),
    toggleDrawer: () => dispatch(toggleDrawer()),
    uploadImage: image  => dispatch(uploadImage(image)),
    navigateToStores: () => dispatch(navigateToStores()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StorePagesContainer);
