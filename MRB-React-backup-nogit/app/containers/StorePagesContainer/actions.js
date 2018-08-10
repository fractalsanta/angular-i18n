/*
 *
 * StorePagesContainer actions
 *
 */

import {
  VIEW_IMAGE,
  TOGGLE_DRAWER,
} from "./constants";

export const viewImage = image => {
  return { type: VIEW_IMAGE, image };
};

export function toggleDrawer() {
    return {
        type: TOGGLE_DRAWER,
    };
}