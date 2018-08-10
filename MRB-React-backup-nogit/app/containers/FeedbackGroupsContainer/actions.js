/*
 *
 * FeedbackGroupsContainer actions
 *
 */

import {
  SELECT_FEEDBACK_BY_TITLE,
  SET_SELECTED_FEEDBACK_TITLE
} from "./constants";

export function selectFeedbackByTitle(feedbackTitle) {
  return { type: SELECT_FEEDBACK_BY_TITLE, feedbackTitle };
}

export function setSelectedFeedbackTitle(feedbackTitle) {
  return { type: SET_SELECTED_FEEDBACK_TITLE, feedbackTitle };
}
