module Inventory.Count {

    interface ICountControllerScope extends ng.IScope {
        AreaGroups: Api.Models.IInventoryCount;
        CountType: Api.Models.CountType;
        CountTypeName: string;
        TranslatedCurrentState(): string;

        DeleteCount(optionalConfirmTitle: string,
            optionalConfirmMessage: string,
            optionalConfirmButtonText: string,
            optionalCancelButtonText: string): void;
        FinishNow();
        FinishLater();
        FinishCount();
        Review();

        Check2DaysCount(count: Count.Api.Models.IInventoryCount): void;
        IsOfflineMode(): boolean;

        Translation: Api.Models.IL10N;

        CanSubmit(): boolean;
        CheckCanViewPermission();
        CheckCanAddItemsToCountPermission();
        //TODO: Confirm functionality
        CheckCanViewVariancePermission();

        CheckReviewPermission();
        CheckUpdateCostPermission();
        CheckCountCanUpdatePermission();
        CheckPeriodClosedStatus(currentDate: Date): void;
        ApplyDateModal(): void;
        AddNewItems(): void;
    }

    class CountController {

        public _isPeriodClosed: boolean;

        constructor(
            private $scope: ICountControllerScope,
            private $routeParams: IRouteParams,
            private $state: ng.ui.IStateService,
            private countService: ICountService,
            private $modal: ng.ui.bootstrap.IModalService,
            private $authService: Core.Auth.IAuthService,
            private $location: ng.ILocationService,
            private popupMessageService: Core.IPopupMessageService,
            private translationService: Core.ITranslationService,
            private $confirmation: Core.IConfirmationService,
            private $periodCloseService: Workforce.PeriodClose.Api.IPeriodCloseService,
            private constants: Core.IConstants,
            private userSettingService: Administration.User.Services.IUserSettingsService          
            ) {

            countService.SetLoadingFlag(true);

            var user = $authService.GetUser();
            var inventoryCountViewAccess = false;

            if (user != null && user.BusinessUser != null && user.BusinessUser.Permission.AllowedTasks) {
                inventoryCountViewAccess = user.BusinessUser.Permission.AllowedTasks.indexOf(Core.Api.Models.Task.Inventory_InventoryCount_CanView) >= 0;
            }

            if (!inventoryCountViewAccess) {
                $location.path("/Core/Forbidden");
            }

            $scope.CountType = countService.GetCountType($routeParams.CountType);
            $scope.CountTypeName = Api.Models.CountType[$scope.CountType];

            $scope.AreaGroups = countService.GetCurrentModel().Inventory;


            /* ---------------------------------------------------------------------------------------------------------- */
            /* ---------------------------  Count Deleted SignalR  ------------------------------------------------------ */
            countService.SetCountDeletedCallback((countId: number, userName: string) => {
                this.popupMessageService.ShowError(this.$scope.Translation.DeleteNoticeMessage);
                this.popupMessageService.ClearModals();
                $location.path("/");
            });
            /* ---------------------------  Count Deleted SignalR  ------------------------------------------------------ */
            /* ---------------------------------------------------------------------------------------------------------- */

            countService.SetCountSubmittedCallback((submitterName: string): void => {
                var message = (submitterName) ?
                    $scope.Translation.CountHasBeenSubmitted + " " + submitterName + "." :
                    $scope.Translation.CountHasBeenSubmittedOffline;

                this.popupMessageService.ShowError(message);
                this.popupMessageService.ClearModals();
                $location.path("/");
            });

            /* ------------------------If user has count view rights - get model then check 2 Days old condition ----------*/
            if (inventoryCountViewAccess) {
                countService.ResetCurrentCount();
                countService.GetModelPromise(user.BusinessUser.MobileSettings.EntityId, $scope.CountType).then((result) => {
                    if (!result.data.HasPlacedOrders) {
                        this.Check2DaysCount($scope.AreaGroups);
                    } else {
                        this.RedirectToOpenOrders();
                    }

                    var defaultView = '';
                    
                    userSettingService.GetUserSetting(Administration.User.Api.Models.UserSettingEnum.InventoryCountViewPreference)
                        .then(setting => {
                            defaultView = setting;                            
                        })                        
                        .finally(() => {
                            if (defaultView !== '') {                                
                                $state.go(defaultView);                                
                            }                            
                            countService.SetLoadingFlag(false);
                });
                });
            }
            /* ---------------------------------------------------------------------------------------------------------- */

            var finishCount = () => {

                $modal.open({
                    templateUrl: "/Areas/Inventory/Count/Templates/FinishCount.html",
                    controller: "Inventory.Count.FinishCount",
                    windowClass: "narrow",
                    resolve: {
                        countType: (): string => {
                            return $scope.CountTypeName;
                        }
                    }
                }).result.then(() => { this.countService.InitializeModel(); });
            };

            $scope.ApplyDateModal = (): void => {
                if (countService.HasNoCostItems()) {
                    $modal.open({
                        templateUrl: "/Areas/Inventory/Count/Templates/UpdateCost.html",
                        controller: "Inventory.Count.UpdateCostInventory",
                        resolve: {
                            IsJustReturnUpdated: (): boolean => { return false; }
                        }
                    }).result.then(finishCount);
                }
                else {
                    finishCount();
                }
            };

            $scope.CheckPeriodClosedStatus = (currentDate: Date): void => {

                $periodCloseService.GetPeriodLockStatus($authService.GetUser().BusinessUser.MobileSettings.EntityId, moment(currentDate).format(constants.InternalDateFormat))
                    .success((result) => {

                        this._isPeriodClosed = (result.IsClosed && !$authService.CheckPermissionAllowance(Core.Api.Models.Task.InventoryCount_CanEditClosedPeriods));
                        if (this._isPeriodClosed) {
                            this.popupMessageService.ShowError(this.$scope.Translation.PeriodClosed);
                        }
                        else {
                            $scope.ApplyDateModal();
                        }                     

                    });
            };

            $scope.FinishNow = () => {

                if ($scope.CanSubmit()) {

                    if (countService.IsApplyDateReadOnly()) {

                        $scope.CheckPeriodClosedStatus(moment(countService.GetLocalStoreDateTime()).toDate());
                    }
                    else {

                        $scope.ApplyDateModal();
                    }

                }
            };

            $scope.FinishLater = () => {
                this.popupMessageService.ShowSuccess($scope.Translation.InventoryCountSaved);
                this.$location.path('/');
            };

            $scope.FinishCount = finishCount;

            $scope.CanSubmit = () => {
                return (this.countService.HasCountedItems() && !this.countService.IsBusy());
            };

            $scope.Review = () => {
                this.$location.path("/Inventory/Count/Review/" + $scope.CountTypeName + "/" + $scope.AreaGroups.Id);
            };

            $scope.DeleteCount = (optionalConfirmTitle, optionalConfirmMessage, optionalConfirmButtonText, optionalCancelButtonText) =>
                this.DeleteCount(optionalConfirmTitle, optionalConfirmMessage, optionalConfirmButtonText, optionalCancelButtonText);

            $scope.IsOfflineMode = () => {
                return this.countService.IsOfflineMode();
            };

            $scope.CheckCanViewPermission = () => {
                return $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_InventoryCount_CanView);
            };

            $scope.CheckCanViewVariancePermission = () => {
                return $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_InventoryCount_CanView_Variance);
            };

            $scope.CheckReviewPermission = () => {
                return $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_InventoryCount_CanView_Review);
            };

            $scope.CheckCountCanUpdatePermission = () => {
                return $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_InventoryCount_CanUpdate);
            };

            $scope.CheckUpdateCostPermission = () => {
                return $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_InventoryCount_CanUpdate_Cost);
            };         

            $scope.CheckCanAddItemsToCountPermission = () => {
                return $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_InventoryCount_CanAddDisabledItem);
            };   

            translationService.GetTranslations().then((result) => {
                $scope.Translation = result.InventoryCount;

                $scope.TranslatedCurrentState = () => {
                    if ($state.current.name === "InventoryCount.Items")
                        return $scope.Translation.Items;

                    if ($state.current.name === "InventoryCount.Locations")
                        return $scope.Translation.Locations;

                    return $scope.Translation.Groups;
                };

                $scope.$watch('AreaGroups.CountName', () => { this.UpdatePageTitle(); });
                this.UpdatePageTitle();
            });

            $scope.AddNewItems = (): void => {
                $modal.open({
                    templateUrl: "Areas/Inventory/Count/Templates/CountAddItems.html",
                    controller: "Inventory.Count.countAddItemsController",
                    resolve: {
                        countId: () => { return $scope.AreaGroups.Id; },
                        locations: () => { return $scope.AreaGroups.Locations }
                    }
                }).result.then((result: Api.Models.ICountItem[]): void => {

                    if (result.length > 0) {

                        var entityId = $authService.GetUser().BusinessUser.MobileSettings.EntityId;

                        this.countService.AddItemsToCurrentCount(entityId, $scope.AreaGroups.Id, result[0].LocationId, result);
                    }
                });
            };
        }

        UpdatePageTitle() {
            var header = this.$scope.Translation.Count;
            if (this.$scope.AreaGroups.CountName) {
                header = this.$scope.AreaGroups.CountName + ' ' + header; }
            this.popupMessageService.SetPageTitle(header);
        }

        Check2DaysCount(count: Count.Api.Models.IInventoryCount) {
            if (count.CreateDate != null) {
                var countDate = moment(count.CreateDate).toDate();
                var nowMinus2Days = moment().add('days', -2).toDate();
                if (nowMinus2Days > countDate) {
                    this.DeleteCount(null, this.$scope.Translation.CountIsOverDueMessage, this.$scope.Translation.DeleteText, this.$scope.Translation.Cancel);
                }
            }
        }

        DeleteCount(
            optionalConfirmTitle: string,
            optionalConfirmMessage: string,
            optionalConfirmButtonText: string,
            optionalCancelButtonText: string
            ) {
            var windowTitle = this.$scope.Translation.DeleteCount;
            var windowMessage = this.$scope.Translation.DeleteCurrentCountQuestion;
            var confirmButtonText = this.$scope.Translation.DeleteText;
            var cancelButtonText = this.$scope.Translation.Cancel;

            if (optionalConfirmTitle != null) {
                windowTitle = optionalConfirmTitle;
            }
            if (optionalConfirmMessage != null) {
                windowMessage = optionalConfirmMessage;
            }
            if (optionalConfirmButtonText != null) {
                confirmButtonText = optionalConfirmButtonText;
            }
            if (optionalCancelButtonText != null) {
                cancelButtonText = optionalCancelButtonText;
            }

            this.$confirmation.Confirm({
                Title: windowTitle,
                Message: windowMessage,
                ConfirmationType: Core.ConfirmationTypeEnum.Danger,
                ConfirmText: confirmButtonText,
                CancelText: cancelButtonText
            }).then((): void => {
                    this.countService.Delete(this.$scope.CountType, this.$scope.AreaGroups.Id).success((res) => {
                        this.countService.InitializeModel();
                        this.$location.path("/");
                        this.popupMessageService.ShowSuccess(this.$scope.Translation.InventoryCountDeleted);
                    }).error((res) => {
                            this.popupMessageService.ShowError(this.$scope.Translation.ErrorHacOccuredPleaseContactSysAdmin);
                        });
                });

        }

        RedirectToOpenOrders(): void {
            this.$state.go(Core.UiRouterState.ReceiveOrderStates.ReceiveOrderExist);
        }       
    }

    export var myCountController = Core.NG.InventoryCountModule.RegisterNamedController("CountController", CountController,
        Core.NG.$typedScope<ICountControllerScope>(),
        Core.NG.$typedStateParams<IRouteParams>(),
        Core.NG.$state,
        $countService,
        Core.NG.$modal,
        Core.Auth.$authService,
        Core.NG.$location,
        Core.$popupMessageService,
        Core.$translation,
        Core.$confirmationService,
        Workforce.PeriodClose.Api.$periodCloseService,
        Core.Constants,
        Administration.User.Services.$userSettingService
        );
}
