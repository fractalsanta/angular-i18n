import { createSelector } from 'reselect';
import { makeSelectFeedback } from "../DataContainer/selectors";

/**
 * Direct selector to the feedbackItemsContainer state domain
 */
const selectFeedbackItemsContainerDomain = () => (state) => state.get('feedbackItemsContainer');

const selectedFeedbackTitle = () => state =>
  state.getIn(["feedbackGroupsContainer", "selectedFeedbackTitle"]);

/**
 * Other specific selectors
 */


/**
 * Default selector used by FeedbackItemsContainer
 */

const makeSelectFeedbackItemsContainer = () => createSelector(
  makeSelectFeedback(),
  selectedFeedbackTitle(),
  (feedback, feedbackTitle) => {
    const feedbackItems = feedback.filter(feedbackItem => feedbackItem.title === feedbackTitle);
    return {
      feedbackItems,
      feedbackTitle
    }
  }
);

export default makeSelectFeedbackItemsContainer;
export {
  selectFeedbackItemsContainerDomain,
};
