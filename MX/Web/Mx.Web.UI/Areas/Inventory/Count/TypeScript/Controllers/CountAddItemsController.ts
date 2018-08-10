module Inventory.Count {
    import Services = Administration.User.Services;

    export interface ICountAddItemsControllerScope extends ng.IScope {
        Search(searchText: string): void;
        Cancel(): void;
        Translation: Api.Models.IL10N;
        Items: IDisplayItem[];
        SelectedItems: Api.Models.ICountItem[];
        AddItem(item: Api.Models.ICountItem): void;
        IsSelected(item: IDisplayItem): boolean;
        ReturnItemsToCount(): void;
        Locations: Api.Models.ICountLocation[];
        LocationId: number;
        SelectLocation(location: Api.Models.ICountLocation);
        ItemTypeId: number;
        ItemTypes: { Name: string; Value: number }[];
    }

    export interface IDisplayItem extends Api.Models.ICountItem {
        DisplayItemType: string;
    }

    export class CountAddItemsController {
        
        constructor(
            private $scope: ICountAddItemsControllerScope,
            private countService: ICountService,
            private $authService: Core.Auth.IAuthService,
            private modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private translationService: Core.ITranslationService,
            private $locationService: ng.ILocationService,
            private countId: number,
            private locations: Api.Models.ICountLocation[]) {

            $scope.SelectedItems = [];
            $scope.Locations = locations;
            if (locations.length > 0) {
                $scope.LocationId = locations[0].Id;
            }
            $scope.ItemTypeId = 0;

            var user = $authService.GetUser();

            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                $scope.Translation = result.InventoryCount;

                $scope.ItemTypes = [
                    { Name: $scope.Translation.AllItems, Value: 0 },
                    { Name: $scope.Translation.InventoryItems, Value: 1 },
                    { Name: $scope.Translation.VendorEntityItem, Value: 2 }];
            });

            $scope.Search = (searchText: string): void => {
                if (searchText.length >= 1) {
                    this.countService.SearchAllEntityItemsAndVendorEntityItems(user.BusinessUser.MobileSettings.EntityId, countId, $scope.LocationId, $scope.ItemTypeId, searchText)
                        .success(items => {
                            _.forEach(items, (item: IDisplayItem): void => {
                                item.VendorItemId > 0 ? item.DisplayItemType = $scope.Translation.VendorEntityItem : item.DisplayItemType = $scope.Translation.EntityItem;
                                item.LocationId = $scope.LocationId;
                            });
                            $scope.Items = items;
                        });
                }
            }

            $scope.IsSelected = (item: IDisplayItem): boolean => {
                return _.some($scope.SelectedItems, (selected: IDisplayItem) => {
                    return item.Id === selected.Id
                        && item.VendorItemId === selected.VendorItemId
                        && item.Description === selected.Description
                        && item.ProductCode === selected.ProductCode;
                });
            };

            $scope.AddItem = (item: IDisplayItem): void => {
                if (!$scope.IsSelected(item)) {
                    $scope.SelectedItems.push(item);
                } else {
                    _.remove($scope.SelectedItems, (x) => {
                        return x.Id === item.Id
                            && x.VendorItemId === item.VendorItemId
                            && x.Description === item.Description
                            && x.ProductCode === item.ProductCode;
                    });
                }
                $scope.SelectedItems = _.sortBy($scope.SelectedItems, (value: IDisplayItem): string => { return value.Description + value.ProductCode; });
            };

            $scope.Cancel = (): void => modalInstance.dismiss();

            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                $scope.Translation = result.InventoryCount;
            });

            $scope.ReturnItemsToCount = (): void => {
                modalInstance.close($scope.SelectedItems);
            }
        }
     }

    export var myCountAddItemsController = Core.NG.InventoryCountModule.RegisterNamedController("countAddItemsController", CountAddItemsController,
        Core.NG.$typedScope<ICountAddItemsControllerScope>(),
        $countService,
        Core.Auth.$authService,
        Core.NG.$modalInstance,
        Core.$translation,
        Core.NG.$location,
        Core.NG.$typedCustomResolve<any>("countId"),
        Core.NG.$typedCustomResolve<any>("locations")
    );
 }
