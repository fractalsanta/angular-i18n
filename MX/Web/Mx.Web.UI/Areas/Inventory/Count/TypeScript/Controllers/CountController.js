var Inventory;
(function (Inventory) {
    var Count;
    (function (Count) {
        var CountController = (function () {
            function CountController($scope, $routeParams, $state, countService, $modal, $authService, $location, popupMessageService, translationService, $confirmation, $periodCloseService, constants, userSettingService) {
                var _this = this;
                this.$scope = $scope;
                this.$routeParams = $routeParams;
                this.$state = $state;
                this.countService = countService;
                this.$modal = $modal;
                this.$authService = $authService;
                this.$location = $location;
                this.popupMessageService = popupMessageService;
                this.translationService = translationService;
                this.$confirmation = $confirmation;
                this.$periodCloseService = $periodCloseService;
                this.constants = constants;
                this.userSettingService = userSettingService;
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
                $scope.CountTypeName = Count.Api.Models.CountType[$scope.CountType];
                $scope.AreaGroups = countService.GetCurrentModel().Inventory;
                countService.SetCountDeletedCallback(function (countId, userName) {
                    _this.popupMessageService.ShowError(_this.$scope.Translation.DeleteNoticeMessage);
                    _this.popupMessageService.ClearModals();
                    $location.path("/");
                });
                countService.SetCountSubmittedCallback(function (submitterName) {
                    var message = (submitterName) ?
                        $scope.Translation.CountHasBeenSubmitted + " " + submitterName + "." :
                        $scope.Translation.CountHasBeenSubmittedOffline;
                    _this.popupMessageService.ShowError(message);
                    _this.popupMessageService.ClearModals();
                    $location.path("/");
                });
                if (inventoryCountViewAccess) {
                    countService.ResetCurrentCount();
                    countService.GetModelPromise(user.BusinessUser.MobileSettings.EntityId, $scope.CountType).then(function (result) {
                        if (!result.data.HasPlacedOrders) {
                            _this.Check2DaysCount($scope.AreaGroups);
                        }
                        else {
                            _this.RedirectToOpenOrders();
                        }
                        var defaultView = '';
                        userSettingService.GetUserSetting(Administration.User.Api.Models.UserSettingEnum.InventoryCountViewPreference)
                            .then(function (setting) {
                            defaultView = setting;
                        })
                            .finally(function () {
                            if (defaultView !== '') {
                                $state.go(defaultView);
                            }
                            countService.SetLoadingFlag(false);
                        });
                    });
                }
                var finishCount = function () {
                    $modal.open({
                        templateUrl: "/Areas/Inventory/Count/Templates/FinishCount.html",
                        controller: "Inventory.Count.FinishCount",
                        windowClass: "narrow",
                        resolve: {
                            countType: function () {
                                return $scope.CountTypeName;
                            }
                        }
                    }).result.then(function () { _this.countService.InitializeModel(); });
                };
                $scope.ApplyDateModal = function () {
                    if (countService.HasNoCostItems()) {
                        $modal.open({
                            templateUrl: "/Areas/Inventory/Count/Templates/UpdateCost.html",
                            controller: "Inventory.Count.UpdateCostInventory",
                            resolve: {
                                IsJustReturnUpdated: function () { return false; }
                            }
                        }).result.then(finishCount);
                    }
                    else {
                        finishCount();
                    }
                };
                $scope.CheckPeriodClosedStatus = function (currentDate) {
                    $periodCloseService.GetPeriodLockStatus($authService.GetUser().BusinessUser.MobileSettings.EntityId, moment(currentDate).format(constants.InternalDateFormat))
                        .success(function (result) {
                        _this._isPeriodClosed = (result.IsClosed && !$authService.CheckPermissionAllowance(Core.Api.Models.Task.InventoryCount_CanEditClosedPeriods));
                        if (_this._isPeriodClosed) {
                            _this.popupMessageService.ShowError(_this.$scope.Translation.PeriodClosed);
                        }
                        else {
                            $scope.ApplyDateModal();
                        }
                    });
                };
                $scope.FinishNow = function () {
                    if ($scope.CanSubmit()) {
                        if (countService.IsApplyDateReadOnly()) {
                            $scope.CheckPeriodClosedStatus(moment(countService.GetLocalStoreDateTime()).toDate());
                        }
                        else {
                            $scope.ApplyDateModal();
                        }
                    }
                };
                $scope.FinishLater = function () {
                    _this.popupMessageService.ShowSuccess($scope.Translation.InventoryCountSaved);
                    _this.$location.path('/');
                };
                $scope.FinishCount = finishCount;
                $scope.CanSubmit = function () {
                    return (_this.countService.HasCountedItems() && !_this.countService.IsBusy());
                };
                $scope.Review = function () {
                    _this.$location.path("/Inventory/Count/Review/" + $scope.CountTypeName + "/" + $scope.AreaGroups.Id);
                };
                $scope.DeleteCount = function (optionalConfirmTitle, optionalConfirmMessage, optionalConfirmButtonText, optionalCancelButtonText) {
                    return _this.DeleteCount(optionalConfirmTitle, optionalConfirmMessage, optionalConfirmButtonText, optionalCancelButtonText);
                };
                $scope.IsOfflineMode = function () {
                    return _this.countService.IsOfflineMode();
                };
                $scope.CheckCanViewPermission = function () {
                    return $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_InventoryCount_CanView);
                };
                $scope.CheckCanViewVariancePermission = function () {
                    return $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_InventoryCount_CanView_Variance);
                };
                $scope.CheckReviewPermission = function () {
                    return $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_InventoryCount_CanView_Review);
                };
                $scope.CheckCountCanUpdatePermission = function () {
                    return $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_InventoryCount_CanUpdate);
                };
                $scope.CheckUpdateCostPermission = function () {
                    return $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_InventoryCount_CanUpdate_Cost);
                };
                $scope.CheckCanAddItemsToCountPermission = function () {
                    return $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_InventoryCount_CanAddDisabledItem);
                };
                translationService.GetTranslations().then(function (result) {
                    $scope.Translation = result.InventoryCount;
                    $scope.TranslatedCurrentState = function () {
                        if ($state.current.name === "InventoryCount.Items")
                            return $scope.Translation.Items;
                        if ($state.current.name === "InventoryCount.Locations")
                            return $scope.Translation.Locations;
                        return $scope.Translation.Groups;
                    };
                    $scope.$watch('AreaGroups.CountName', function () { _this.UpdatePageTitle(); });
                    _this.UpdatePageTitle();
                });
                $scope.AddNewItems = function () {
                    $modal.open({
                        templateUrl: "Areas/Inventory/Count/Templates/CountAddItems.html",
                        controller: "Inventory.Count.countAddItemsController",
                        resolve: {
                            countId: function () { return $scope.AreaGroups.Id; },
                            locations: function () { return $scope.AreaGroups.Locations; }
                        }
                    }).result.then(function (result) {
                        if (result.length > 0) {
                            var entityId = $authService.GetUser().BusinessUser.MobileSettings.EntityId;
                            _this.countService.AddItemsToCurrentCount(entityId, $scope.AreaGroups.Id, result[0].LocationId, result);
                        }
                    });
                };
            }
            CountController.prototype.UpdatePageTitle = function () {
                var header = this.$scope.Translation.Count;
                if (this.$scope.AreaGroups.CountName) {
                    header = this.$scope.AreaGroups.CountName + ' ' + header;
                }
                this.popupMessageService.SetPageTitle(header);
            };
            CountController.prototype.Check2DaysCount = function (count) {
                if (count.CreateDate != null) {
                    var countDate = moment(count.CreateDate).toDate();
                    var nowMinus2Days = moment().add('days', -2).toDate();
                    if (nowMinus2Days > countDate) {
                        this.DeleteCount(null, this.$scope.Translation.CountIsOverDueMessage, this.$scope.Translation.DeleteText, this.$scope.Translation.Cancel);
                    }
                }
            };
            CountController.prototype.DeleteCount = function (optionalConfirmTitle, optionalConfirmMessage, optionalConfirmButtonText, optionalCancelButtonText) {
                var _this = this;
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
                }).then(function () {
                    _this.countService.Delete(_this.$scope.CountType, _this.$scope.AreaGroups.Id).success(function (res) {
                        _this.countService.InitializeModel();
                        _this.$location.path("/");
                        _this.popupMessageService.ShowSuccess(_this.$scope.Translation.InventoryCountDeleted);
                    }).error(function (res) {
                        _this.popupMessageService.ShowError(_this.$scope.Translation.ErrorHacOccuredPleaseContactSysAdmin);
                    });
                });
            };
            CountController.prototype.RedirectToOpenOrders = function () {
                this.$state.go(Core.UiRouterState.ReceiveOrderStates.ReceiveOrderExist);
            };
            return CountController;
        }());
        Count.myCountController = Core.NG.InventoryCountModule.RegisterNamedController("CountController", CountController, Core.NG.$typedScope(), Core.NG.$typedStateParams(), Core.NG.$state, Count.$countService, Core.NG.$modal, Core.Auth.$authService, Core.NG.$location, Core.$popupMessageService, Core.$translation, Core.$confirmationService, Workforce.PeriodClose.Api.$periodCloseService, Core.Constants, Administration.User.Services.$userSettingService);
    })(Count = Inventory.Count || (Inventory.Count = {}));
})(Inventory || (Inventory = {}));
