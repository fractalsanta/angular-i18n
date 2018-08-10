import { createSelector } from "reselect";
import { makeSelectFeedback } from "../DataContainer/selectors";
import * as dataService from "../../services/DataService";

/**
 * Direct selector to the feedbackGroupsContainer state domain
 */
const selectFeedbackGroupsContainerDomain = () => state =>
  state.get("feedbackGroupsContainer");

/**
 * Other specific selectors
 */
const makeSelectFeedbackGroups = () =>
  createSelector(makeSelectFeedback(), feedback => {
    const aaa = dataService.groupFeedbacks(feedback);
    return aaa;
  });

/**
 * Default selector used by FeedbackGroupsContainer
 */

const makeSelectFeedbackGroupsContainer = () =>
  createSelector(
    selectFeedbackGroupsContainerDomain(),
    makeSelectFeedbackGroups(),
    (substate, feedbackGroups) => {
      const aaa = Object.assign(substate.toJS(), { feedbackGroups });
      return aaa;
    }
  );

export default makeSelectFeedbackGroupsContainer;
export { selectFeedbackGroupsContainerDomain };
