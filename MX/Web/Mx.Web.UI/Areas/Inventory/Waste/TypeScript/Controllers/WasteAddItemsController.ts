module Inventory.Waste {
    "use strict";

    interface IWasteAddItemsControllerScope extends ng.IScope {
        
        Search(searchText: string): void;
        Cancel(): void;
        AddItem(item: Api.Models.IWastedItemCount): void;
        AddItemsToQueue(): void;
        SearchTextValid(): boolean;

        Translation: Api.Models.IL10N;
        GridDefinitions: { Field: string; Title: string; ColWidth: string; }[];

        DisplayOptions: {
            SortProperty: string;
            SortAscending: boolean;
        };

        SortColumn(field: string): void;
        Sort(): void;

        vm: {
            SearchText: string;
            SelectedIdHash: any;
            Items: Api.Models.IWastedItemCount[];
            AddSelectedItems: Api.Models.IWastedItemCount[];
            ExistingIdHash: any;
        };

    }

    class WasteAddItemsController {

        constructor(
            private $scope: IWasteAddItemsControllerScope,
            private $log: ng.ILogService,
            private $authService: Core.Auth.IAuthService,
            private modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private wasteService: Inventory.Waste.Api.IWasteService,
            private translationService: Core.ITranslationService,
            private existingItems: Inventory.Waste.Api.Models.IWastedItemCount[]
        ) {
            var user = $authService.GetUser();

            $scope.vm = {
                SearchText: '',
                SelectedIdHash: {},
                Items: [],
                AddSelectedItems: [],
                ExistingIdHash: 0,
            };
            $scope.vm.ExistingIdHash = function () {
                var existingIdHash = {};

                $.each(existingItems, function () {
                    existingIdHash[this.Id + this.IsRaw] = this;
                });

                return existingIdHash;
            } ();
            

            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                var tran = $scope.Translation = result.InventoryWaste;

                $scope.GridDefinitions = [
                    { Field: "", Title: "", ColWidth: "col-xs-1" },
                    { Field: "Name", Title: tran.Description, ColWidth: "col-xs-8" },
                    { Field: "IsRaw", Title: tran.Type, ColWidth: "col-xs-3" }
                ];

                $scope.$broadcast("mxTableSync-refresh");
            });

            $scope.DisplayOptions = {
                SortProperty: "Name",
                SortAscending: true
            };

            $scope.SearchTextValid = (): boolean => {
                return ($scope.vm.SearchText && $scope.vm.SearchText.length >= 1);
            };
            $scope.Search = (searchText: string): void => {
                if ($scope.SearchTextValid()) {
                    setTimeout(() => {
                        $(document.activeElement).blur();
                    }, 10);
                    
                    wasteService.GetWasteItemsLimited(user.BusinessUser.MobileSettings.EntityId, searchText)
                        .success(results => {
                            $scope.vm.Items = results;
                            $scope.Sort();
                            $scope.$broadcast("mxTableSync-refresh");
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

                $scope.vm.Items = _.sortBy($scope.vm.Items, sortHandler);

                if (!options.SortAscending) {
                    $scope.vm.Items.reverse();
                }
            };

            $scope.AddItem = (item: Api.Models.IWastedItemCount): void => {
                var ids = $scope.vm.SelectedIdHash,
                    selectedItems = $scope.vm.AddSelectedItems;

                ids["" + item.Id + item.IsRaw] = !ids["" + item.Id + item.IsRaw];

                if (ids["" + item.Id + item.IsRaw] === true) {
                    selectedItems.push(item);
                } else {
                    $.each(selectedItems, function (i) {
                        if (("" + this.Id + this.IsRaw) === ("" + item.Id + item.IsRaw)) {
                            selectedItems.splice(i, 1);
                            return false;
                        }
                    });
                }
            };

            $scope.Cancel = (): void => modalInstance.dismiss();

            $scope.AddItemsToQueue = (): void => {
                modalInstance.close($scope.vm.AddSelectedItems);
            };
        }
    }

    Core.NG.InventoryWasteModule.RegisterNamedController("WasteAddItemsController", WasteAddItemsController,
        Core.NG.$typedScope<IWasteAddItemsControllerScope>(),
        Core.NG.$log,
        Core.Auth.$authService,
        Core.NG.$modalInstance,
        Inventory.Waste.Api.$wasteService,
        Core.$translation,
        Core.NG.$typedCustomResolve<any>("existingItems")
       );
}  