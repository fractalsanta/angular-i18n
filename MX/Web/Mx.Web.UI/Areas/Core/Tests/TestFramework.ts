// =======================================================================================================
//                    AngularJS Dependencies (for TypeScript compilation)
// =======================================================================================================
/// <reference path="../../../scripts/typings/jasmine/jasmine.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-cookies.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-sanitize.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular-mocks.d.ts" />
/// <reference path="../../../scripts/typings/angular-ui-bootstrap/angular-ui-bootstrap.d.ts" />
/// <reference path="../../../scripts/typings/angular-external-modules/angular-external-fileupload.d.ts" />
/// <reference path="../../../Scripts/typings/angular-external-modules/angular-local-storage.d.ts" />
/// <reference path="../../../scripts/typings/angular-external-modules/angular-ui-router.d.ts" />

// =======================================================================================================
//                    Additional typings for TypeScript compilation
// =======================================================================================================
/// <reference path="../../../scripts/typings/lodash/lodash.d.ts" />
/// <reference path="../../../scripts/typings/moment/moment.d.ts" />
/// <reference path="../../../scripts/typings/cryptojs/cryptojs.d.ts" />
/// <reference path="../../../scripts/typings/signalr/signalr.d.ts" />

// =======================================================================================================
//                    JS libraries to load for tests
// =======================================================================================================
/// <chutzpah_reference path="../../../scripts/angular/angular.js" />
/// <chutzpah_reference path="../../../scripts/angular/angular-mocks.js" />
/// <chutzpah_reference path="../../../scripts/angular/angular-cookies.js" />
/// <chutzpah_reference path="../../../scripts/angular/angular-sanitize.js" />
/// <chutzpah_reference path="../../../scripts/angular-ui/ui-bootstrap-tpls-0.13.3.js" />
/// <chutzpah_reference path="../../../scripts/angular-ui/validate.ts" />
/// <chutzpah_reference path="../../../scripts/angular-external-modules/ui-router/angular-ui-router.js" />
/// <chutzpah_reference path="../../../scripts/moment/moment-with-langs.js" />
/// <chutzpah_reference path="../../../scripts/lodash.js" />
/// <chutzpah_reference path="../../../scripts/jquery-2.1.0.js" />
/// <chutzpah_reference path="../../../scripts/jstree.js" />
/// <chutzpah_reference path="../../../scripts/angular-external-modules/ngJsTree/ngJsTree.js" />
/// <chutzpah_reference path="../../../scripts/kendo/kendo.new.core.js" />
/// <chutzpah_reference path="../../../scripts/kendo/kendo.dataviz.js" />
/// <chutzpah_reference path="../../../scripts/kendo/angular-kendo.js" />


// =======================================================================================================
//                    Registry Framework
// =======================================================================================================
/// <reference path="../typescript/ng/istatenode.d.ts" />
/// <reference path="../typescript/ng/statenode.ts" />
/// <reference path="../typescript/ng/iregistry.d.ts" />
/// <reference path="../typescript/ng/constants.ts" />
/// <reference path="../typescript/ng/registry.ts" />
/// <reference path="../typescript/ng/modules.ts" />

// =======================================================================================================
//                    T4 Generated definitions
// =======================================================================================================
/// <reference path="../../../Config/T4/ApiDefinitions.ts" />
/// <reference path="../../../Config/T4/ApiImplementation.ts" />
// =======================================================================================================
//                    Core Constants and models
// =======================================================================================================
/// <reference path="../TypeScript/Enum/HttpStatus.ts" />
/// <reference path="../TypeScript/Enum/UiRouterStates.ts" />
/// <reference path="../TypeScript/Enum/ApplicationEvent.ts" />
/// <reference path="../TypeScript/Models/IChangeStoreEventArg.ts" />
/// <reference path="../TypeScript/Models/IPopupMessage.ts" />
/// <reference path="../Typescript/Models/ITimeRange.ts" />
/// <reference path="../TypeScript/Constants.ts" />
/// <reference path="../TypeScript/Extensions.ts" />
/// <reference path="../Typescript/IDateRange.d.ts" />
/// <reference path="../TypeScript/Events.ts" />

// =======================================================================================================
//                    Test Framework Types
// =======================================================================================================
/// <reference path="Interfaces/IMock.d.ts" />

// =======================================================================================================
//                    Core Framework services used almost everywhere
// =======================================================================================================
/// <reference path="../TypeScript/Interfaces/IPopupMessageService.d.ts" />
/// <reference path="../TypeScript/Services/TranslationService.ts" />
/// <reference path="../TypeScript/Services/AuthService.ts" />
/// <reference path="Mocks/AuthServiceMock.ts" />
/// <reference path="Mocks/ModalServiceInstanceMock.ts" />
/// <reference path="Mocks/StateServiceMock.ts" />
/// <reference path="Mocks/ConfirmationServiceMock.ts" />
/// <reference path="Mocks/PopupMessageServiceMock.ts" />
/// <reference path="Mocks/TranslationServiceMock.ts" />

/// <reference path="Mocks/LocalStorageServiceMock.ts" />
/// <reference path="../Typescript/Services/LocalStorage.ts" />



class PromiseHelper {
    constructor(private $q: ng.IQService) { }

    public CreatePromise<T>(value: T): ng.IPromise<T> {
        return this.$q.when(value);
    }

    public CreateHttpPromise<T>(value: T): ng.IHttpPromise<T> {
        var model: ng.IHttpPromiseCallbackArg<T> = { data: value, status: 200 };
        var promise: ng.IHttpPromise<T> = <ng.IHttpPromise<T>>this.$q.when(model);
        promise.success = (callback: ng.IHttpPromiseCallback<T>) => {
            promise.then((response) => {
                callback(response.data, response.status, <ng.IHttpHeadersGetter>response.headers, response.config);
            });
            return promise;
        };
        promise.error = (callback: ng.IHttpPromiseCallback<any>): ng.IHttpPromise<T> => {
            promise.then(null, (response) => {
                callback(response.data, response.status, <ng.IHttpHeadersGetter>response.headers, response.config);
            });
            return promise;
        };
        return promise; 
    }
}

class ConstantsMock {

    Object: Core.IConstants = <Core.IConstants>{
        InternalDateFormat: "YYYY-MM-DD",
        InternalDateTimeFormat: "YYYY-MM-DDTHH:mm:ss",
        NumericalInputBoxPattern: ""
    }
};