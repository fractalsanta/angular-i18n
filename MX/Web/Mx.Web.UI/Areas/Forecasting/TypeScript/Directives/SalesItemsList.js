var Forecasting;
(function (Forecasting) {
    "use strict";
    var SalesItemsListController = (function () {
        function SalesItemsListController($scope, $filter, $translation, $timeout) {
            this.$scope = $scope;
            $scope.$filter = $filter;
            $translation.GetTranslations().then(function (results) {
                $scope.Translations = results.Forecasting;
            });
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
                $scope.ForecastSalesItems.SearchParam = $scope.SearchParamTemp.trim().toLocaleLowerCase();
            };
            $scope.FilterSalesItem = function (salesItem) {
                var searchFilter = $scope.ForecastSalesItems.SearchParam;
                return !searchFilter ||
                    (salesItem.Description.toLowerCase().indexOf(searchFilter) >= 0) ||
                    (salesItem.ItemCode.toLowerCase().indexOf(searchFilter) >= 0);
            };
            $scope.OnInputClick = function (e) {
                var target = e.target;
                $(target).select();
            };
            $scope.OnSalesItemClick = function (e) {
                var $target = $(e.target).closest("li"), salesItem = null;
                if ($target.length) {
                    salesItem = $scope.FilteredForecastSalesItems[$target.index()];
                }
                if ($scope.ForecastSalesItems.SelectedSalesItem &&
                    $scope.ForecastSalesItems.SelectedSalesItem.Id === salesItem.Id) {
                    return;
                }
                $scope.ForecastSalesItems.SelectedSalesItem = salesItem;
            };
            $scope.$watch("ForecastSalesItems.SearchParam", function (searchParam) {
                $(".mx-fg-salesitemslist").scrollTop(0);
                if ($scope.ForecastSalesItems) {
                    $scope.SearchParamTemp = searchParam ? searchParam : undefined;
                    if ($scope.ForecastSalesItems.SearchParam) {
                        $scope.FilteredForecastSalesItems =
                            $filter("filter")($scope.ForecastSalesItems.SalesItems, $scope.FilterSalesItem);
                    }
                    else {
                        $scope.FilteredForecastSalesItems = [];
                    }
                }
            }, false);
            $scope.$watch("ForecastSalesItems.SelectedSalesItem", function (value) {
                if ($scope.ForecastSalesItems) {
                    $scope.ForecastSalesItems.SelectedDescription =
                        value ? (value.Description + " - " + value.ItemCode) : undefined;
                }
                if (value === null) {
                    $(".mx-fg-salesitemslist").scrollTop(0);
                }
            }, false);
        }
        return SalesItemsListController;
    }());
    Core.NG.ForecastingModule.RegisterNamedController("SalesItemsListController", SalesItemsListController, Core.NG.$typedScope(), Core.NG.$filter, Core.$translation, Core.NG.$timeout);
    var SalesItemsList = (function () {
        function SalesItemsList() {
            return {
                restrict: "E",
                replace: true,
                templateUrl: "/Areas/Forecasting/Templates/SalesItemsDirective.html",
                controller: "Forecasting.SalesItemsListController",
                link: function ($scope, element) {
                    ;
                }
            };
        }
        return SalesItemsList;
    }());
    Core.NG.ForecastingModule.RegisterDirective("salesItemsList", SalesItemsList);
})(Forecasting || (Forecasting = {}));
