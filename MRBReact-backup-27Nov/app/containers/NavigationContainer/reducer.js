/*
 *
 * NavigationContainer reducer
 *
 */

import { fromJS } from "immutable";
import { TOGGLE_DRAWER } from "./constants";
import { TOGGLE_SELECT_STORE } from "./constants";

const initialState = fromJS({
  topics: [],
  isDrawerOpen: false,
  isSelectStoreDrawerOpen: false,
  displayCloseButton: false,
});

function navigationContainerReducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_DRAWER:
      return state.set("isDrawerOpen", !state.get("isDrawerOpen"));
    case TOGGLE_SELECT_STORE:
      return state.set("isSelectStoreDrawerOpen", !state.get("isSelectStoreDrawerOpen"));
    default:
      return state;
  }
}

export default navigationContainerReducer;
