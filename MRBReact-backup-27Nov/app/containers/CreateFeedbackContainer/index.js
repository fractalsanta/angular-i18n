/*
 *
 * CreateFeedbackContainer
 *
 */

import React, { PropTypes } from "react";
import { connect } from "react-redux";
import makeSelectCreateFeedbackContainer from "./selectors";
import CreateFeedback from "../../components/CreateFeedback";
import { submitFeedback } from "./actions";

export class CreateFeedbackContainer extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <CreateFeedback {...this.props} />
      </div>
    );
  }
}

CreateFeedbackContainer.propTypes = {
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = makeSelectCreateFeedbackContainer();

function mapDispatchToProps(dispatch) {
  return {
    submitFeedback: (title, comments) => dispatch(submitFeedback(title, comments))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  CreateFeedbackContainer
);
