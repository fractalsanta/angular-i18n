module Inventory.Production {
    "use strict";

    interface IPrepAdjustItemSearchControllerScope extends ng.IScope {
        Search(searchText: string): void;
        Cancel(): void;
        OK(): void;
        SearchTextValid(): boolean;
        LoadInitialData(): void;
        AddItem(item: Api.Models.IPrepAdjustedItem): void;

        Translations: Api.Models.IL10N;
        GridDefinitions: { Field: string; Title: string; Width?: string; ColWidth: string; }[];

        DisplayOptions: {
            SortProperty: string;
            SortAscending: boolean;
        };

        SortColumn(field: string): void;
        Sort(): void;

        Model: {
            SearchText: string;
            SelectedIdHash: any;
            Items: Api.Models.IPrepAdjustedItem[];
            L10N?: Forecasting.Api.Models.ITranslations;
            AddSelectedItems: Api.Models.IPrepAdjustedItem[];
            ExistingIdHash: any;
        };
    }

    class PrepAdjustItemSearchController {
        constructor(
            private $scope: IPrepAdjustItemSearchControllerScope,
            private modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private translationService: Core.ITranslationService,
            private prepAdjustItemSearchService: Production.Api.IPrepAdjustItemSearchService,
            private $authService: Core.Auth.IAuthService,
            private existingItems: Api.Models.IPrepAdjustedItem[]
        ) {
            
            var user = $authService.GetUser();

            $scope.Model = {
                SearchText: '',
                SelectedIdHash: {},
                Items: [],
                AddSelectedItems: [],
                ExistingIdHash: 0,
            };


            $scope.Model.ExistingIdHash = function () {
                var existingIdHash = {};

                $.each(existingItems, function () {
                    existingIdHash[this.Id] = this;
                });

                return existingIdHash;
            } ();


            $scope.DisplayOptions = {
                SortProperty: "Description",
                SortAscending: true
            };


            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                var tran = $scope.Translations = result.InventoryProduction;

                $scope.GridDefinitions = [
                    { Field: "", Title: "", ColWidth: "col-xs-1" },
                    { Field: "Name", Title: tran.Description, ColWidth: "col-xs-11" }
                ];

                $scope.$broadcast("mxTableSync-refresh");
            });


            $scope.SearchTextValid = (): boolean => {
                return ($scope.Model.SearchText && $scope.Model.SearchText.length >= 1);
            };


            $scope.LoadInitialData = (): void => {
                
                this.prepAdjustItemSearchService.GetPrepAdjustItemsByEntityId(user.BusinessUser.MobileSettings.EntityId, "", 0)
                    .success(results => {

                        _.each(results, (item: Api.Models.IPrepAdjustedItem): void => {
                            item.Outers = undefined;
                            item.Inners = undefined;
                            item.Units = undefined;
                        });

                        if (results.length <= 10) {
                            $scope.Model.Items = results;
                        } 
                    });
            };


            $scope.Search = (searchText: string): void => {
                if ($scope.SearchTextValid()) {
                    setTimeout(() => {
                        $(document.activeElement).blur();
                    }, 10);

                    this.prepAdjustItemSearchService.GetPrepAdjustItemsByEntityId(user.BusinessUser.MobileSettings.EntityId, searchText, 0)
                        .success(results => {
                            //// Needed to do this because the number-only-input.directive.ts tests against 'undefined' and returns "0". If it is null, then it escapes the check and causes a javascript error.
                            _.each(results, (item: Api.Models.IPrepAdjustedItem): void => {
                                item.Outers = undefined;
                                item.Inners = undefined;
                                item.Units = undefined;
                            });

                            $scope.Model.Items = results;
                        });
                }
            };


            $scope.SortColumn = (property: string): void=> {
                var options = $scope.DisplayOptions;

                options.SortAscending = !options.SortAscending;

                if (options.SortProperty !== property) {
                    options.SortAscending = true;
                }

                options.SortProperty = property;
                $scope.Sort();
            };


            $scope.Sort = (): void => {
                var options = $scope.DisplayOptions,
                    property = options.SortProperty,
                    sortPath = property.split("."),
                    length = sortPath.length,
                    sortHandler = (order: any): any => {
                        var value = order,
                            i: number;

                        for (i = 0; i < length; i += 1) {
                            value = value[sortPath[i]];
                        }


                        return value.toLowerCase ? value.toLowerCase() : value;
                    };

                $scope.Model.Items = _.sortBy($scope.Model.Items, sortHandler);

                if (!options.SortAscending) {
                    $scope.Model.Items.reverse();
                }
            };


            $scope.AddItem = (item: Api.Models.IPrepAdjustedItem): void => {
                var ids = $scope.Model.SelectedIdHash,
                    selectedItems = $scope.Model.AddSelectedItems;

                ids["" + item.Id] = !ids["" + item.Id];

                if (ids["" + item.Id] === true) {
                    selectedItems.push(item);
                } else {
                    $.each(selectedItems, function (i) {
                        if (("" + this.Id) === ("" + item.Id)) {
                            selectedItems.splice(i, 1);
                            return false;
                        }
                    });
                }
            };

            $scope.Cancel = (): void => modalInstance.dismiss();
            $scope.OK = (): void => modalInstance.close($scope.Model.AddSelectedItems);

            $scope.LoadInitialData();
        }
    }

    Core.NG.InventoryProductionModule.RegisterNamedController("PrepAdjustItemSearchController", PrepAdjustItemSearchController,
        Core.NG.$typedScope<IPrepAdjustItemSearchControllerScope>(),
        Core.NG.$modalInstance,
        Core.$translation,
        Production.Api.$prepAdjustItemSearchService,
        Core.Auth.$authService,
        Core.NG.$typedCustomResolve<any>("existingItems")
       );
} 