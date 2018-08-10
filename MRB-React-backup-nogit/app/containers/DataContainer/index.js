/*
 *
 * DataContainer
 *
 */

import React, { PropTypes } from 'react';
import { connect, store } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import makeSelectDataContainer from './selectors';
import Data from '../../components/Data';
import { fetchAllData, sendItemsInPostQueue } from "./actions";

export class DataContainer extends React.Component {
  componentDidMount() {
    this.props.fetchAllData();
    let timer = setInterval(this.props.sendItemsInPostQueue, 9000);
  }


  render() {
    return (
      <div>
        <Data {...this.props}/>
      </div>
    );
  }
}
// DataContainer.contextTypes = {
//   store: React.PropTypes.object.isRequired
// };

DataContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  DataContainer: makeSelectDataContainer(),
});

function mapDispatchToProps(dispatch) {
  return {
    fetchAllData: () => dispatch(fetchAllData()),
    sendItemsInPostQueue: () => dispatch(sendItemsInPostQueue())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DataContainer);
