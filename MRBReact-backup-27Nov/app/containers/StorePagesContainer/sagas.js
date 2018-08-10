// import { take, call, put, select } from 'redux-saga/effects';
import { put, call, select } from "redux-saga/effects";
import { push } from "react-router-redux";
import { takeLatest } from "redux-saga";
import { VIEW_IMAGE, UPLOAD_IMAGE } from "./constants";
import * as dataService from "../../services/DataService";
import {
  selectActiveNamespace,
  selectCurrentStoreId,
  selectUserName
} from "../AuthenticateContainer/selectors";
import { addItemToPostQueue } from "../DataContainer/actions";
import Moment from "moment";
import md5 from "md5";
import uuidv1 from "uuid/v1";

function* viewImage(action) {
  yield put(push(`/viewimage/${action.image.replace(/\//g, "---")}`));
  console.log(action.image);
}

export function* viewImageSaga() {
  yield takeLatest(VIEW_IMAGE, viewImage);
}

function* uploadImage(action) {
  const activeNamespace = yield select(selectActiveNamespace());
  const currentStoreId = yield select(selectCurrentStoreId());
  const userName = yield select(selectUserName());

  const todayMoment = Moment();
  const nowTimestamp = todayMoment.utc().format("YYYYMMDDHHmmss");

  const docMoment = Moment(action.image.date);
  const docDate = docMoment.format("YYYYMMDD");
  const path =
    "mrbnext/" +
    currentStoreId +
    "/" +
    docDate +
    "/" +
    md5(action.image.title) +
    "/" +
    nowTimestamp +
    ".jpeg";
  yield put(
    addItemToPostQueue(uuidv1(), "uploadFileFromBase64", {
      image: action.image,
      path
    })
  );
  console.log("1");
  const userHistory = {};
  userHistory[userName] = todayMoment.toISOString();
  const documentObject = {
    content_url: activeNamespace + "/" + path,
    uploaded_by: userName,
    store_id: currentStoreId,
    mrblist: action.image.title,
    business_day: action.image.date,
    status: "complete",
    user_history: [userHistory]
  };
  const newDoc = {
    store_id: documentObject.store_id,
    business_day: documentObject.business_day,
    content_url: documentObject.content_url ,
    status: documentObject.status,
    mrblist: documentObject.mrblist
  };
  yield put(
    addItemToPostQueue(uuidv1(), "postDocument", documentObject, 'addItemToDocuments', newDoc)
  );
  debugger;
  console.log("2");
}

export function* uploadImageSaga() {
  yield takeLatest(UPLOAD_IMAGE, uploadImage);
}

// All sagas to be loaded
export default [viewImageSaga, uploadImageSaga];
