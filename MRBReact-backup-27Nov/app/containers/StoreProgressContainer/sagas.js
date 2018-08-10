import { put, call, select } from "redux-saga/effects";
import { takeLatest } from "redux-saga";
import {
  SELECT_STORE_FOR_DATE,
  LOAD_ABOVE_STORE_SEARCH,
  DISPLAY_SELECTED_DOCUMENTS
} from "./constants";
import  { setSelectedDocuments } from "../DataContainer/actions";
import { push } from "react-router-redux";

function* selectStoreForDate(action) {
  yield put(push("/storepages/${action.sys_id}"));
}

export function* selectStoreForDateSaga() {
  yield takeLatest(SELECT_STORE_FOR_DATE, selectStoreForDate);
}

function* navigateToAboveStoreSearchInRouter() {
  yield put(push("/abovestoresearch"));
}

export function* loadAboveStoreSearchSaga() {
  yield takeLatest(LOAD_ABOVE_STORE_SEARCH, navigateToAboveStoreSearchInRouter);
}

function* displaySelectedDocuments(action) {
  yield put(setSelectedDocuments(action.selectedDocuments));
  yield put(push("/storepages"));
}

export function* displaySelectedDocumentsSaga() {
  yield takeLatest(DISPLAY_SELECTED_DOCUMENTS, displaySelectedDocuments);
}

// All sagas to be loaded
export default [
  selectStoreForDateSaga,
  loadAboveStoreSearchSaga,
  displaySelectedDocumentsSaga
];
