import { createSelector } from "reselect";
import { makeSelectPostQueue, makeSelectDocuments } from "../DataContainer/selectors";

/**
 * Direct selector to the testContainer state domain
 */
const selectStorePagesContainerDomain = () => state =>
  state.get("storePagesContainer");

const selectedDocuments = () => state =>
  state.getIn(["dataContainer", "selectedDocuments"]);

/**
 * Other specific selectors
 */
// const selectRouteStorePages = () => (state, props) => {
//   return props.params.storePagesName;
// };

// const getSelectedStoreDetails = (selDayDetails, test) => {
//   const indivStore = selDayDetails.storesWithDetails.find(sdd => {
//     return sdd.sys_id === test;
//   });
//   return indivStore;
// };
/**
 * Default selector used by TestContainer
 */

const makeSelectStorePagesContainer = () =>
  createSelector(
    selectedDocuments(),
    makeSelectPostQueue(),
    makeSelectDocuments(),
    (selectedDocuments, postQueue, documents) => {
      debugger;
      let aaa = postQueue;
      if (aaa instanceof Array === false) {
        aaa = postQueue.toJS();
      }
      return {
        selectedDocuments,
        postQueue: aaa,
        documents
      };
    }
  );

export default makeSelectStorePagesContainer;
export { selectStorePagesContainerDomain };
