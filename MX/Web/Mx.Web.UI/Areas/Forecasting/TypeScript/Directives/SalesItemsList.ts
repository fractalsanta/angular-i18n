module Forecasting {
    "use strict";

    interface ISalesItemsListScope extends ng.IScope {
        Translations: Api.Models.ITranslations;
        $filter: ng.IFilterService;
        $Element: any;

        ForecastingOptions: Services.IForecastingOptions;
        ForecastSalesItems?: Services.IForecastSalesItems;
        SearchParamTemp: string;

        SelectedSalesItem: Api.Models.ISalesItem;
        FilteredForecastSalesItems: any;
        FilterSalesItem(salesItem: Api.Models.ISalesItem): boolean;
        OnInputClick(e: Event): void;
        OnSalesItemClick(e: Event): void;
        LoadSalesItemData(salesItem: Api.Models.ISalesItem): void;
        SearchItems(e: Event): void;
    }

    class SalesItemsListController {
        constructor(
                private $scope: ISalesItemsListScope,
                $filter: ng.IFilterService,
                $translation: Core.ITranslationService,
                $timeout: ng.ITimeoutService) {
            $scope.$filter = $filter;

            $translation.GetTranslations().then((results: Core.Api.Models.ITranslations): void => {
                $scope.Translations = results.Forecasting;
            });

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

                $scope.ForecastSalesItems.SearchParam = $scope.SearchParamTemp.trim().toLocaleLowerCase();
            };

            $scope.FilterSalesItem = (salesItem: Api.Models.ISalesItem): boolean => {
                var searchFilter = $scope.ForecastSalesItems.SearchParam;

                return !searchFilter ||
                    (salesItem.Description.toLowerCase().indexOf(searchFilter) >= 0) ||
                    (salesItem.ItemCode.toLowerCase().indexOf(searchFilter) >= 0);
            };

            $scope.OnInputClick = (e: Event): void => {
                var target = e.target;

                $(target).select();
            };

            $scope.OnSalesItemClick = (e: Event): void => {
                var $target: any = $(e.target).closest("li"),
                    salesItem = null;

                if ($target.length) {
                    salesItem = $scope.FilteredForecastSalesItems[$target.index()];
                }

                if ($scope.ForecastSalesItems.SelectedSalesItem &&
                        $scope.ForecastSalesItems.SelectedSalesItem.Id === salesItem.Id) {
                    return;
                }

                $scope.ForecastSalesItems.SelectedSalesItem = salesItem;
            };

            $scope.$watch("ForecastSalesItems.SearchParam", function (searchParam: string): void {
                $(".mx-fg-salesitemslist").scrollTop(0);

                if ($scope.ForecastSalesItems) {
                    $scope.SearchParamTemp = searchParam ? searchParam : undefined;

                    if ($scope.ForecastSalesItems.SearchParam) {
                        $scope.FilteredForecastSalesItems =
                        $filter("filter")($scope.ForecastSalesItems.SalesItems, $scope.FilterSalesItem);
                    } else {
                        $scope.FilteredForecastSalesItems = [];
                    }
                }
            }, false);

            $scope.$watch("ForecastSalesItems.SelectedSalesItem", function (value: any): void {
                if ($scope.ForecastSalesItems) {
                    $scope.ForecastSalesItems.SelectedDescription =
                        value ? (value.Description + " - " + value.ItemCode) : undefined;
                }
                
                if (value === null) {
                    $(".mx-fg-salesitemslist").scrollTop(0);
                }
            }, false);
        }
    }

    Core.NG.ForecastingModule.RegisterNamedController("SalesItemsListController", SalesItemsListController,
        Core.NG.$typedScope<ISalesItemsListScope>(),
        Core.NG.$filter,
        Core.$translation,
        Core.NG.$timeout);

    class SalesItemsList implements ng.IDirective {
        constructor() {
            return <ng.IDirective>{
                restrict: "E",
                replace: true,
                templateUrl: "/Areas/Forecasting/Templates/SalesItemsDirective.html",
                controller: "Forecasting.SalesItemsListController",
                link: function ($scope: ISalesItemsListScope, element: any): void {
                    ;
                }
            };
        }
    }

    Core.NG.ForecastingModule.RegisterDirective("salesItemsList", SalesItemsList);
}