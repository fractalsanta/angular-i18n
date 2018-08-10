/*
 *
 * ViewImageContainer reducer
 *
 */

import { fromJS } from "immutable";
import { REQUEST_IMAGE_SUCCEEDED, CLEAR_IMAGE } from "./constants";

const initialState = fromJS({
  selectedImage64: ""
});

function viewImageContainerReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_IMAGE_SUCCEEDED:
      return state.set("selectedImage64", action.image64);
    case CLEAR_IMAGE:
      return state.set("selectedImage64", "");
    default:
      return state;
  }
}

export default viewImageContainerReducer;
