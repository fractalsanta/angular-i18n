/*
 *
 * AuthenticateContainer reducer
 *
 */

import { fromJS } from "immutable";
import { AUTHENTICATE_SUCCESS, SET_CURRENT_STORE_ID} from "./constants";

const initialState = fromJS({
  me: {},
  activeNamespace: "",
  userFacts: {},
  aboveStore: undefined,
  currentStoreId: undefined
});

function authenticateContainerReducer(state = initialState, action) {
  switch (action.type) {
    case AUTHENTICATE_SUCCESS:
      return state
        .set("me", action.me)
        .set("activeNamespace", action.activeNamespace)
        .set("userFacts", action.userFacts)
        .set("aboveStore", action.aboveStore);
    case SET_CURRENT_STORE_ID:
      return state
        .set("currentStoreId", action.storeId);
    default:
      return state;
  }
}

export default authenticateContainerReducer;
