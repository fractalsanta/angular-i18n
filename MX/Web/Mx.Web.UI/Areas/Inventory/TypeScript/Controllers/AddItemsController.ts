 module Inventory {
    "use strict";

    export interface IAddItemsControllerScope extends ng.IScope {
        SearchText: string;
        Search(searchText: string): void;
        Items: IAddItem[];
        AddSelectedItems: IAddItem[];
        AddItemRowClicked(item: IAddItem): void;
        CheckItemIsSelected(item: IAddItem): boolean;
        GetTitle(): string;

        Cancel(): void;
        AddItemsToLocation(): void;

        Translation: Count.Api.Models.IL10N;
    }

     export class AddItemsController {

         Initialize() {
             this.scope.AddSelectedItems = [];

             this.translationService.GetTranslations().then((result) => {
                 this.scope.Translation = result.InventoryCount;
             });
         }

        constructor(
            private scope: IAddItemsControllerScope,
            private modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private addItemsService: IAddItemService,
            private translationService: Core.ITranslationService,
            private addItemModel: IAddItemModel
            ) {

            this.Initialize();

            scope.Search = (searchText: string): void => {
                if (searchText.length >= 1) {
                    addItemsService.GetSearchItems(searchText, addItemModel.VendorId)
                        .then(items => {
                        if (items) {
                            items = _.sortBy(items, (item) => { return item.Name; });
                            items = _.union(scope.AddSelectedItems, items);
                            items = _.unique(items, (item) => { return item.Id; });

                            _.forEach(items, (element: IAddItem) => {
                                if (_.some(addItemModel.ExistingCodes, (code) => { return element.Code === code; })) {
                                    element.EnabledForSelection = false;
                                }
                            });
                            scope.Items = items;
                        }
                    });
                }
            };

            scope.AddItemRowClicked = (item) => {
                var isItemAlreadySelected = _.contains(scope.AddSelectedItems, item);

                if (isItemAlreadySelected) {
                    scope.AddSelectedItems = _.without(scope.AddSelectedItems, item);
                } else {
                    scope.AddSelectedItems.push(item);
                }
            };

            scope.CheckItemIsSelected = (item) => {
                return _.contains(scope.AddSelectedItems, item);
            };

            scope.GetTitle = (): string => {
                return addItemModel.Title ? addItemModel.Title : scope.Translation.TravelPathAddNewItems;
            }

            scope.Cancel = (): void => modalInstance.dismiss();

            scope.AddItemsToLocation = (): void => {
                modalInstance.close(scope.AddSelectedItems);
            };
        }
    }

     Core.NG.InventoryModule.RegisterNamedController("AddItemsControllerTravelPath", AddItemsController,
        Core.NG.$typedScope<IAddItemsControllerScope>(),
        Core.NG.$modalInstance,
        Inventory.Count.addItemsTravelPathService,
         Core.$translation,
         Core.NG.$typedCustomResolve<any>("addItemModel")
         );


     Core.NG.InventoryModule.RegisterNamedController("AddItemsControllerOrderDetails", AddItemsController,
         Core.NG.$typedScope<IAddItemsControllerScope>(),
         Core.NG.$modalInstance,
         Inventory.Order.addItemsOrderVendorService,
         Core.$translation,
         Core.NG.$typedCustomResolve<any>("addItemModel")
         );
}  