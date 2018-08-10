import { createSelector } from 'reselect';
import { makeSelectPageTitles } from "../DataContainer/selectors";

/**
 * Direct selector to the createFeedbackContainer state domain
 */
const selectCreateFeedbackContainerDomain = () => (state) => state.get('createFeedbackContainer');

/**
 * Other specific selectors
 */


/**
 * Default selector used by CreateFeedbackContainer
 */

const makeSelectCreateFeedbackContainer = () => createSelector(
  selectCreateFeedbackContainerDomain(),
  makeSelectPageTitles(),
  (substate, pageTitles) => Object.assign(substate.toJS(), { pageTitles})
);

export default makeSelectCreateFeedbackContainer;
export {
  selectCreateFeedbackContainerDomain,
};
