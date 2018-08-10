import { put, call, select } from "redux-saga/effects";
import { takeLatest } from "redux-saga";
import { FETCH_ALL_DATA, SEND_ITEMS_IN_POST_QUEUE } from "./constants";
import * as dataService from "../../services/DataService";
import { fetchAllDataSuccess, removeItemFromPostQueue } from "./actions";
import {
  selectActiveNamespace,
  selectUserFactsStores,
  selectAboveStore,
  selectCurrentStoreId
} from "../AuthenticateContainer/selectors";
import { selectPostQueue } from "./selectors";
import { push } from "react-router-redux";

// Individual exports for testing
function* fetchAllData() {
  const activeNamespace = yield select(selectActiveNamespace());
  const userFactsStores = yield select(selectUserFactsStores());

  const storesUnfiltered = yield call(
    dataService.fetchStoreData,
    activeNamespace
  );
  const stores =
    userFactsStores === "All"
      ? storesUnfiltered
      : storesUnfiltered.filter(store => userFactsStores.includes(store.name));
  const documentTaskList = yield call(
    dataService.fetchDocumentTaskListData,
    activeNamespace
  );
  const pageIds = documentTaskList.reduce((acc, taskList) => {
    acc.push(...taskList.page_ids);
    return acc;
  }, []);
  const documentPageInfo = yield call(
    dataService.fetchDocumentPageInfo,
    activeNamespace,
    pageIds
  );
  const documents = yield call(dataService.fetchDocument, activeNamespace);
  const feedbackUnfiltered = yield call(
    dataService.fetchFeedback,
    activeNamespace
  );
  const feedback = feedbackUnfiltered.filter(feedbackItem => {
    return stores.find(store => store.sys_id === feedbackItem.store_id);
  });
  yield put(
    fetchAllDataSuccess(
      stores,
      documentTaskList,
      documentPageInfo,
      documents,
      feedback
    )
  );
  const aboveStore = yield select(selectAboveStore());
  if (aboveStore) {
      yield put(push("/selectstore"));
    //yield put(push("/storeprogress"));
  } else {
    const currentStoreId = yield select(selectCurrentStoreId());
    if (currentStoreId) {
      console.log("bla");
    } else {
      yield put(push("/selectstore"));
    }
  }
}

export function* fetchAllDataSaga() {
  yield takeLatest(FETCH_ALL_DATA, fetchAllData);
}

function* sendItemsInPostQueue() {
  console.log('flushing queue');
  const activeNamespace = yield select(selectActiveNamespace());
  const postQueue = yield select(selectPostQueue());
  for (let i = 0; i <= postQueue.length - 1; i++) {
    try {
      yield call(
        dataService[postQueue[i].postFunction], activeNamespace,
        postQueue[i].postObject
      );
      yield put(removeItemFromPostQueue(postQueue[i].uuid));
    } catch (e) {
    }
  }
}

export function* sendItemsInPostQueueSaga() {
  yield takeLatest(SEND_ITEMS_IN_POST_QUEUE, sendItemsInPostQueue);
}

// All sagas to be loaded
export default [fetchAllDataSaga, sendItemsInPostQueueSaga];
