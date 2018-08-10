module Inventory.Count {
    export interface ICountItemsControllerScope extends ng.IScope {
        ItemList: ICountListName[];
        Search: { ProductFull: string };
        CountType: Api.Models.CountType;
        PagingSettings: {
            MaxNumberOfPages: number;
            CurrentPage: number;
            ItemsPerPage: number;
        };
        PageItems: Api.Models.ICountItem[];

        ClearSearchResult(): void;
        CountTypeName: string;
        ChangeItems(item: ICountListName);
        SelectedItems(): Api.Models.ICountItem[];
        ChangePage(): void;
        HasMatch(): boolean;

        ClearSelected(): void;
        Uncounted(item: Api.Models.ICountItem): number;

        UpdateItem(item: Api.Models.ICountItem, type: number): void;

        ItemStatusClass(item: Api.Models.ICountItem): string;
        ItemStatusColor(item: Api.Models.ICountItem): string;
        StatusTitle(item: Api.Models.ICountItem): string;
        StatusClass(item: Api.Models.ICountItem): string;
        StatusColor(item: Api.Models.ICountItem): string;
    }

    export interface ICountListName {
        Item: Api.Models.ICountItem;
        ProductFull: string;
        Selected: boolean;
    }

    export class CountItemsController {
         private _currentItems: Api.Models.ICountItem[] = null;
         private _selectedItem: ICountListName = null;
        
         constructor(private $scope: ICountItemsControllerScope,
             $routeParams: IRouteParams,
             private countService: ICountService,
             private $authService: Core.Auth.IAuthService,
             constants: Core.IConstants) {             

             $scope.Search = { ProductFull: '' };

             $scope.$watch('PagingSettings.CurrentPage', () => $scope.ChangePage());
             $scope.$watch('Search.ProductFull', () => {
                 $scope.ClearSelected();
             });

             $scope.HasMatch = ()=>
             {
                 return this.ListContains($scope.Search.ProductFull, $scope.ItemList);
             }

             $scope.ClearSearchResult = () => {
                 $scope.Search.ProductFull = '';
             };
             $scope.ClearSelected = () => {
                 this._currentItems = null;
                 $scope.ChangePage();
                 if (this._selectedItem) {
                     this._selectedItem.Selected = false;
                 }
             };

             $scope.Uncounted = (item: Api.Models.ICountItem): number => _.where(this.countService.GetSameItems(item.ItemId, item.VendorItemId), (i: Api.Models.ICountItem) => !i.ReadyToApply && !(i.Status === Api.Models.CountStatus.Pending)).length;

             $scope.ItemList = this.GetItemList();
             countService.UpdateDefaultCountView(InventoryCountView.Items);

             $scope.PagingSettings = { MaxNumberOfPages: 5, CurrentPage: 1, ItemsPerPage: 20 };

             $scope.CountType = countService.GetCountType($routeParams.CountType);
             $scope.CountTypeName = Api.Models.CountType[$scope.CountType];

             $scope.StatusClass = this.countService.GetCssStatusClass;
             $scope.StatusColor = this.countService.GetCssStatusColor;
             $scope.StatusTitle = (item: Api.Models.ICountItem) => {
                 return countService.GetTranslatedCountStatus(item.Status);
             };

             $scope.UpdateItem = (item, type) => this.countService.PushUpdate(item, type);

             $scope.SelectedItems = () => {
                 return this._currentItems;
             };

             $scope.ItemStatusClass = description => { return this.GetCssItemStatusClass(description); };
             $scope.ItemStatusColor = description => { return this.GetCssItemStatusColor(description); };

             $scope.ChangePage = () => {
                 if (this._currentItems == null) {
                     $scope.PageItems = [];
                     return;
                 }

                 var startItemIndex = ($scope.PagingSettings.CurrentPage - 1) * $scope.PagingSettings.ItemsPerPage;
                 $scope.PageItems = $scope.SelectedItems().slice(startItemIndex, startItemIndex + $scope.PagingSettings.ItemsPerPage);
             };

             $scope.ChangeItems = (item: ICountListName) => {
                 if (this._selectedItem) {
                     this._selectedItem.Selected = false;
                 }
                 this._selectedItem = item;

                 $scope.PagingSettings.CurrentPage = 1;
                 this._currentItems = countService.GetSameItems(item.Item.ItemId, item.Item.VendorItemId);
                 item.Selected = true;
                 $scope.ChangePage();
             };

             /* ----------------------------- Check for count model reloaded and refresh current selected location -------*/
             countService.SetCountModelHasBeenReloadedCallback(() => {
                 if (this._currentItems != null) {
                     $scope.ChangeItems(this._selectedItem);
                 }
             });
             /* ---------------------------------------------------------------------------------------------------------- */

             countService.ModelReceived.SubscribeController($scope, () => {
                 $scope.ItemList = this.GetItemList();
                 $scope.ChangePage();
             });
             $scope.ChangePage();
         }

         GetItemList(): ICountListName[] {
             return _.map<Api.Models.ICountItem, ICountListName>(this.countService.GetUniqueProducts(), (item: Api.Models.ICountItem): ICountListName => {
                 return {
                     Item: item,
                     ProductFull: item.Description.toUpperCase() + ' (' + item.ProductCode.toUpperCase() + ')',
                     Selected: false
                 };
             });
         }

        ListContains(text: string, itemList: ICountListName[]) : boolean {
            var upper = text.toUpperCase();
            return text ? _.some(itemList, item => _.contains(item.ProductFull, upper)) : true;
        }

        GetItemStatus(testItem: Api.Models.ICountItem): Inventory.Count.Api.Models.CountStatus {
            var items = this.countService.GetSameItems(testItem.ItemId, testItem.VendorItemId);
            var variance = _.where(items, (item: Api.Models.ICountItem) => item.Status === Api.Models.CountStatus.Variance).length;
            if (variance > 0)
                return Api.Models.CountStatus.Variance;

            var uncounted = _.where(items, (item: Api.Models.ICountItem) => !item.ReadyToApply && !(item.Status === Api.Models.CountStatus.Pending)).length;
            if (uncounted > 0) {
                return Api.Models.CountStatus.NotCounted;
            }

            var partial = _.where(items, (item: Api.Models.ICountItem) => item.Status === Api.Models.CountStatus.Partial).length;
            if (partial > 0) {
                return Api.Models.CountStatus.Partial;
            }

            return Api.Models.CountStatus.Counted;
        }

        GetCssItemStatusClass(item: Api.Models.ICountItem) {
            var status = this.GetItemStatus(item);
             return this.countService.GetCssItemStatusClass(status);
        }

        GetCssItemStatusColor(item: Api.Models.ICountItem) {
            var status = this.GetItemStatus(item);
            return this.countService.GetCssItemStatusColor(status);
        }
     }

    export var myCountItemsController = Core.NG.InventoryCountModule.RegisterNamedController("CountItemController", CountItemsController
        ,Core.NG.$typedScope<ICountItemsControllerScope>()
        ,Core.NG.$typedStateParams<IRouteParams>()
        ,$countService
        ,Core.Auth.$authService
        ,Core.Constants
        );
 }
