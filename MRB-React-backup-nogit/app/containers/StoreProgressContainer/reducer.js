/*
 *
 * StoreProgressContainer reducer
 *
 */

import { fromJS } from "immutable";
import moment from "moment";
import {
  FETCH_STORES_WITH_DETAILS_SUCCESS,
  UPDATE_SELECTED_DATE,
  SET_SELECTED_DOCUMENTS,
  STORE_PAGE_TITLES
} from "./constants";

const initialState = fromJS({
  selectedDate: "2017-10-10",
  storesWithDetails: [],
});

function storeProgressContainerReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_SELECTED_DATE:
      return state.set(
        "selectedDate",
        moment(action.date).format("YYYY-MM-DD")
      );
    default:
      return state;
  }
}

export default storeProgressContainerReducer;
