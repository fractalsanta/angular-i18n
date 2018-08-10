/*
 *
 * ViewImageContainer
 *
 */

import React, { PropTypes } from "react";
import { connect } from "react-redux";
import makeSelectViewImageContainer from "./selectors";
import ViewImage from "../../components/ViewImage";
import { requestImage, clearImage } from "./actions";

export class ViewImageContainer extends React.Component {
  componentWillMount() {
    this.props.requestImage(this.props.image);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.image !== this.props.image) {
      this.props.requestImage(this.props.image);
    }
  }

  componentWillUnmount() {
    this.props.clearImage();
  }

  render() {
    return <ViewImage {...this.props} />;
  }
}

ViewImageContainer.propTypes = {
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = makeSelectViewImageContainer;

function mapDispatchToProps(dispatch) {
  return {
    requestImage: image => dispatch(requestImage(image)),
    clearImage: () => dispatch(clearImage())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewImageContainer);
