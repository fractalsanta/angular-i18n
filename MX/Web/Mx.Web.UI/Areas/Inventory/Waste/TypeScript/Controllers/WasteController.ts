module Inventory.Waste {
    "use strict";

    interface IWastedItemUnitCountViewModel extends Inventory.Waste.Api.Models.IWastedItemUnitCount {
        Cost?: number;
    }

    interface IWastedItemCountViewModel extends Inventory.Waste.Api.Models.IWastedItemCount {
        Counts: IWastedItemUnitCountViewModel
    }

    enum FilterEnum {
        AllItems,
        RawItems,
        FinishedItems
    }
    
    interface IWasteControllerScope extends ng.IScope {
        Header: Core.Directives.IGridHeader;
        Translations: Api.Models.IL10N;
        GridDefinitions: Core.Directives.IGridHeaderDefinition[];
        CheckItemHasCounts(item: IWastedItemCountViewModel);
        WasteItems: IWastedItemCountViewModel[];
        FilteredWasteItems: IWastedItemCountViewModel[];
        Reasons: Inventory.Waste.Api.Models.IDropKeyValuePair[];
        HasWaste: boolean;
        RemoveItem(item: IWastedItemCountViewModel): void;
        Finish();
        AddNewItems(): void;
        CostPerItem(item: IWastedItemCountViewModel): number;
        TotalCost(items: IWastedItemCountViewModel[]): number;

        TranslatedCurrentFilter(): string;
        SetFilter(filterIndex: number): void;

        DisplayOptions: {
            Filter: FilterEnum;
        };

        Filter(): void;

        IsOffline: boolean;

        GetFilterEnum(): typeof FilterEnum;

        ToggleFavorite(item: IWastedItemCountViewModel);
    }
    
    class WasteController {
        private _customRange: Core.IDateRange;
        private _user: Core.Auth.IUser;
        private _wasteGridDefinitions: Core.Directives.IGridHeaderDefinition[];

        constructor(
            private $scope: IWasteControllerScope,
            private wasteService: Inventory.Waste.Api.IWasteService,
            $wasteReasonService: Inventory.Waste.Api.IWasteReasonService,
            private $wasteFavoriteService: Inventory.Waste.Api.IWasteFavoriteService,
            $authService: Core.Auth.IAuthService,
            $q: ng.IQService,
            $modal: ng.ui.bootstrap.IModalService,
            popupMessageService: Core.IPopupMessageService,
            translationService: Core.ITranslationService,
            $location: ng.ILocationService,
            constants: Core.IConstants
            ) {
            this._user = $authService.GetUser();

            var checkItemHasCounts = (item: IWastedItemCountViewModel)=> {
                    if (item.Counts && (Number(item.Counts.Outers) || Number(item.Counts.Inners) || Number(item.Counts.Units))) {
                        return true;
                    }

                    return false;
                },

                checkHasWaste = (waste: IWastedItemCountViewModel[])=> {
                    var i;

                    for (i = 0; i < waste.length; i++) {
                        var item = waste[i];
                        if (item.Counts && item.Counts.Reason && checkItemHasCounts(item)) {
                            return true;
                        }
                    }

                    return false;
                },

                initialize = ()=> {
                    $scope.DisplayOptions = {
                        Filter: FilterEnum.AllItems
                    };

                    $scope.GetFilterEnum = ()=> {
                        return FilterEnum;
                    };

                    translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void=> {
                        var tran = $scope.Translations = result.InventoryWaste;

                        $scope.Header = <Core.Directives.IGridHeader> {
                            Columns: [
                                { Title: tran.Description + " (" + tran.ItemCode + ")", Fields: ["Name", "ItemCode"] },
                                { Title: tran.Outer },
                                { Title: tran.Inner},
                                { Title: tran.Unit },
                                { Title: tran.Reason },
                                { Title: tran.Cost, Fields: ["Counts.Cost"] },
                                { Title: "" }
                            ],
                            OnSortEvent: (): void => {
                                this.Sort();
                            }
                        };

                        $scope.TranslatedCurrentFilter = () => {
                            switch($scope.DisplayOptions.Filter)
                            {
                                case FilterEnum.AllItems:
                                    return $scope.Translations.AllItems;
                                case FilterEnum.RawItems:
                                    return $scope.Translations.RawItems;
                                case FilterEnum.FinishedItems:
                                    return $scope.Translations.FinishedItems;
                            }

                            return "";
                        };

                        popupMessageService.SetPageTitle(tran.PageTitle);
                    });

                    this.LoadFavorites();

                    $wasteReasonService.Get().success((result)=> {
                        $scope.Reasons = result;
                    });
                };

            $scope.SetFilter = (filterIndex: FilterEnum) => {
                $scope.DisplayOptions.Filter = filterIndex;
                $scope.Filter();
            };

            $scope.CheckItemHasCounts = checkItemHasCounts;

            $scope.CostPerItem = (item: IWastedItemCountViewModel): number => {

                if (item.Counts && (Number(item.Counts.Outers) || Number(item.Counts.Inners) || Number(item.Counts.Units))) {
                    var cost = (Math.round(
                        item.InventoryUnitCost * 100 *
                        (Number(item.Counts.Units || '0') +
                        Number(item.Counts.Inners || '0') * item.UnitsPerInner +
                        Number(item.Counts.Outers || '0') * item.UnitsPerOuter))) / 100;

                    item.Counts.Cost = cost;

                    return cost;
                }

                if (item.Counts) {
                    item.Counts.Cost = 0.00;
                }

                return 0.00;
            };

            $scope.TotalCost = (items: IWastedItemCountViewModel[] ): number => {
                return _.reduce(items, (sum:number, item: IWastedItemCountViewModel)=> sum + item.Counts.Cost, 0.0);
            };

            $scope.$watch("WasteItems", () => {
                $scope.HasWaste = checkHasWaste($scope.WasteItems);
            }, true);
           
            $scope.ToggleFavorite = (item) => {
                item.IsFavorite = !item.IsFavorite;
                if (item.IsFavorite) {
                    $wasteFavoriteService.PostAdd(this._user.BusinessUser.MobileSettings.EntityId, item.Id, item.IsRaw);
                } else {
                    $wasteFavoriteService.Delete(this._user.BusinessUser.MobileSettings.EntityId, item.Id, item.IsRaw);
                }
            };

            $scope.AddNewItems = () => {
                $modal.open({
                    templateUrl: "/Areas/Inventory/Waste/Templates/WasteAddItems.html",
                    controller: "Inventory.Waste.WasteAddItemsController",
                    resolve: {
                        existingItems: () => { return $scope.WasteItems; }
                    }
                }).result.then((result) => {
                    $.merge($scope.WasteItems, result);
                    $scope.Header.Selected = null;
                    $scope.Filter();
                });
            };

            $scope.RemoveItem = (item: IWastedItemCountViewModel): void => {

                var index = $scope.WasteItems.indexOf(item);

                $scope.WasteItems.splice(index, 1);

                if ($scope.WasteItems.length == 0) {
                    $scope.SetFilter(FilterEnum.AllItems);
                }

                $scope.Filter();
            };

            $scope.Finish = () => {
                var waste = $scope.WasteItems,
                    queueItems = [],
                    totalCost,
                    i, j;
                
                for (i = 0; i < waste.length; i++) {
                    var item = waste[i];
                    if (item.Counts && item.Counts.Reason && checkItemHasCounts(item)) {
                        for (j = 0; j < $scope.Reasons.length; j++) {
                            if ($scope.Reasons[j].Id === item.Counts.Reason.Id) {
                                item.Counts.Reason.Description = $scope.Reasons[j].Text;
                            }
                        }
                        queueItems.push(item);
                    }
                }

                totalCost = $scope.TotalCost(queueItems);

                $modal.open({
                    templateUrl: "/Areas/Inventory/Waste/Templates/WasteConfirm.html",
                    controller: "Inventory.Waste.WasteConfirmController",
                    size: 'sm',
                    resolve: {
                        items: () => { return queueItems; },
                        totalCost: () => { return totalCost; },
                    }
                }).result.then((result) => {
                    var applyDate = moment(result).format(constants.InternalDateTimeFormat);
                    wasteService.PostWasteItems(this._user.BusinessUser.MobileSettings.EntityId, queueItems, applyDate).success((): void => {
                        popupMessageService.ShowSuccess($scope.Translations.AdjustmentSubmitSuccess);
                        this.LoadFavorites();
                    }).error((): void => {
                        popupMessageService.ShowError($scope.Translations.AdjustmentSubmitFail);
                    });;
                });
            };

            $scope.Filter = ()=> {
                $scope.FilteredWasteItems = _.filter($scope.WasteItems, (item: IWastedItemCountViewModel)=> {
                    return $scope.DisplayOptions.Filter == FilterEnum.AllItems ||
                    ($scope.DisplayOptions.Filter == FilterEnum.RawItems && item.IsRaw) ||
                    ($scope.DisplayOptions.Filter == FilterEnum.FinishedItems && !item.IsRaw);
                });
            };

            initialize();
        }

        private LoadFavorites(): void {
            this.$scope.WasteItems = [];
            this.$scope.FilteredWasteItems = [];

            this.$wasteFavoriteService.Get(this._user.BusinessUser.MobileSettings.EntityId).success((result) => {
                $.merge(this.$scope.WasteItems, result);
                this.Sort();
            });
        }

        private Sort(): void {
            this.$scope.WasteItems = this.$scope.Header.DefaultSort(this.$scope.WasteItems);
            this.$scope.Filter();
        }
    }

    Core.NG.InventoryWasteModule.RegisterRouteController("Record", "Templates/Waste.html", WasteController,
        Core.NG.$typedScope<IWasteControllerScope>(),
        Inventory.Waste.Api.$wasteService,
        Inventory.Waste.Api.$wasteReasonService,
        Inventory.Waste.Api.$wasteFavoriteService,
        Core.Auth.$authService,
        Core.NG.$q,
        Core.NG.$modal,
        Core.$popupMessageService,
        Core.$translation,
        Core.NG.$location,
        Core.Constants
    );
}
