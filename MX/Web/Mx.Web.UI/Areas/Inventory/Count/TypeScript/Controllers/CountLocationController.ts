module Inventory.Count {
    interface ICountLocationControllerScope extends ng.IScope {
        AreaGroups: Api.Models.IInventoryCount;
        Locations: Inventory.Count.Api.Models.ICountLocation[];
        CountType: Api.Models.CountType;
        CountTypeName: string;
        SetSearchItemText: string;
        PagingSettings: {
            MaxNumberOfPages: number;
            CurrentPage: number;
            ItemsPerPage: number;
        }
        PageItems: Api.Models.ICountItem[];

        ChangeAreaGroup(location: Api.Models.ICountLocation);
        CurrentLocation(): Api.Models.ICountLocation;
        ChangePage(): void;
        Uncounted(location: Api.Models.ICountLocation): number;

        SetSearchItem(item: Api.Models.ICountItem);
        SearchItems(searchtext: string): Api.Models.ICountItem[];
        ClearSearchResult(): void;
        ClearSearchText(): void;

        UpdateItem(item: Api.Models.ICountItem, type: number): void;

        LocationStatusClass(location: Api.Models.ICountLocation): string;
        LocationStatusColor(location: Api.Models.ICountLocation): string;
        StatusTitle(item: Api.Models.ICountItem): string;
        StatusClass(item: Api.Models.ICountItem): string;
        StatusColor(item: Api.Models.ICountItem): string;
    }

    export interface IRouteParams {
        CountType: string;
        LocationId: number;
    }

    class CountLocationController
    {
        private _haveSelectedSearch: boolean = false;
        private _currentLocation: Api.Models.ICountLocation = null;

        constructor(private $scope: ICountLocationControllerScope,
            $routeParams: IRouteParams,
            private countService: ICountService,
            private $authService: Core.Auth.IAuthService,
            constants: Core.IConstants) {
            
            $scope.$watch('PagingSettings.CurrentPage', () => $scope.ChangePage());
            $scope.$watch('SetSearchItemText', () => {
                $scope.ClearSearchResult();
            });

            $scope.Uncounted = location=> _.where(location.Items, (item: Api.Models.ICountItem) => !item.ReadyToApply && !(item.Status === Api.Models.CountStatus.Pending)).length;
                
            $scope.AreaGroups = countService.GetCurrentModel().Inventory;
            $scope.Locations = $scope.AreaGroups.Locations;
            countService.UpdateDefaultCountView(InventoryCountView.Locations);

            $scope.PagingSettings = { MaxNumberOfPages: 5, CurrentPage: 1, ItemsPerPage: 20 };

            $scope.CountType = countService.GetCountType($routeParams.CountType);
            $scope.CountTypeName = Api.Models.CountType[$scope.CountType];    

            $scope.StatusClass = (item) => { return this.countService.GetCssStatusClass(item); };
            $scope.StatusColor = (item) => { return this.countService.GetCssStatusColor(item); };
            $scope.StatusTitle = (item: Api.Models.ICountItem) => {
                return countService.GetTranslatedCountStatus(item.Status);
            };

            $scope.UpdateItem = (item, type) => this.countService.PushUpdate(item, type);

            $scope.CurrentLocation = () => {
                return this._currentLocation || (this.$scope.AreaGroups.Locations.length ? this.$scope.AreaGroups.Locations[0] : null);
            };

            $scope.LocationStatusClass = location => { return this.GetCssLocationStatusClass(location); };
            $scope.LocationStatusColor = location => { return this.GetCssLocationStatusColor(location); };

            $scope.ChangePage = () => {
                if ($scope.CurrentLocation() == null) {
                    $scope.PageItems = [];
                    return;
                }

                var startItemIndex = ($scope.PagingSettings.CurrentPage - 1) * $scope.PagingSettings.ItemsPerPage;
                $scope.PageItems = $scope.CurrentLocation().Items.slice(startItemIndex, startItemIndex + $scope.PagingSettings.ItemsPerPage);
            };

            $scope.ChangeAreaGroup = (location) => {

                if (!$scope.AreaGroups || !$scope.AreaGroups.Locations || $scope.CurrentLocation() === location) {
                    return;
                }

                $scope.PagingSettings.CurrentPage = 1;
                this._currentLocation = location;
                $scope.ChangePage();
            };

            if ($scope.Locations.length > 0) {
                $scope.ChangeAreaGroup($scope.Locations[0]);
            }

            $scope.SearchItems = (searchText: string): Api.Models.ICountItem[] => {
                if (searchText) {
                    var searchResult = _.where(countService.GetUniqueProducts(), (item: Api.Models.ICountItem) => {
                        return _.contains(item.Description.toLowerCase(), searchText.toLowerCase()) ||
                            _.contains(item.ProductCode.toLowerCase(), searchText.toLowerCase());
                    });                    
                    return _.first(searchResult, 10);
                }
                return [];
            };

            $scope.SetSearchItem = (selected: Api.Models.ICountItem): void => {
                this._haveSelectedSearch = true;
                $scope.SetSearchItemText = selected.Description + ' ('+ selected.ProductCode + ')';
                $scope.Locations = [];
                var firsttime = true;
                for (var i = 0; i < $scope.AreaGroups.Locations.length; i ++) {
                    var location = < Inventory.Count.Api.Models.ICountLocation>{
                        Name: $scope.AreaGroups.Locations[i].Name,
                        Items: _.filter($scope.AreaGroups.Locations[i].Items, (item: Inventory.Count.Api.Models.ICountItem) => {
                            var isMatch = (item.ItemId === selected.ItemId && item.VendorItemId === selected.VendorItemId);
                            return isMatch;
                        })
                    };

                    if (location.Items.length > 0) {
                        $scope.Locations.push(location);
                        if (firsttime) {
                            $scope.ChangeAreaGroup(location);
                            firsttime = false;
                        }
                    }
                }
            };

            $scope.ClearSearchText = (): void => {
                $scope.SetSearchItemText = '';
            };

            $scope.ClearSearchResult = (): void => {
                if (this._haveSelectedSearch) {
                    this._haveSelectedSearch = false;
                    return;
                }
                $scope.Locations = $scope.AreaGroups.Locations;
                if ($scope.AreaGroups.Locations.length > 0) {
                    $scope.ChangeAreaGroup($scope.AreaGroups.Locations[0]);
                }

            };


            /* ----------------------------- Check for count model reloaded and refresh current selected location -------*/
            countService.SetCountModelHasBeenReloadedCallback(() => {
                if (this._currentLocation != null) {
                    var location = _.find($scope.AreaGroups.Locations, (loc) => { return loc.Id === this._currentLocation.Id; });
                    $scope.ChangeAreaGroup(location);
                }
                $scope.Locations = $scope.AreaGroups.Locations;

            });
            /* ---------------------------------------------------------------------------------------------------------- */

            countService.ModelReceived.SubscribeController($scope, ()=> {
                $scope.ChangePage();
                $scope.ClearSearchText();
                $scope.Locations = $scope.AreaGroups.Locations;
            });
            $scope.ChangePage();
        }

        GetLocationStatus(location: Api.Models.ICountLocation): Inventory.Count.Api.Models.CountStatus {
            var variance = _.where(location.Items, (item: Api.Models.ICountItem) => item.Status === Api.Models.CountStatus.Variance).length;
            if (variance > 0)
                return Api.Models.CountStatus.Variance;

            var uncounted = _.where(location.Items, (item: Api.Models.ICountItem) => !item.ReadyToApply && !(item.Status === Api.Models.CountStatus.Pending)).length;
            if (uncounted > 0) {
                return Api.Models.CountStatus.NotCounted;
            }

            var partial = _.where(location.Items, (item: Api.Models.ICountItem) => item.Status === Api.Models.CountStatus.Partial).length;
            if (partial > 0) {
                return Api.Models.CountStatus.Partial;
            }
            
            return Api.Models.CountStatus.Counted;
        }

        GetCssLocationStatusClass(location: Api.Models.ICountLocation): string {
            var status = this.GetLocationStatus(location);
            return this.countService.GetCssItemStatusClass(status);
        }

        GetCssLocationStatusColor(location: Api.Models.ICountLocation): string {
            var status = this.GetLocationStatus(location);
            return this.countService.GetCssLocationStatusColor(status);
        }

        
    }

    export var myCountLocationController = Core.NG.InventoryCountModule.RegisterNamedController("CountLocationController", CountLocationController,
        Core.NG.$typedScope<ICountLocationControllerScope>(),
        Core.NG.$typedStateParams<IRouteParams>(),
        $countService,
        Core.Auth.$authService,
        Core.Constants
    );
} 
