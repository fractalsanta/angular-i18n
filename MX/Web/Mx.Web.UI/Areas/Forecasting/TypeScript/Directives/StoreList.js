var Forecasting;
(function (Forecasting) {
    "use strict";
    var StoresListController = (function () {
        function StoresListController($scope, $filter, $translation, $timeout) {
            this.$scope = $scope;
            $scope.$filter = $filter;
            $scope.SearchItems = function (e) {
                var element = angular.element(e.target);
                e.preventDefault();
                e.stopPropagation();
                $timeout(function () {
                    element.blur();
                    if (window.isIOSDevice()) {
                        element.closest("form").find("input").blur();
                    }
                });
                $scope.Model.SearchParam = $scope.SearchParamTemp.trim().toLocaleLowerCase();
            };
            $scope.FilterStores = function (store) {
                var searchFilter = $scope.Model.SearchParam;
                return !searchFilter ||
                    (store.Name.toLowerCase().indexOf(searchFilter) >= 0) ||
                    (store.Number.toLowerCase().indexOf(searchFilter) >= 0);
            };
            $scope.OnInputClick = function (e) {
                var target = e.target;
                $(target).select();
            };
            $scope.OnStoreClick = function (e) {
                var $target = $(e.target).closest("li"), store = null;
                if ($target.length) {
                    store = $scope.FilteredStores[$target.index()];
                }
                if ($scope.Model.SelectedStore &&
                    $scope.Model.SelectedStore.Id === store.Id) {
                    return;
                }
                $scope.Model.SelectedStore = store;
            };
            $scope.$watch("Model.SearchParam", function (searchParam) {
                $(".mx-fg-storelist").scrollTop(0);
                if ($scope.Model.Stores) {
                    $scope.SearchParamTemp = searchParam ? searchParam : undefined;
                    if ($scope.Model.SearchParam) {
                        $scope.FilteredStores =
                            $filter("filter")($scope.Model.Stores, $scope.FilterStores);
                    }
                    else {
                        if ($scope.Model.Stores.length > 10) {
                            $scope.FilteredStores = [];
                        }
                        else {
                            $scope.FilteredStores = $scope.Model.Stores;
                        }
                    }
                }
            }, false);
        }
        return StoresListController;
    }());
    Core.NG.ForecastingModule.RegisterNamedController("StoresListController", StoresListController, Core.NG.$typedScope(), Core.NG.$filter, Core.$translation, Core.NG.$timeout);
    var StoresList = (function () {
        function StoresList() {
            return {
                restrict: "E",
                replace: true,
                templateUrl: "/Areas/Forecasting/Templates/StoresListDirective.html",
                controller: "Forecasting.StoresListController",
                link: function ($scope, element) {
                    ;
                }
            };
        }
        return StoresList;
    }());
    Core.NG.ForecastingModule.RegisterDirective("storesList", StoresList);
})(Forecasting || (Forecasting = {}));
