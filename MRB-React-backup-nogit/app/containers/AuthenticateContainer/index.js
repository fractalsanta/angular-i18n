/*
 *
 * AuthenticateContainer
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import makeSelectAuthenticateContainer from './selectors';
import Authenticate from '../../components/Authenticate';
import  { authenticate } from "./actions";

export class AuthenticateContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    console.log('auth did mount');
    this.props.authenticate();
  }

  render() {
    return (
      <div>
        <Authenticate {...this.props}/>
      </div>
    );
  }
}

AuthenticateContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  AuthenticateContainer: makeSelectAuthenticateContainer(),
});

function mapDispatchToProps(dispatch) {
  return {
    authenticate: () => dispatch(authenticate())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticateContainer);
