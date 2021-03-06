// import { take, call, put, select } from 'redux-saga/effects';
import { put, call, select } from "redux-saga/effects";
import { takeLatest } from "redux-saga";
import { REQUEST_IMAGE } from "./constants";
import { requestImageSucceeded } from "./actions";
import * as dataService from "../../services/DataService";
import { selectActiveNamespace } from "../AuthenticateContainer/selectors";

// Individual exports for testing
function fetchImageFromApi(image, activeNamespace) {
  const url = `${activeNamespace}/controllers/vertx/upload/${image.replace(/\-\-\-/g, "/")}`;
  return dataService
    .get(url, { responseType: "blob" })
    .then(response => {
      const promise = new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.readAsDataURL(response.data);

        reader.onload = () => {
          if (!!reader.result) {
            resolve(reader.result.substr(reader.result.indexOf(",") + 1));
          } else {
            reject(Error("Failed converting to base64"));
          }
        };
      });
      promise.then(
        result => {
          return result;
        },
        err => {
          console.log(err);
        }
      );
      return promise;
    })
    .catch(err => {
      console.log(err);
    });
}

function* fetchImage(action) {
  const activeNamespace = yield select(selectActiveNamespace());
  const image64 = yield call(fetchImageFromApi, action.image, activeNamespace);
  yield put(requestImageSucceeded(image64));
}

export function* requestImageSaga() {
  yield* takeLatest(REQUEST_IMAGE, fetchImage);
}
// All sagas to be loaded
export default [requestImageSaga];
