/*
 *
 * FeedbackGroupsContainer reducer
 *
 */

import { fromJS } from "immutable";
import { FETCH_FEEDBACK_GROUPS_SUCCESS, SET_SELECTED_FEEDBACK_TITLE } from "./constants";

const initialState = fromJS({
  selectedFeedbackTitle: ''
});

function feedbackGroupsContainerReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SELECTED_FEEDBACK_TITLE:
      return state.set("selectedFeedbackTitle", action.feedbackTitle);
    default:
      return state;
  }
}

export default feedbackGroupsContainerReducer;
