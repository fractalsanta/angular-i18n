import { createSelector } from "reselect";
import { makeSelectPageTitles } from "../DataContainer/selectors";

/**
 * Direct selector to the aboveStoreSearchContainer state domain
 */
const selectAboveStoreSearchContainerDomain = () => state =>
  state.get("aboveStoreSearchContainer");

/**
 * Other specific selectors
 */
const storesWithDetails = () => state =>
  state.getIn(["storeProgressContainer", "storesWithDetails"]);

const pageTitles = () => state =>
  state.getIn(["storeProgressContainer", "pageTitles"]);

const getSearchResults = (substate, storesWithDetails, pageTitles) => {
  const criteriaCompleted = substate.toJS().completed;
  const criteriaPageName = substate.toJS().pageTitle;
  const storeArray = [];
  storesWithDetails.forEach(storeWithDetails => {
    storeWithDetails.storesWithDetails.forEach(stores => {
      const { name, sys_id } = stores;
      let storeInArray = storeArray.find(store => store.sys_id === sys_id);
      if (!storeInArray) {
        storeInArray = { name, sys_id, activePages: [] };
        storeArray.push(storeInArray);
      }
      stores.activePages.forEach(activePage => {
        let shouldAdd = true;
        criteriaCompleted && !!activePage.completed && (shouldAdd = false);
        criteriaPageName !== "Page Title" &&
          criteriaPageName !== activePage.title &&
          (shouldAdd = false);
        shouldAdd && storeInArray.activePages.push(activePage);
      });
    });
  });
  console.log(storeArray);
  return Object.assign(
    substate.toJS(),
    { storesWithActivePages: storeArray },
    { pageTitles }
  );
};
/**
 * Default selector used by AboveStoreSearchContainer
 */

const makeSelectAboveStoreSearchContainer = () =>
  createSelector(
    selectAboveStoreSearchContainerDomain(),
    storesWithDetails(),
    pageTitles(),
    getSearchResults
  );

export default makeSelectAboveStoreSearchContainer;
export { selectAboveStoreSearchContainerDomain };
