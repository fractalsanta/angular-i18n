module Inventory.Count {
    "use strict";

    export interface ICountReviewGroupViewModel extends Api.Models.ICountReviewGroupViewModel {
        HasItems: boolean;
    }

    export interface IReviewConfigOptions {
        ShowCostPercent: boolean;
    }

    interface IReviewControllerScope extends ng.IScope {

        CountType: Inventory.Count.Api.Models.CountType;
        CountTypeName: string;
        LocationId: number;
        ReviewData: Count.Api.Models.ICountReviewViewModel;
        ReviewDataItems: Inventory.Count.Api.Models.ICountReviewItemViewModel[];
        ReviewDataGroupClick(group: Api.Models.ICountReviewGroupViewModel): void;
        SelectedGroup: Api.Models.ICountReviewGroupViewModel;

        FinishNow(): void;
        FinishLater(): void;
        GetTotal(): string;
        OpenColumnConfig(): void;
        GetValue(group: Api.Models.ICountReviewGroupViewModel): string;
        Translation: Api.Models.IL10N;

        CanViewVariance: boolean;
        CanViewCountVariance: boolean;
        ConfigOptions: IReviewConfigOptions;
    }

    class ReviewController {
        private _storageKey = "mxReviewConfig";
        private _defaultConfig: IReviewConfigOptions = {
            ShowCostPercent: true
        };

        constructor(
            private $scope: IReviewControllerScope,
            private $routeParams: IRouteParams,
            private reviewService: Inventory.Count.Api.IReviewService,
            private $authService: Core.Auth.IAuthService,
            private translationService: Core.ITranslationService,
            private countService: ICountService,
            private $modal: ng.ui.bootstrap.IModalService,
            private popupMessageService: Core.IPopupMessageService,
            private $anchorScroll: ng.IAnchorScrollService,
            private $location: ng.ILocationService,
            private $filter: ng.IFilterService,
            private $storage: ng.external.localstorage.ILocalStorage
            ) {

            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                $scope.Translation = result.InventoryCount;
                this.SetPageTitle();
            });

            $scope.CanViewVariance = $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_InventoryCount_CanView_Variance);
            $scope.CanViewCountVariance = $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_InventoryCount_CanView_Count_Variance);

            $scope.SelectedGroup = null;
            $scope.ConfigOptions = this.LoadConfig();

            if (!$scope.CanViewVariance) {
                $scope.ConfigOptions.ShowCostPercent = false;
            }

            $scope.CountType = countService.GetCountType($routeParams.CountType);
            $scope.CountTypeName = Api.Models.CountType[$scope.CountType];

            $scope.LocationId = <number>$routeParams.LocationId;
            var user = $authService.GetUser();

            reviewService.GetReview($scope.LocationId, $scope.CountType, user.BusinessUser.MobileSettings.EntityId)
                .success((result: Api.Models.ICountReviewViewModel): void => {
                    $scope.ReviewData = result;

                    _.forEach($scope.ReviewData.Groups, (tempGroup: ICountReviewGroupViewModel): void => {
                        tempGroup.HasItems = tempGroup.Items && tempGroup.Items.length > 0;
                    });

                    $scope.ReviewDataItems = <any>_.flatten($scope.ReviewData.Groups, "Items");

                    if ($scope.ReviewData.ActivitySinceDate && moment($scope.ReviewData.ActivitySinceDate).isValid()) {
                        var browserTimeOffset = moment().zone() / 60,
                            entityBrowserTimeOffset = $scope.ReviewData.EntityTimeOffset - browserTimeOffset;

                        $scope.ReviewData.ActivitySinceDate = moment($scope.ReviewData.ActivitySinceDate).add("h", entityBrowserTimeOffset).format("L LT");
                    }
                });

            $scope.ReviewDataGroupClick = (group: Api.Models.ICountReviewGroupViewModel): void => {
                $scope.SelectedGroup = group;
                $scope.ReviewDataItems = [];

                if (group != null) {
                    $scope.ReviewDataItems = <any>_.flatten(_.where($scope.ReviewData.Groups, el => { return group === el; }), "Items");
                } else {
                    $scope.ReviewDataItems = <any>_.flatten($scope.ReviewData.Groups, "Items");
                }

                if (group != null) {
                    if (group.Items == null || group.Items.length === 0) {
                        if ($scope.ReviewData != null && $scope.ReviewData.Groups != null) {

                            var groupHasBeenFound = false;
                            _.forEach($scope.ReviewData.Groups, grItem => {

                                if (groupHasBeenFound && grItem.Items.length > 0) {
                                    $scope.ReviewDataItems = $scope.ReviewDataItems.concat(grItem.Items);
                                } else {
                                    groupHasBeenFound = false;
                                }

                                if (grItem === group) {
                                    groupHasBeenFound = true;
                                }
                            });
                        }
                    }
                }

                this.$anchorScroll();
            };

            var finishCount = (): void => {
                $modal.open({
                    templateUrl: "/Areas/Inventory/Count/Templates/FinishCount.html",
                    controller: "Inventory.Count.FinishCount",
                    windowClass: "narrow",
                    resolve: {
                        countType: (): string => {
                            return $scope.CountTypeName;
                        }
                    }
                });
            };

            $scope.FinishNow = (): void => {
                if (countService.HasNoCostItems()) {
                    $modal.open({
                        templateUrl: "/Areas/Inventory/Count/Templates/UpdateCost.html",
                        controller: "Inventory.Count.UpdateCostInventory"
                    }).result.then(finishCount);
                } else {
                    finishCount();
                }
            };

            $scope.FinishLater = (): void => {
                this.popupMessageService.ShowSuccess($scope.Translation.InventoryCountSaved);
                this.$location.path("/");
            };

            $scope.GetTotal = (): string => {
                var total: string;

                if (!$scope.ConfigOptions.ShowCostPercent) {
                    total = this.FormatToCurrency($scope.ReviewData.TotalCounted);
                } else {
                    total = this.FormatToPercent($scope.ReviewData.TotalPercent);
                }

                return total;
            };

            $scope.GetValue = (group: Api.Models.ICountReviewGroupViewModel): string => {
                var total: string;

                if (!$scope.ConfigOptions.ShowCostPercent) {
                    total = this.FormatToCurrency(group.GroupValue);
                } else {
                    total = this.FormatToPercent(group.GroupPercentValue);
                }

                return total;
            };

            $scope.OpenColumnConfig = (): void => {
                var modal = $modal.open(<ng.ui.bootstrap.IModalSettings>{
                    templateUrl: "/Areas/Inventory/Count/Templates/ConfigureColumns.html",
                    controller: "Inventory.Count.ConfigureColumnsController",
                    resolve: {
                        isPercent: (): boolean => { return $scope.ConfigOptions.ShowCostPercent; }
                    }
                });

                modal.result.then((result: boolean): void => {
                    $scope.ConfigOptions.ShowCostPercent = result;
                    this.PersistConfig($scope.ConfigOptions);
                });
            };
        }

        private FormatToCurrency(val: number): string {
            var formattedVal = this.$filter("currency")(val).toString();

            return formattedVal;
        }

        private FormatToPercent(val: number): string {
            var formattedVal = this.$filter("number")(val, 2).toString() + " %";

            return formattedVal;
        }

        private SetPageTitle(): void {
            var type = this.countService.GetTranslatedCountType(this.$scope.CountType, this.$scope.Translation),
                header = this.$scope.Translation.Review + type + " " + this.$scope.Translation.Count;

            this.popupMessageService.SetPageTitle(header);
        }

        private PersistConfig(config: IReviewConfigOptions): void {
            this.$storage.set(this._storageKey, config);
        }

        private LoadConfig(): IReviewConfigOptions {
            var config: IReviewConfigOptions = this.$storage.get(this._storageKey) || {};

            config = angular.extend({}, this._defaultConfig, config);

            return config;
        }
    }

    Core.NG.InventoryCountModule.RegisterRouteController("Review/:CountType/:LocationId", "Templates/Review.html", ReviewController,
        Core.NG.$typedScope<IReviewControllerScope>(),
        Core.NG.$typedStateParams<IRouteParams>(),
        Inventory.Count.Api.$reviewService,
        Core.Auth.$authService,
        Core.$translation,
        $countService,
        Core.NG.$modal,
        Core.$popupMessageService,
        Core.NG.$anchorScroll,
        Core.NG.$location,
        Core.NG.$filter,
        Core.NG.$mxlocalStorage
        );
} 