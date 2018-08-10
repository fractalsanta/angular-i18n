/*
 *
 * DataContainer reducer
 *
 */

import { fromJS } from "immutable";
import {
  FETCH_ALL_DATA_SUCCESS,
  SET_SELECTED_DOCUMENTS,
  ADD_ITEM_TO_POST_QUEUE,
  REMOVE_ITEM_FROM_POST_QUEUE
} from "./constants";

const initialState = fromJS({
  stores: [],
  documentTaskList: [],
  documentPageInfo: [],
  documents: [],
  feedback: [],
  selectedDocuments: [],
  postQueue: []
});

function addItemToPostQueue(state, action) {
  let postQueue = state.get("postQueue");
  if (postQueue instanceof Array === false) {
    postQueue = state.get("postQueue").toJS();
  }
  const { uuid, postFunction, postObject } = action;
  const postQueueItem = {
    uuid,
    postFunction,
    postObject
  };
  postQueue.push(postQueueItem);
  return state.set("postQueue", postQueue);
}

function removeItemFromPostQueue(state, action) {
  const postQueue = state.get("postQueue");
  const { uuid } = action;
  const filteredQueue = postQueue.filter(postQueueItem => {
    return postQueueItem.uuid !== uuid;
  });
  return state.set("postQueue", filteredQueue);
}

function dataContainerReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_ALL_DATA_SUCCESS:
      return state
        .set("stores", action.stores)
        .set("documentTaskList", action.documentTaskList)
        .set("documentPageInfo", action.documentPageInfo)
        .set("documents", action.documents)
        .set("feedback", action.feedback);
    case SET_SELECTED_DOCUMENTS:
      return state.set("selectedDocuments", action.selectedDocuments);
    case ADD_ITEM_TO_POST_QUEUE:
      return addItemToPostQueue(state, action);
    case REMOVE_ITEM_FROM_POST_QUEUE:
      return removeItemFromPostQueue(state, action);
    default:
      return state;
  }
}

export default dataContainerReducer;
