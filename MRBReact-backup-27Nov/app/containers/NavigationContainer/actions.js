/*
 *
 * NavigationContainer actions
 *
 */

import {
  TOGGLE_DRAWER,
  TOGGLE_SELECT_STORE,
  NAVIGATE_TO_STORES,
} from './constants';

export function toggleDrawer() {
  return {
    type: TOGGLE_DRAWER,
  };
}
export function toggleSelectStore() {
    return {
        type: TOGGLE_SELECT_STORE,
    };
}
export function navigateToStores() {
    return {
        type: NAVIGATE_TO_STORES,
    };
}
