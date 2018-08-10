import { take, call, put, select } from "redux-saga/effects";
import { takeLatest } from "redux-saga";
import { push } from "react-router-redux";
import { SUBMIT_FEEDBACK } from "./constants";
import * as dataService from "../../services/DataService";
import {
  selectActiveNamespace,
  selectCurrentStoreId
} from "../AuthenticateContainer/selectors";
import { selectPostQueue } from "../DataContainer/selectors";
import { addItemToPostQueue } from "../DataContainer/actions";
import uuidv1 from 'uuid/v1';

function* submitFeeback(action) {
  const activeNamespace = yield select(selectActiveNamespace());
  const currentStoreId = yield select(selectCurrentStoreId());

  const feedbackObj = {
    title: action.title,
    feedback: action.comments,
    store_id: currentStoreId,
    archived: false
  };
  yield put(addItemToPostQueue(uuidv1(), 'postFeedback', feedbackObj));
  // const feedback = yield call(
  //   dataService['postFeedback'],
  //   activeNamespace,
  //   feedbackObj
  // );
  yield put(push("/storepages"))
}
// Individual exports for testing
export function* submitFeedbackSaga() {
  yield takeLatest(SUBMIT_FEEDBACK, submitFeeback);
}

// All sagas to be loaded
export default [submitFeedbackSaga];
