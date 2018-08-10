/*
 *
 * SelectStoreContainer actions
 *
 */

import {
    TOGGLE_SELECT,
    NAVIGATE_TO_STORES,
    NAVIGATE_BACK,
} from './constants';

export function navigateToStores() {
    return {
        type: NAVIGATE_TO_STORES,
    };
}
export function toggleCloseButton() {
    return {
        type: TOGGLE_SELECT,
    };
}
export function navigateBack() {
    return {
        type: NAVIGATE_BACK,
    };
}
