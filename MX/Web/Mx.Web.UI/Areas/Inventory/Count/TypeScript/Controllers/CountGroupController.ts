module Inventory.Count {

    export interface ICountGroupControllerScope extends ng.IScope {
        SearchItemText: string;
        AreaGroups: Api.Models.IInventoryCount;  
        Groups: ICountItemGroup[];              
        GroupItemList: ICountItemGroup[];
        PageSettings: {
            MaxNumberOfPages: number;
            CurrentPage: number;
            ItemsPerPage: number;
        }
        CountType: Api.Models.CountType;
        CountTypeName: string;
        PageItems: Api.Models.ICountItem[];

        ClearSearchText(): void;
        ClearSearchResult(): void;
        ChangeGroup(item: ICountItemGroup): void;
        CurrentGroup(): ICountItemGroup;
        SearchItems(text: string): Api.Models.ICountItem[];
        SelectSearchItem(selectedItem: Api.Models.ICountItem): void;
        GetUncounted(group: ICountItemGroup): number;
        GroupStatusClass(group: ICountItemGroup): string;
        GroupStatusColour(group: ICountItemGroup): string;
        ChangePage(): void;
        UpdateItem(item: Api.Models.ICountItem, type: number): void;
        StatusClass(item: Api.Models.ICountItem): string;
        StatusTitle(item: Api.Models.ICountItem): string;
        StatusColor(item: Api.Models.ICountItem): string;
    }        

    export class CountGroupController {        

        private _currentGroup: ICountItemGroup = null;
        private _haveSelectedSearch: boolean = false;

        constructor(private $scope: ICountGroupControllerScope,
            $routeParams: IRouteParams,
            private countService: ICountService,
            private $authService: Core.Auth.IAuthService,
            constants: Core.IConstants) {
            
            $scope.SearchItemText = '';
            $scope.$watch('PageSettings.CurrentPage', () => $scope.ChangePage())
            $scope.$watch('SearchItemText', () => { $scope.ClearSearchResult(); });
            $scope.PageSettings = { MaxNumberOfPages: 5, CurrentPage: 1, ItemsPerPage: 20 };
            $scope.CountType = countService.GetCountType($routeParams.CountType);
            $scope.CountTypeName = Api.Models.CountType[$scope.CountType];

            $scope.ClearSearchText = () => {
                $scope.SearchItemText = '';
            };
            $scope.ClearSearchResult = () => {
                if (this._haveSelectedSearch) {
                    this._haveSelectedSearch = false;
                    return;
                }

                $scope.Groups = _.clone($scope.GroupItemList);

                if ($scope.GroupItemList.length > 0) {
                    $scope.ChangeGroup($scope.GroupItemList[0]);
                }
            }
                        
            $scope.AreaGroups = countService.GetCurrentModel().Inventory;
            $scope.GroupItemList = this.GetGroupsList();
            $scope.Groups = _.clone($scope.GroupItemList);
            countService.UpdateDefaultCountView(InventoryCountView.Groups);

            $scope.ChangeGroup = (item: ICountItemGroup) => {
                if (!$scope.GroupItemList || $scope.GroupItemList.length === 0 || $scope.CurrentGroup() === item) {
                    return;
                }
                
                $scope.PageSettings.CurrentPage = 1;
                this._currentGroup = item;
                $scope.ChangePage();
            };

            $scope.CurrentGroup = () => {
                return this._currentGroup || ($scope.GroupItemList.length ? $scope.GroupItemList[0] : null);
            };

            $scope.SearchItems = (text: string) => {
                if (text) {
                    var result = _.where(countService.GetUniqueProducts(),
                        (item: Api.Models.ICountItem) => {
                            return _.contains(item.Description.toLowerCase(), text.toLowerCase()) ||
                                _.contains(item.ProductCode.toLowerCase(), text.toLowerCase());
                        });

                    return _.first(result, 10);
                }

                return [];
            };

            $scope.SelectSearchItem = (selectedItem: Api.Models.ICountItem) => {
                this._haveSelectedSearch = true;
                $scope.SearchItemText = selectedItem.Description + ' (' + selectedItem.ProductCode + ')';
                $scope.Groups = [];

                var firstTime = true;

                for (var i = 0; i < $scope.GroupItemList.length; i++) {
                    var group = <ICountItemGroup>{
                        GroupName: $scope.GroupItemList[i].GroupName,
                        CountItems: _.filter($scope.GroupItemList[i].CountItems, (item: Api.Models.ICountItem) => {
                            return (item.ItemId == selectedItem.ItemId && item.VendorItemId === selectedItem.VendorItemId);
                        })
                    };

                    if (group.CountItems.length > 0) {
                        $scope.Groups.push(group);

                        if (firstTime) {
                            $scope.ChangeGroup(group);
                            firstTime = false;
                        }
                    }
                }
            };

            $scope.GetUncounted = group => _.where(group.CountItems,
                    (item: Api.Models.ICountItem) => !item
                    .ReadyToApply &&
                    !(item.Status === Api.Models.CountStatus.Pending))
                .length;

            $scope.GroupStatusClass = group => {
                return this.countService.GetCssItemStatusClass(this.GetGroupStatus(group));
            };

            $scope.GroupStatusColour = group => {
                return this.countService.GetCssItemStatusColor(this.GetGroupStatus(group));
            };

            $scope.ChangePage = () => {
                if ($scope.CurrentGroup() == null) {
                    $scope.PageItems = [];
                }

                var startIndex = ($scope.PageSettings.CurrentPage - 1) * $scope.PageSettings.ItemsPerPage;
                                
                $scope.PageItems = $scope.CurrentGroup().CountItems.slice(startIndex, startIndex + $scope.PageSettings.ItemsPerPage);
            };


            $scope.UpdateItem = (item, type) => this.countService.PushUpdate(item, type);

            $scope.StatusClass = (item) => { return this.countService.GetCssStatusClass(item); };

            $scope.StatusTitle = (item) => { return this.countService.GetTranslatedCountStatus(item.Status); }

            $scope.StatusColor = (item) => { return this.countService.GetCssStatusColor(item);  }
        }

        GetGroupsList(): ICountItemGroup[] {
            return this.countService.GetItemGroups();
        }      

        GetGroupStatus(group: ICountItemGroup): Api.Models.CountStatus {

            if (_.where(group.CountItems, (item: Api.Models.ICountItem) => item.Status === Api.Models.CountStatus.Variance).length > 0) {
                return Api.Models.CountStatus.Variance;
            }

            if (_.where(group.CountItems, (item: Api.Models.ICountItem) => !item.ReadyToApply && item.Status === Api.Models.CountStatus.Pending).length > 0) {
                return Api.Models.CountStatus.NotCounted;
            }


            if (_.where(group.CountItems, (item: Api.Models.ICountItem) => item.Status === Api.Models.CountStatus.Partial).length > 0) {
                return Api.Models.CountStatus.Partial;
            }

            return Api.Models.CountStatus.Counted;
        }
    }

    export var myCountGroupController = Core.NG.InventoryCountModule.RegisterNamedController("CountGroupController", CountGroupController
        , Core.NG.$typedScope<ICountGroupControllerScope>()
        , Core.NG.$typedStateParams<IRouteParams>()
        , $countService
        , Core.Auth.$authService
        , Core.Constants
        );

} 