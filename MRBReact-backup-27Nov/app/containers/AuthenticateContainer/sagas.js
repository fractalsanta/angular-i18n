import { call, put, select } from "redux-saga/effects";
import { takeLatest } from "redux-saga";
import { AUTHENTICATE, SET_CURRENT_STORE_ID } from "./constants";
import * as dataService from "../../services/DataService";
import { authenticateSuccess } from "./actions";
import { push } from "react-router-redux";
import { fetchUserFacts } from "../../services/DataService";
import { makeSelectDatesAndStores } from "../DataContainer/selectors";
import { setSelectedDocuments } from "../DataContainer/actions";

function getMe() {
  return dataService.get("me").then(response => response.data);
}

function* authenticate() {
  const me = yield call(getMe);
  const activeNamespace = me.authorizations[0].namespace;
  const userFacts = yield call(fetchUserFacts, activeNamespace);
  const aboveStore = me.profiles.some(
    profile => profile === `${activeNamespace}.abovestore`
  );
  yield put(
    authenticateSuccess(me, activeNamespace, userFacts || {}, aboveStore)
  );
  yield put(push("/data"));
}

export function* authenticateSaga() {
  yield takeLatest(AUTHENTICATE, authenticate);
}

function* setStoreManagerDocuments(action) {
  const datesAndStores = yield select(makeSelectDatesAndStores());
  const selectedDocuments = datesAndStores.reduce((acc, dateAndStores) => {
    const storeWithDetails = dateAndStores.storesWithDetails.find(
      storeWithDetails => storeWithDetails.sys_id === action.storeId
    );
    acc.push(...storeWithDetails.activePages);
    return acc;
  }, []);
  yield put(setSelectedDocuments(selectedDocuments));
  yield put(push("/storepages"));
}

export function* setStoreManagerDocumentsSaga() {
  yield takeLatest(SET_CURRENT_STORE_ID, setStoreManagerDocuments);
}

export default [authenticateSaga, setStoreManagerDocumentsSaga];
