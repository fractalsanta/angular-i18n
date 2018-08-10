import axios from "axios";
axios.defaults.withCredentials = true;
import * as authenticationService from "./AuthenticationService";
import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);

const ROOT_URL = "https://api.bodhi-dev.io/";
const ROOT_URL_AUTHZ = "https://authz.bodhi-dev.io/";

const start = new Date(2017, 8, 1);
const end = new Date(2017, 9, 30);
const range = moment.range(start, end);
let acc = Array.from(range.by("day", { step: 1 }));
const inRange = acc.map(m => m.format("YYYY-MM-DD"));

const handleError = err => {
  console.log(err);
  if (err.response.status === 401) {
    authenticationService.login();
  }
};

export const post = (url, object) => {
  return axios
    .post(ROOT_URL + url, object)
    .then(response => {
      return response.data;
    })
    .catch(handleError);
};

export const put = (url, object, namespace, path) => {
  return axios
    .put(ROOT_URL + url, object, {
      headers: {
        "Content-Type": undefined,
        location: namespace + "/" + path
      }
    })
    .then(response => {
      return response.data;
    })
    .catch(handleError);
};

export const get = (url, object) => {
  return axios.get(ROOT_URL + url, object).catch(handleError);
};

export const getAuthz = (url, object) => {
  return axios.get(ROOT_URL_AUTHZ + url, object).catch(handleError);
};

export const fetchUserFacts = namespace => {
  return getAuthz(`${namespace}/userFacts`);
};

export const fetchStoreData = namespace => {
  const searchObj = {
    fields: ["sys_id", "name", "display_name"],
    paging: ["page:1", "limit:100"]
  };
  return post(`${namespace}/search/Store`, searchObj);
};

export const fetchStoreRollups = (namespace, rollupNames) => {
  const searchObj = {
    where: {
      rollup: {
        $in: [...rollupNames]
      }
    },
    fields: ["store_id", "path", "rollup"],
    paging: ["page:1", "limit:100"]
  };
  return post(`${namespace}/search/StoreRollup`, searchObj);
};

export const fetchRollups = namespace => {
  const searchObj = {
    fields: ["sys_id", "name", "display_name", "nodes"],
    paging: ["page:1", "limit:100"]
  };
  return post(`${namespace}/search/Rollup`, searchObj);
};

export const fetchDocumentTaskListData = namespace => {
  const searchObj = {
    fields: ["page_ids", "store_ids"],
    paging: ["page:1", "limit:100"]
  };
  return post(`${namespace}/search/MRBDocumentTasksList`, searchObj);
};

export const fetchDocumentPageInfo = (namespace, page_ids) => {
  const searchObj = {
    where: {
      $and: [
        {
          sys_id: {
            $in: page_ids
          }
        },
        { pages: { $elemMatch: { page_business_day: { $in: inRange } } } }
      ]
    },
    paging: ["page:1", "limit:100"]
  };
  return post(`${namespace}/search/MRBDocumentPageInfo`, searchObj);
};

export const fetchDocument = namespace => {
  const searchObj = {
    where: {
      business_day: {
        $in: inRange
      }
    },
    fields: ["status", "content_url", "mrblist", "business_day", "store_id"],
    paging: ["page:1", "limit:100"]
  };
  return post(`${namespace}/search/MRBDocument`, searchObj);
};

export const fetchFeedback = namespace => {
  const searchObj = {
    where: {
      archived: false
    },
    paging: ["page:1", "limit:100"]
  };
  return post(`${namespace}/search/MRBFeedback`, searchObj);
};

export const postFeedback = (namespace, feedbackObject) => {
  return post(`${namespace}/resources/MRBFeedback`, feedbackObject);
};

export const postDocument = (namespace, documentObject) => {
  return post(`${namespace}/resources/MRBDocument`, documentObject);
};

export const putImage = (namespace, feedbackObject) => {
  return post(`${namespace}/resources/MRBFeedback`, feedbackObject);
};

export const createDatesAndStores = (
  stores,
  documentTaskList,
  documentPageInfo,
  documents
) => {
  return inRange.map(date => {
    return createDateAndStoresObject(
      date,
      stores,
      documentTaskList,
      documentPageInfo,
      documents
    );
  });
};

function createDateAndStoresObject(
  selectedDate,
  stores,
  documentTaskList,
  documentPageInfo,
  documents
) {
  const storesWithDetails = [];
  stores.forEach(function(store) {
    let storeWithDetails = {};
    storeWithDetails.name = store.name;
    storeWithDetails.sys_id = store.sys_id;
    storeWithDetails.pageIds = [];
    storeWithDetails.activePages = [];
    documentTaskList.forEach(function(task) {
      let hasStore = task.store_ids.some(store_id => store_id === store.sys_id);
      hasStore && storeWithDetails.pageIds.push(...task.page_ids);
    });

    storeWithDetails.pageIds.forEach(function(pageId) {
      let page = documentPageInfo.find(pageInfo => pageInfo.sys_id === pageId);
      if (page) {
        // let hasDate = page.pages.some(subPage => subPage.page_business_day === selectedDate);
        let pageWithDate = page.pages.find(
          subPage => subPage.page_business_day === selectedDate
        );
        if (pageWithDate) {
          storeWithDetails.activePages.push({
            title: page.title,
            number: pageWithDate.page_number,
            date: selectedDate
          });
        }
      }
    });
    let completed = storeWithDetails.activePages.reduce(function(sum, value) {
      let match = documents.find(document => {
        return (
          document.store_id === storeWithDetails.sys_id &&
          document.business_day === selectedDate &&
          document.mrblist === value.title
        );
      });
      if (match) {
        value.completed = true;
        value.content_url = match.content_url;
      }
      return sum + (match ? 1 : 0);
    }, 0);
    storeWithDetails.completedPercent = completed
      ? completed / storeWithDetails.activePages.length * 100
      : 0;
    storesWithDetails.push(storeWithDetails);
  });
  return {
    date: selectedDate,
    storesWithDetails
  };
}

export const groupFeedbacks = feedbacks => {
  const groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };
  const feedbackGrouped = groupBy(feedbacks, "title");
  const feedbackGroupedAndFormatted = [];
  for (let property in feedbackGrouped) {
    if (feedbackGrouped.hasOwnProperty(property)) {
      feedbackGroupedAndFormatted.push({
        _id: property,
        count: feedbackGrouped[property].length
      });
    }
  }
  return feedbackGroupedAndFormatted;
};

export const uploadFileFromBase64 = (namespace, obj) => {
  const fileBlob = base64toBlob(obj.image.data, obj.image.contentType);
  const fd = new FormData();

  fd.append("upload1", fileBlob, obj.path);

  const url = namespace + "/controllers/vertx/upload";
  return put(url, fd, namespace, obj.path);
};

function base64toBlob(base64Data, contentType) {
  var byteString = atob(base64Data);

  var content = new Array();
  for (var i = 0; i < byteString.length; i++) {
    content[i] = byteString.charCodeAt(i);
  }

  return new Blob([new Uint8Array(content)], { type: contentType });
}
