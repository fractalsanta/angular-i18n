/*
 *
 * AboveStoreSearchContainer actions
 *
 */

import {
  TOGGLE_CRITERIA_COMPLETED,
  CHANGE_CRITERIA_PAGE_TITLE,
  DISPLAY_SEARCH_DOCUMENTS
} from "./constants";

export function toggleCriteriaCompleted() {
  return {
    type: TOGGLE_CRITERIA_COMPLETED
  };
}

export function changeCriteriaPageTitle(pageTitle) {
  return { type: CHANGE_CRITERIA_PAGE_TITLE, pageTitle };
}

export const displaySearchDocuments = selectedDocuments => {
  return { type: DISPLAY_SEARCH_DOCUMENTS, selectedDocuments };
};
