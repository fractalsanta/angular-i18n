/*
 *
 * SelectStoreContainer reducer
 *
 */

import { fromJS } from 'immutable';
import {
  GET_STORES_HIERARCHY_SUCCESS
} from './constants';

const initialState = fromJS({
  stores: []
});

function selectStoreContainerReducer(state = initialState, action) {
  switch (action.type) {
    case GET_STORES_HIERARCHY_SUCCESS:
      return state.set('stores', action.stores);
    default:
      return state;
  }
}

export default selectStoreContainerReducer;
