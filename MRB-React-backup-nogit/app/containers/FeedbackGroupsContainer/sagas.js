// import { take, call, put, select } from 'redux-saga/effects';
import { put, call } from "redux-saga/effects";
import { takeLatest } from "redux-saga";
import { SELECT_FEEDBACK_BY_TITLE } from "./constants";
import {  setSelectedFeedbackTitle } from "./actions";
import { push } from "react-router-redux";

// Individual exports for testing

function* selectFeedbackByTitle(action) {
  yield put(setSelectedFeedbackTitle(action.feedbackTitle));
  yield put(push('/feedbackitems'));
}

export function* selectFeedbackByTitleSaga() {
  yield takeLatest(SELECT_FEEDBACK_BY_TITLE, selectFeedbackByTitle)
}

// All sagas to be loaded
export default [selectFeedbackByTitleSaga];
