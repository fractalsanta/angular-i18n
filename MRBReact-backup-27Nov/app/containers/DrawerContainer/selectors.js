import { createSelector } from 'reselect';

/**
 * Direct selector to the drawerContainer state domain
 */
const selectDrawerContainerDomain = () => (state) => state.get('drawerContainer');

/**
 * Other specific selectors
 */


/**
 * Default selector used by DrawerContainer
 */

const makeSelectDrawerContainer = () => createSelector(
  selectDrawerContainerDomain(),
  (substate) => substate.toJS()
);

export default makeSelectDrawerContainer;
export {
  selectDrawerContainerDomain,
};
