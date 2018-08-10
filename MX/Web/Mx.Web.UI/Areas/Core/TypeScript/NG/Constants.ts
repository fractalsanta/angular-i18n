// This will hold all needed Angular injection names

module Core.NG {
    "use strict";

    export var $anchorScroll: INamedDependency<ng.IAnchorScrollService> = { name: "$anchorScroll" };
    export var $cacheFactory: INamedDependency<ng.ICacheFactoryService> = { name: "$cacheFactory" };
    export var $cookieStore: INamedDependency<ng.cookies.ICookieStoreService> = { name: "$cookieStore" };
    export var $document: INamedDependency<ng.IDocumentService> = { name: "$document" };
    export var $filter: INamedDependency<ng.IFilterService> = { name: "$filter" };
    export var $filterProvider: INamedDependency<ng.IFilterProvider> = { name: "$filterProvider" };
    export var $http: INamedDependency<ng.IHttpService> = { name: "$http" };
    export var $httpBackend: INamedDependency<ng.IHttpBackendService> = { name: "$httpBackend" };
    export var $httpProvider: INamedDependency<ng.IHttpProvider> = { name: "$httpProvider" };
    export var $interval: INamedDependency<ng.IIntervalService> = { name: "$interval" };
    export var $locale: INamedDependency<ng.ILocaleService> = { name: "$locale" };
    export var $location: INamedDependency<ng.ILocationService> = { name: "$location" };
    export var $locationProvider: INamedDependency<ng.ILocationProvider> = { name: "$locationProvider" };
    export var $log: INamedDependency<ng.ILogService> = { name: "$log" };
    export var $parse: INamedDependency<ng.IParseService> = { name: "$parse" };
    export var $parseProvider: INamedDependency<ng.IParseProvider> = { name: "$parseProvider" };
    export var $provide: INamedDependency<ng.auto.IProvideService> = { name: "$provide" };
    export var $q: INamedDependency<ng.IQService> = { name: "$q" };
    export var $rootElement: INamedDependency<ng.IRootElementService> = { name: "$rootElement" };
    export var $rootScope: INamedDependency<ng.IRootScopeService> = { name: "$rootScope" };
    export var $scope: INamedDependency<ng.IScope> = { name: "$scope" };
    export var $templateCache: INamedDependency<ng.ITemplateCacheService> = { name: "$templateCache" };
    export var $timeout: INamedDependency<ng.ITimeoutService> = { name: "$timeout" };
    export var $window: INamedDependency<ng.IWindowService> = { name: "$window" };
    export var $modal: INamedDependency<angular.ui.bootstrap.IModalService> = { name: "$modal" };
    export var $modalStack: INamedDependency<angular.ui.bootstrap.IModalStackService> = { name: "$modalStack" };
    export var $modalInstance: INamedDependency<angular.ui.bootstrap.IModalServiceInstance> = { name: "$modalInstance" };
    export var $upload: INamedDependency<angular.external.fileupload.IFileUpload> = { name: "$upload" };
    export var $sce: INamedDependency<ng.ISCEService> = { name: "$sce" };
    export var $state: INamedDependency<ng.ui.IStateService> = { name: "$state" };
    export var $stateProvider: INamedDependency<ng.ui.IStateProvider> = { name: "$stateProvider" };
    export var $urlRouterProvider: INamedDependency<ng.ui.IUrlRouterProvider> = { name: "$urlRouterProvider" };
    export var $mxlocalStorage: INamedDependency<ng.external.localstorage.ILocalStorage> = { name: "localStorageService" };
    export var $sanitize: INamedDependency<ng.sanitize.ISanitizeService> = { name: "$sanitize" };

    export function $typedScope<TScope extends ng.IScope>(): NG.INamedDependency<TScope> {
        return { name: "$scope" };
    }

    export function $typedStateParams<TParams>(): NG.INamedDependency<TParams> {
        return { name: "$stateParams" };
    }

    export function $typedCustomResolve<T>(resolveName: string): NG.INamedDependency<T> {
        return { name: resolveName };
    }

}

