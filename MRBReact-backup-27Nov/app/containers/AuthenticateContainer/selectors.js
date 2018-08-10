import { createSelector } from "reselect";

/**
 * Direct selector to the authenticateContainer state domain
 */
const selectAuthenticateContainerDomain = () => state =>
  state.get("authenticateContainer");

/**
 * Other specific selectors
 */
const selectActiveNamespace = () => state =>
  state.getIn(["authenticateContainer", "activeNamespace"]);
const selectAboveStore = () => state =>
  state.getIn(["authenticateContainer", "aboveStore"]);
const selectCurrentStoreId = () => state =>
  state.getIn(["authenticateContainer", "currentStoreId"]);
const selectUserName = () => state =>
  state.getIn(["authenticateContainer", "me"])['username'];

const selectUserFactsStores = () => state => {
  const userFacts = state.getIn(["authenticateContainer", "userFacts"]);
  if (userFacts.data) {
    return userFacts.data.stores;
  }
  return "All";
};

/**
 * Default selector used by AuthenticateContainer
 */

const makeSelectAuthenticateContainer = () =>
  createSelector(selectAuthenticateContainerDomain(), substate =>
    substate.toJS()
  );

export default makeSelectAuthenticateContainer;
export {
  selectAuthenticateContainerDomain,
  selectActiveNamespace,
  selectAboveStore,
  selectUserFactsStores,
  selectCurrentStoreId,
  selectUserName
};
