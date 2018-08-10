/*
 *
 * DataContainer actions
 *
 */

import {
  FETCH_ALL_DATA,
  FETCH_ALL_DATA_SUCCESS,
  SET_SELECTED_DOCUMENTS,
  ADD_ITEM_TO_POST_QUEUE,
  REMOVE_ITEM_FROM_POST_QUEUE,
  SEND_ITEMS_IN_POST_QUEUE,
  ADD_ITEM_TO_DOCUMENTS
} from './constants';

export function fetchAllData() {
  return {
    type: FETCH_ALL_DATA,
  };
}

export function fetchAllDataSuccess(stores, documentTaskList, documentPageInfo, documents, feedback) {
  return {
    type: FETCH_ALL_DATA_SUCCESS,
    stores,
    documentTaskList,
    documentPageInfo,
    documents,
    feedback
  };
}

export const displaySelectedDocuments = selectedDocuments => {
  return { type: DISPLAY_SELECTED_DOCUMENTS, selectedDocuments };
};

export const setSelectedDocuments = selectedDocuments => {
  return { type: SET_SELECTED_DOCUMENTS, selectedDocuments };
};

export const sendItemsInPostQueue = () => {
  return {
    type: SEND_ITEMS_IN_POST_QUEUE
  }
};

export const addItemToPostQueue = (uuid, postFunction, postObject, successFunction, successObject) => {
  return {
    type: ADD_ITEM_TO_POST_QUEUE,
    uuid,
    postFunction,
    postObject,
    successFunction,
    successObject
  }
};

export const removeItemFromPostQueue = (uuid) => {
  return {
    type: REMOVE_ITEM_FROM_POST_QUEUE,
    uuid
  }
};

export const addItemToDocuments = (document) => {
  debugger;
  return {
    type: ADD_ITEM_TO_DOCUMENTS,
    document
  }
};
