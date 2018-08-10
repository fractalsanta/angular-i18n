import { createSelector } from 'reselect';
import { selectStores } from "../DataContainer/selectors";

/**
 * Direct selector to the selectStoreContainer state domain
 */
const selectSelectStoreContainerDomain = () => (state) => state.get('selectStoreContainer');

/**
 * Other specific selectors
 */


/**
 * Default selector used by SelectStoreContainer
 */

const makeSelectSelectStoreContainer = () => createSelector(
  selectSelectStoreContainerDomain(),
  selectStores(),
  (substate, stores) => Object.assign(substate.toJS(), { stores })
);

export default makeSelectSelectStoreContainer;
export {
  selectSelectStoreContainerDomain,
};
