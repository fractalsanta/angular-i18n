// import { take, call, put, select } from 'redux-saga/effects';
import { NAVIGATE_TO_STORES } from './constants';
import { takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { navigateToStores } from './actions';
import { push } from 'react-router-redux';

// Individual exports for testing
export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
}

function* pushNavigate(action) {
  yield put(push(`/selectstore`));
}

export function* navigateSaga() {
  yield* takeLatest(NAVIGATE_TO_STORES,pushNavigate)
}

// All sagas to be loaded
export default [
    navigateSaga,
];
