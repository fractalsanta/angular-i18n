/*
 *
 * SelectStoreContainer reducer
 *
 */

import { fromJS } from 'immutable';
import {
  GET_STORES_HIERARCHY_SUCCESS,
  NAVIGATE_TO_STORES,
  NAVIGATE_BACK,
} from './constants';

const initialState = fromJS({
  stores: [],
  changeActiveStore: false,
  displayCloseButton: false,
});

function selectStoreContainerReducer(state = initialState, action) {
  switch (action.type) {
    case GET_STORES_HIERARCHY_SUCCESS:
      return state.set('stores', action.stores);
    case NAVIGATE_TO_STORES:
      return state.set('displayCloseButton', true);
    case NAVIGATE_BACK:
      return state;
    default:
      return state;
  }
}

export default selectStoreContainerReducer;
