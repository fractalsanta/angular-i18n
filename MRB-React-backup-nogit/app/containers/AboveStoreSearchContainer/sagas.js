import { put } from "redux-saga/effects";
import { takeLatest } from "redux-saga";
import { DISPLAY_SEARCH_DOCUMENTS } from "./constants";
import { setSelectedDocuments } from "../DataContainer/actions";

// Individual exports for testing
function* displaySearchDocuments(action) {
  yield put(setSelectedDocuments(action.selectedDocuments));
  yield put(push("/storepages"));
}

export function* displaySearchDocumentsSaga() {
  yield takeLatest(DISPLAY_SEARCH_DOCUMENTS, displaySearchDocuments);
}

// All sagas to be loaded
export default [displaySearchDocumentsSaga];
