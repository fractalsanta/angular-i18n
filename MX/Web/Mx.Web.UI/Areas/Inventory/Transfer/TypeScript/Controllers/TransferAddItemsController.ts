module Inventory.Transfer {
    "use strict";

    export interface ITransferAddItemsControllerScope extends ng.IScope {
        SearchText: string;
        Search(searchText: string): void;
        Items: Api.Models.ITransferableItem[];
        Cancel(): void;
        AddItem(item: Api.Models.ITransferableItem): void;
        AddItemsToQueue(): void;
        Translation: Api.Models.IL10N;
        GridDefinitions: { Field: string; Title: string; Width?: string; }[];
        AddSelectedItems: Api.Models.ITransferableItem[];
        IsPresent(item: Api.Models.ITransferableItem): boolean;
        IsSelected(item: Api.Models.ITransferableItem): boolean;
    }

    export class TransferAddItemsController {

        constructor(
            $scope: ITransferAddItemsControllerScope,
            $log: ng.ILogService,
            $authService: Core.Auth.IAuthService,
            modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            transferStoreService: Api.ITransferStoreService,
            translationService: Core.ITranslationService,
            existingItems: Inventory.Transfer.Api.Models.ITransferableItem[],
            fromStoreId: string,
            toStoreId: string,
            direction: Api.Enums.TransferDirection
            ) {

            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                $scope.Translation = result.InventoryTransfer;
            });

            $scope.IsPresent = (item: Api.Models.ITransferableItem): boolean => {
                return _.some(existingItems, (selected: Api.Models.ITransferableItem) => {
                    return item.Id == selected.Id
                        && item.Description == selected.Description
                        && item.Code == selected.Code
                        ;
                });
            };

            $scope.IsSelected = (item: Api.Models.ITransferableItem): boolean => {
                return _.some($scope.AddSelectedItems, (selected: Api.Models.ITransferableItem) => {
                    return item.Id == selected.Id
                        && item.Description == selected.Description
                        && item.Code == selected.Code
                        ;
                });
            };


            $scope.AddSelectedItems = [];

            $scope.Search = (searchText: string): void => {
                if (searchText.length >= 1) {
                    transferStoreService.GetTransferableItemsBetweenStoresLimited(+fromStoreId, +toStoreId, searchText, direction)
                        .success(items => {
                            _.forEach(items, (item: Api.Models.ITransferableItem): void => {
                                if (!item.OnHandQuantity) {
                                    item.OnHandQuantity = 0;
                                }
                            });
                            $scope.Items = _.uniq(_.union($scope.AddSelectedItems, items), false, (item) => item.Id);
                        });
                }
            };

            $scope.AddItem = (item: Api.Models.ITransferableItem): void => {
                if (! $scope.IsSelected(item)) {
                    $scope.AddSelectedItems.push(item);
                } else {
                    _.remove($scope.AddSelectedItems, (x) => {
                        return x.Id == item.Id
                            && x.Description == item.Description
                            && x.Code == item.Code;
                    });
                }
                $scope.AddSelectedItems = _.sortBy($scope.AddSelectedItems, (value: Api.Models.ITransferableItem): string => { return value.Description + value.Code; });
            };

            $scope.Cancel = (): void => modalInstance.dismiss();

            $scope.AddItemsToQueue = (): void => {
                modalInstance.close($scope.AddSelectedItems);
            };
        }
    }

    Core.NG.InventoryTransferModule.RegisterNamedController("transferAddItemsController", TransferAddItemsController,
        Core.NG.$typedScope<ITransferAddItemsControllerScope>(),
        Core.NG.$log,
        Core.Auth.$authService,
        Core.NG.$modalInstance,
        Inventory.Transfer.Api.$transferStoreService,
        Core.$translation,
        Core.NG.$typedCustomResolve<any>("existingItems"),
        Core.NG.$typedCustomResolve<string>("fromStoreId"),
        Core.NG.$typedCustomResolve<string>("toStoreId"),
        Core.NG.$typedCustomResolve<Api.Enums.TransferDirection>("direction")
        );
}  