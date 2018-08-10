/*
 *
 * AboveStoreSearchContainer reducer
 *
 */

import { fromJS } from "immutable";
import {
  TOGGLE_CRITERIA_COMPLETED,
  CHANGE_CRITERIA_PAGE_TITLE
} from "./constants";

const initialState = fromJS({
  completed: false,
  pageTitle: "Page Title"
});

function aboveStoreSearchContainerReducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_CRITERIA_COMPLETED:
      return state.set("completed", !state.get("completed"));
    case CHANGE_CRITERIA_PAGE_TITLE:
      return state.set("pageTitle", action.pageTitle);
    default:
      return state;
  }
}

export default aboveStoreSearchContainerReducer;
