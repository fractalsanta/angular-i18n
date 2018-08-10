/*
 *
 * AuthenticateContainer actions
 *
 */

import { AUTHENTICATE, AUTHENTICATE_SUCCESS, SET_CURRENT_STORE_ID } from "./constants";

export const authenticate = () => {
  return {
    type: AUTHENTICATE
  };
};

export const setCurrentStoreId = (storeId) => {
  return {
    type: SET_CURRENT_STORE_ID,
    storeId
  };
};

export const authenticateSuccess = (me, activeNamespace, userFacts, aboveStore) => {
  return {
    type: AUTHENTICATE_SUCCESS,
    me,
    activeNamespace,
    userFacts,
    aboveStore
  };
};
