// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import { getAsyncInjectors } from "utils/asyncInjectors";

const errorLoading = err => {
  console.error("Dynamic page loading failed", err); // eslint-disable-line no-console
};

const loadModule = cb => componentModule => {
  cb(null, componentModule.default);
};

export default function createRoutes(store) {
  // Create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store); // eslint-disable-line no-unused-vars

  return [
    {
      path: "/",
      name: "authenticateContainer",
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import("containers/AuthenticateContainer"),
          import("containers/AuthenticateContainer/reducer"),
          import("containers/AuthenticateContainer/sagas")
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(
          ([component, drawerReducer, drawerSagas]) => {
            injectReducer("authenticateContainer", drawerReducer.default);
            injectSagas("authenticateContainer", drawerSagas.default);
            renderRoute(component);
          }
        );

        importModules.catch(errorLoading);
      }
    },
    {
      path: "/data",
      name: "dataContainer",
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import("containers/DataContainer"),
          import("containers/DataContainer/reducer"),
          import("containers/DataContainer/sagas")
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(
          ([component, drawerReducer, drawerSagas]) => {
            injectReducer("dataContainer", drawerReducer.default);
            injectSagas("dataContainer", drawerSagas.default);
            renderRoute(component);
          }
        );

        importModules.catch(errorLoading);
      }
    },
    {
      path: "/home",
      name: "home",
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import("containers/HomePage"),
          import("containers/navigationContainer/reducer"),
          import("containers/navigationContainer/sagas")
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(
          ([component, drawerReducer, drawerSagas]) => {
            injectReducer("navigationContainer", drawerReducer.default);
            injectSagas("navigationContainer", drawerSagas.default);
            renderRoute(component);
          }
        );

        importModules.catch(errorLoading);
      },
      childRoutes: [
        {
          path: "/storeprogress",
          name: "storeProgressContainer",
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import("containers/StoreProgressContainer/reducer"),
              import("containers/StoreProgressContainer/sagas"),
              import("containers/StoreProgressContainer")
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer("storeProgressContainer", reducer.default);
              injectSagas("storeProgressContainer", sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          }
        },
        {
          path: "/selectstore",
          name: "selectStoreContainer",
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import("containers/SelectStoreContainer/reducer"),
              import("containers/SelectStoreContainer/sagas"),
              import("containers/SelectStoreContainer")
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer("selectStoreContainer", reducer.default);
              injectSagas("selectStoreContainer", sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          }
        },
        {
          path: "/abovestoresearch",
          name: "aboveStoreSearchContainer",
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import("containers/AboveStoreSearchContainer/reducer"),
              import("containers/AboveStoreSearchContainer/sagas"),
              import("containers/AboveStoreSearchContainer")
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer("aboveStoreSearchContainer", reducer.default);
              injectSagas("aboveStoreSearchContainer", sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          }
        },
        {
          path: "/viewimage/:image",
          name: "viewImageContainer",
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import("containers/ViewImageContainer/reducer"),
              import("containers/ViewImageContainer/sagas"),
              import("containers/ViewImageContainer")
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer("viewImageContainer", reducer.default);
              injectSagas("viewImageContainer", sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          }
        },
        {
          path: "/feedbackgroups",
          name: "feedbackGroupsContainer",
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import("containers/FeedbackGroupsContainer/reducer"),
              import("containers/FeedbackGroupsContainer/sagas"),
              import("containers/FeedbackGroupsContainer")
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer("feedbackGroupsContainer", reducer.default);
              injectSagas("feedbackGroupsContainer", sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          }
        },
        {
          path: "/createfeedback",
          name: "createFeedbackContainer",
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import("containers/CreateFeedbackContainer/reducer"),
              import("containers/CreateFeedbackContainer/sagas"),
              import("containers/CreateFeedbackContainer")
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer("createFeedbackContainer", reducer.default);
              injectSagas("createFeedbackContainer", sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          }
        },
        {
          path: "/feedbackitems",
          name: "feedbackItemsContainer",
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import("containers/FeedbackItemsContainer/reducer"),
              import("containers/FeedbackItemsContainer/sagas"),
              import("containers/FeedbackItemsContainer")
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer("feedbackItemsContainer", reducer.default);
              injectSagas("feedbackItemsContainer", sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          }
        },
        {
          path: "/storepages",
          name: "storePagesContainer",
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import("containers/StorePagesContainer/reducer"),
              import("containers/StorePagesContainer/sagas"),
              import("containers/StorePagesContainer")
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, sagas, component]) => {
              injectReducer("storePagesContainer", reducer.default);
              injectSagas("storePagesContainer", sagas.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          }
        }
      ]
    },
    {
      path: "*",
      name: "notfound",
      getComponent(nextState, cb) {
        import("containers/NotFoundPage")
          .then(loadModule(cb))
          .catch(errorLoading);
      }
    }
  ];
}
