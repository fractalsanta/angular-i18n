import { createSelector } from "reselect";
import selectStoreProgressContainer from "../StoreProgressContainer/selectors";

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
  createSelector(selectedDocuments(), substate => {
    return { selectedDocuments: substate };
  });

export default makeSelectStorePagesContainer;
export { selectStorePagesContainerDomain };
