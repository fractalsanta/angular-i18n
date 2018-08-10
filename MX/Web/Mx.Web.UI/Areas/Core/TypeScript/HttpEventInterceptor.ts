module Core {
    "use strict";

    Core.NG.CoreModule.Module().config(["$httpProvider", ($httpProvider: ng.IHttpProvider): void => {
        var interceptorFn = ($q: ng.IQService, rootScope: ng.IRootScopeService) => {
            return {
                'response': (response) => {
                    rootScope.$broadcast(ApplicationEvent.HttpSuccess, response);
                    return response;
                },
                'responseError': (response) => {
                    rootScope.$broadcast(ApplicationEvent.HttpError, response);
                    return $q.reject(response);
                }
            };
            };

        var interceptor = [NG.$q.name, NG.$rootScope.name, interceptorFn];
        $httpProvider.interceptors.push(interceptor);

        (<ng.IHttpResponseTransformer[]>$httpProvider.defaults.transformResponse).push((data: any): any => {
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
}