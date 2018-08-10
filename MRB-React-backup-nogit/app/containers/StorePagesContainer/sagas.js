// import { take, call, put, select } from 'redux-saga/effects';
import { put } from "redux-saga/effects";
import { push } from "react-router-redux";
import { takeLatest } from "redux-saga";
import { VIEW_IMAGE } from "./constants";

// Individual exports for testing
export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
}

function* viewImage(action) {
  yield put(push(`/viewimage/${action.image.replace(/\//g, '---')}`));
  console.log(action.image);
}

export function* viewImageSaga() {
  yield takeLatest(VIEW_IMAGE, viewImage);
}

// All sagas to be loaded
export default [defaultSaga, viewImageSaga];
