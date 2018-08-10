/*
 *
 * DrawerContainer reducer
 *
 */

import { fromJS } from 'immutable';
import {
  TOGGLE_DRAWER,
} from './constants';

const initialState = fromJS({
    topics: [],
    isDrawerOpen: false
});

function drawerContainerReducer(state = initialState, action) {
    switch (action.type) {
        case TOGGLE_DRAWER:
            return state.set("isDrawerOpen", !state.get("isDrawerOpen"));
        default:
            return state;
    }
}

export default drawerContainerReducer;
