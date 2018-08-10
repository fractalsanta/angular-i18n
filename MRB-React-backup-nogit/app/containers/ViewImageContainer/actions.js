/*
 *
 * ViewImageContainer actions
 *
 */

import {
  REQUEST_IMAGE,
  REQUEST_IMAGE_SUCCEEDED,
  CLEAR_IMAGE
} from "./constants";

export function requestImage(image) {
  return {
    type: REQUEST_IMAGE,
    image
  };
}

export function requestImageSucceeded(image64) {
  return {
    type: REQUEST_IMAGE_SUCCEEDED,
    image64
  };
}

export function clearImage() {
  return {
    type: CLEAR_IMAGE
  };
}
