module Inventory.Production{
    "use strict";

    import Task = Core.Api.Models.Task;

    export class PrepAdjustController {

        private User: Core.Auth.IUser;

        constructor(
            
            $scope: IPrepAdjustControllerScope,
            private prepAdjustService: Production.Api.IPrepAdjustService,
            private $authService: Core.Auth.IAuthService,            
            private translationService: Core.ITranslationService,
            private $prepAdjustFavouriteService: Production.Api.IPrepAdjustFavoriteService,            
            popupMessageService: Core.IPopupMessageService,
            $modal: ng.ui.bootstrap.IModalService,
            $locationService: ng.ILocationService,
            constants: Core.IConstants
            ) {

            this.User = $authService.GetUser();
            $scope.vm.Items = [];

            var canViewPage = $authService.CheckPermissionAllowance(Task.Inventory_PrepAdjust_CanView);

            if (!canViewPage) {
                $locationService.path("/Core/Forbidden");
                return;
            };

            var itemHasCounts = (item: Api.Models.IPrepAdjustedItem): boolean => {
                if ((Number(item.Outers) || Number(item.Inners) || Number(item.Units))) {
                    if (item.Outers > 0 || item.Inners > 0 || item.Units > 0) {
                        return true;
                    }
                }
                return false;
            },
                checkHasPrepAdjustItems = (items: Api.Models.IPrepAdjustedItem[]) => {
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        if (itemHasCounts(item)) {
                            return true;
                        }
                    }
                    return false;
                },

            initialize = () => {

                $scope.DisplayOptions = {
                    SortProperty: "Name",
                    SortAscending: true
                };

                translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void=> {
                    var translations = $scope.Translations = result.InventoryProduction;

                    $scope.GridDefinitions = 
                         [
                            { Field: "Name", Title: translations.DescriptionCode, ColWidth: "col-xs-5" },
                            { Field: "", Title: translations.Outer, ColWidth: "col-xs-2" },
                            { Field: "", Title: translations.Inner, ColWidth: "col-xs-2" },
                            { Field: "", Title: translations.Unit, ColWidth: "col-xs-2" },
                            { Field: "", Title: "", ColWidth: "col-xs-1" }
                        ];
                                        
                    popupMessageService.SetPageTitle(translations.PageTitle);
                });

                $prepAdjustFavouriteService.Get(this.User.BusinessUser.MobileSettings.EntityId).success((result) => {
                    $.merge($scope.vm.Items, result);                                  
                });
            };


            $scope.Finish = () => {
                var prepAdjustItems = [];
                _.each($scope.vm.Items, (item: Api.Models.IPrepAdjustedItem): void => {
                    if (itemHasCounts(item)) {
                        prepAdjustItems.push(item);
                    }
                });

                $modal.open({
                    templateUrl: "/Areas/Inventory/Production/Templates/PrepAdjustConfirm.html",
                    controller: "Inventory.Production.PrepAdjustConfirmController",
                    size: 'sm',
                    resolve: {
                        items: () => { return prepAdjustItems; }
                    }
                }).result.then((result) => {
                    var applyDate = moment(result).format(constants.InternalDateTimeFormat);
                    prepAdjustService.PostPrepAdjustItems(this.$authService.GetUser().BusinessUser.MobileSettings.EntityId, prepAdjustItems, applyDate).success((): void => {
                        popupMessageService.ShowSuccess($scope.Translations.AdjustmentSubmitSuccess);
                        $scope.vm.Items = [];
                    }).error((): void => {
                            popupMessageService.ShowError($scope.Translations.AdjustmentSubmitFail);
                        });
                });
            };
            

            $scope.AddNewItems = (): void => {  
                           
                $modal.open({
                    templateUrl: "/Areas/Inventory/Production/Templates/PrepAdjustItemSearch.html",
                    controller: "Inventory.Production.PrepAdjustItemSearchController",
                    size: 'smaller',
                    resolve: {
                        existingItems: () => { return $scope.vm.Items; }
                    }
                }).result.then((result) => {  
                                    
                    $.merge($scope.vm.Items, result);
                });
            };

            $scope.RemoveItem = (item: Api.Models.IPrepAdjustedItem): void => {

                var index = $scope.vm.Items.indexOf(item);

                $scope.vm.Items.splice(index, 1);
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

            $scope.ToggleFavorite = (item) => {
                item.IsFavorite = !item.IsFavorite;
                if (item.IsFavorite) {                                   
                    $prepAdjustFavouriteService.PostAddFavorite(this.User.BusinessUser.MobileSettings.EntityId, item.Id);
                } else {
                    $prepAdjustFavouriteService.DeleteFavorite(this.User.BusinessUser.MobileSettings.EntityId, item.Id);
                }
            };

            $scope.$watch("vm.Items", () => {
                $scope.HasPrepAdjustmentItems = checkHasPrepAdjustItems($scope.vm.Items);
            }, true);

            initialize();
        }
    }

    Core.NG.InventoryProductionModule.RegisterRouteController("PrepAdjust", "Templates/PrepAdjust.html", PrepAdjustController,
        Core.NG.$typedScope<IPrepAdjustControllerScope>(),
        Production.Api.$prepAdjustService,
        Core.Auth.$authService,
        Core.$translation,
        Production.Api.$prepAdjustFavoriteService,
        Core.$popupMessageService,
        Core.NG.$modal,
        Core.NG.$location,
        Core.Constants
    );
}
 