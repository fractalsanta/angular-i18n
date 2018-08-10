var Core;
(function (Core) {
    "use strict";
    Core.NG.CoreModule.Module().config(["$httpProvider", function ($httpProvider) {
            var interceptorFn = function ($q, rootScope) {
                return {
                    'response': function (response) {
                        rootScope.$broadcast(Core.ApplicationEvent.HttpSuccess, response);
                        return response;
                    },
                    'responseError': function (response) {
                        rootScope.$broadcast(Core.ApplicationEvent.HttpError, response);
                        return $q.reject(response);
                    }
                };
            };
            var interceptor = [Core.NG.$q.name, Core.NG.$rootScope.name, interceptorFn];
            $httpProvider.interceptors.push(interceptor);
            $httpProvider.defaults.transformResponse.push(function (data) {
                if (typeof data === "string") {
                    switch (data.toLowerCase()) {
                        case "null":
                            data = null;
                            break;
                        case "true":
                        case "false":
                            data = JSON.parse(data);
                            break;
                        default:
                            break;
                    }
                }
                return data;
            });
        }]);
})(Core || (Core = {}));
