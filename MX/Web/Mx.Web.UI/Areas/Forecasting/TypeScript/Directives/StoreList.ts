module Forecasting {
    "use strict";

    interface IStoresListScope extends ng.IScope {
        $filter: ng.IFilterService;
        $Element: any;
        Model: {
            Stores: Core.Api.Models.IEntityModel[];
            SelectedStore: Core.Api.Models.IEntityModel;
            SearchParam: string;
            SelectedStoreName: string;
        }

        SearchParamTemp: string;

        FilteredStores: Core.Api.Models.IEntityModel[];
        FilterStores(store: Core.Api.Models.IEntityModel): boolean;
        OnInputClick(e: Event): void;
        OnStoreClick(e: Event): void;
        SearchItems(e: Event): void;
    }

    class StoresListController {
        constructor(
            private $scope: IStoresListScope,
            $filter: ng.IFilterService,
            $translation: Core.ITranslationService,
            $timeout: ng.ITimeoutService) {
            $scope.$filter = $filter;

            $scope.SearchItems = (e: Event): void => {
                var element = angular.element(e.target);

                e.preventDefault();
                e.stopPropagation();

                $timeout((): void => {
                    element.blur();
                    if (window.isIOSDevice()) {
                        element.closest("form").find("input").blur();
                    }
                });

                $scope.Model.SearchParam = $scope.SearchParamTemp.trim().toLocaleLowerCase();
            };

            $scope.FilterStores = (store: Core.Api.Models.IEntityModel): boolean => {
                var searchFilter = $scope.Model.SearchParam;

                return !searchFilter ||
                    (store.Name.toLowerCase().indexOf(searchFilter) >= 0) ||
                    (store.Number.toLowerCase().indexOf(searchFilter) >= 0);
            };

            $scope.OnInputClick = (e: Event): void => {
                var target = e.target;
                $(target).select();
            };

            $scope.OnStoreClick = (e: Event): void => {
                var $target: any = $(e.target).closest("li"),
                    store = null;

                if ($target.length) {
                    store = $scope.FilteredStores[$target.index()];
                }

                if ($scope.Model.SelectedStore &&
                    $scope.Model.SelectedStore.Id === store.Id) {
                    return;
                }

                $scope.Model.SelectedStore = store;
            };

            $scope.$watch("Model.SearchParam", function (searchParam: string): void {
                $(".mx-fg-storelist").scrollTop(0);

                if ($scope.Model.Stores) {
                    $scope.SearchParamTemp = searchParam ? searchParam : undefined;

                    if ($scope.Model.SearchParam) {
                        $scope.FilteredStores =
                        $filter("filter")($scope.Model.Stores, $scope.FilterStores);
                    } else {
                        if ($scope.Model.Stores.length > 10) {
                            $scope.FilteredStores = [];
                        } else {
                            $scope.FilteredStores = $scope.Model.Stores;
                        }
                    }
                }
            }, false);
        }
    }

    Core.NG.ForecastingModule.RegisterNamedController("StoresListController", StoresListController,
        Core.NG.$typedScope<IStoresListScope>(),
        Core.NG.$filter,
        Core.$translation,
        Core.NG.$timeout);

    class StoresList implements ng.IDirective {
        constructor() {
            return <ng.IDirective>{
                restrict: "E",
                replace: true,
                templateUrl: "/Areas/Forecasting/Templates/StoresListDirective.html",
                controller: "Forecasting.StoresListController",
                link: function ($scope: IStoresListScope, element: any): void {
                    ;
                }
            };
        }
    }

    Core.NG.ForecastingModule.RegisterDirective("storesList", StoresList);
} 