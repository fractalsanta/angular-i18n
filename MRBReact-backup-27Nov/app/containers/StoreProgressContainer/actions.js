/*
 *
 * StoreProgressContainer actions
 *
 */

import {
  FETCH_STORES_WITH_DETAILS,
  FETCH_STORES_WITH_DETAILS_SUCCESS,
  UPDATE_SELECTED_DATE,
  SELECT_STORE_FOR_DATE,
  DISPLAY_SELECTED_DOCUMENTS,
  SET_SELECTED_DOCUMENTS,
  LOAD_ABOVE_STORE_SEARCH,
  STORE_PAGE_TITLES
} from "./constants";

export const updateSelectedDate = date => {
  return { type: UPDATE_SELECTED_DATE, date };
};

export const selectStoreForDate = sys_id => {
  return { type: SELECT_STORE_FOR_DATE, sys_id };
};

export const displaySelectedDocuments = selectedDocuments => {
  return { type: DISPLAY_SELECTED_DOCUMENTS, selectedDocuments };
};

export const loadAboveStoreSearch = () => {
  return { type: LOAD_ABOVE_STORE_SEARCH };
};

