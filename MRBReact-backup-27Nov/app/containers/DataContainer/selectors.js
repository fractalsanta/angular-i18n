import { createSelector } from "reselect";
import * as dataService from "../../services/DataService";

/**
 * Direct selector to the dataContainer state domain
 */
const selectDataContainerDomain = () => state => state.get("dataContainer");

const selectStores = () => state => state.getIn(["dataContainer", "stores"]);
const selectDocumentTaskList = () => state =>
  state.getIn(["dataContainer", "documentTaskList"]);
const selectDocumentPageInfo = () => state =>
  state.getIn(["dataContainer", "documentPageInfo"]);
const selectDocuments = () => state =>
  state.getIn(["dataContainer", "documents"]);
const selectFeedback = () => state =>
  state.getIn(["dataContainer", "feedback"]);
const selectPostQueue = () => state =>
  state.getIn(["dataContainer", "postQueue"]);

/**
 * Other specific selectors
 */
const makeSelectDatesAndStores = () =>
  createSelector(
    selectStores(),
    selectDocumentTaskList(),
    selectDocumentPageInfo(),
    selectDocuments(),
    dataService.createDatesAndStores
  );

const makeSelectPageTitles = () =>
  createSelector(selectDocumentPageInfo(), documentPageInfo => {
    return documentPageInfo.map(pageInfo => {
      return { title: pageInfo.title };
    });
  });

const makeSelectFeedback = () =>
  createSelector(selectFeedback(), feedback => feedback);

const makeSelectPostQueue = () =>
  createSelector(selectPostQueue(), postQueue => postQueue);

const makeSelectDocuments = () =>
  createSelector(selectDocuments(), documents => documents);
/**
 * Default selector used by DataContainer
 */

const makeSelectDataContainer = () =>
  createSelector(selectDataContainerDomain(), substate => substate.toJS());

export default makeSelectDataContainer;
export {
  selectDataContainerDomain,
  makeSelectDatesAndStores,
  makeSelectPageTitles,
  makeSelectFeedback,
  makeSelectPostQueue,
  makeSelectDocuments,
  selectStores,
  selectPostQueue
};
