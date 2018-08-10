var Forecasting;
(function (Forecasting) {
    "use strict";
    var MirroringStoreStates = (function () {
        function MirroringStoreStates() {
        }
        MirroringStoreStates.Stores = "Stores";
        MirroringStoreStates.StoreDetails = "StoreDetails";
        MirroringStoreStates.StoreAdd = "StoreAdd";
        return MirroringStoreStates;
    }());
    Forecasting.MirroringStoreStates = MirroringStoreStates;
    (function (StoreMirrorStatusGroup) {
        StoreMirrorStatusGroup[StoreMirrorStatusGroup["None"] = 0] = "None";
        StoreMirrorStatusGroup[StoreMirrorStatusGroup["Active"] = 1] = "Active";
        StoreMirrorStatusGroup[StoreMirrorStatusGroup["Cancelled"] = 2] = "Cancelled";
        StoreMirrorStatusGroup[StoreMirrorStatusGroup["Completed"] = 3] = "Completed";
        StoreMirrorStatusGroup[StoreMirrorStatusGroup["Everything"] = 4] = "Everything";
    })(Forecasting.StoreMirrorStatusGroup || (Forecasting.StoreMirrorStatusGroup = {}));
    var StoreMirrorStatusGroup = Forecasting.StoreMirrorStatusGroup;
    (function (StoreMirrorStatus) {
        StoreMirrorStatus[StoreMirrorStatus["None"] = 0] = "None";
        StoreMirrorStatus[StoreMirrorStatus["Completed"] = 1] = "Completed";
        StoreMirrorStatus[StoreMirrorStatus["InProgress"] = 2] = "InProgress";
        StoreMirrorStatus[StoreMirrorStatus["Scheduled"] = 3] = "Scheduled";
        StoreMirrorStatus[StoreMirrorStatus["Cancelled"] = 4] = "Cancelled";
        StoreMirrorStatus[StoreMirrorStatus["PendingCancellation"] = 5] = "PendingCancellation";
        StoreMirrorStatus[StoreMirrorStatus["PartiallyCompleted"] = 6] = "PartiallyCompleted";
    })(Forecasting.StoreMirrorStatus || (Forecasting.StoreMirrorStatus = {}));
    var StoreMirrorStatus = Forecasting.StoreMirrorStatus;
    (function (StoreMirrorType) {
        StoreMirrorType[StoreMirrorType["None"] = 0] = "None";
        StoreMirrorType[StoreMirrorType["Corporate"] = 1] = "Corporate";
        StoreMirrorType[StoreMirrorType["NonCorporate"] = 2] = "NonCorporate";
        StoreMirrorType[StoreMirrorType["All"] = 3] = "All";
    })(Forecasting.StoreMirrorType || (Forecasting.StoreMirrorType = {}));
    var StoreMirrorType = Forecasting.StoreMirrorType;
    var MirroringStoreController = (function () {
        function MirroringStoreController($scope, $state, $authService, translationService, popupMessageService, $modal, mirroringService) {
            var _this = this;
            this.$scope = $scope;
            this.$state = $state;
            this.$authService = $authService;
            this.translationService = translationService;
            this.popupMessageService = popupMessageService;
            this.$modal = $modal;
            this.mirroringService = mirroringService;
            this.L10N = {};
            this.mirroringStoreContainer = {};
            this.$scope.NavigateTo = function (state, extendedParams) {
                var tmp = _.clone(_this.$state.params);
                _this.AddKeyValues(tmp, extendedParams);
                _this.$state.go(_this.$state.current.parent.name + "." + state, tmp, { inherit: true, location: true, notify: true });
            };
            this.$scope.NavigateToParam = function (key, value, extendedParams) {
                var tmp = _.clone(_this.$state.params);
                tmp[key] = value;
                _this.AddKeyValues(tmp, extendedParams);
                _this.$state.go(_this.$state.current.name, tmp, { inherit: true, location: true, notify: true });
            };
            $scope.$on(Core.ApplicationEvent.UiRouterStateChangeSuccess, function (event, toState, toParams, fromState, fromParms) {
                _this.SetTitle(toState.name);
                if (toState.name.match("Stores$")) {
                    _this.$scope.Vm.SelectedStoreGroupInterval = null;
                }
            });
            $scope.Cancel = function () {
                _this.$scope.NavigateTo(MirroringStoreStates.Stores);
            };
            $scope.ViewMirrorDetails = function (intervalGroup, index) {
                var firstInterval = intervalGroup.Intervals[0];
                intervalGroup.IsAllDay = _this.mirroringService.IsAllDay(firstInterval);
                _this.$scope.Vm.SelectedStoreGroupInterval = intervalGroup;
                _this.$scope.NavigateTo(MirroringStoreStates.StoreDetails);
            };
            $scope.AddMirror = function () {
                _this.$scope.Vm.SelectedStoreGroupInterval = {};
                _this.$scope.NavigateTo(MirroringStoreStates.StoreAdd);
            };
            $scope.CancelMirror = function () {
                _this.popupMessageService.ShowSuccess(_this.L10N.CancelMirrorSuccess);
            };
            $scope.OpenDateRangeDialog = function (startDate, endDate, minDate, maxDate, setDefaultDates) {
                return _this.OpenDateRangeDialog(startDate, endDate, minDate, maxDate, setDefaultDates);
            };
            $scope.Save = function (interval) {
                _this.Save(interval);
            };
            $scope.SourceDateRangeBeforeTarget = function () {
                if (!$scope.Vm.SelectedStoreGroupInterval || !$scope.Vm.SelectedStoreGroupInterval.SourceDateEndDate || !$scope.Vm.SelectedStoreGroupInterval.TargetDateStartDate) {
                    return true;
                }
                if ($scope.Vm.SelectedStoreGroupInterval.SourceDateEndDate < moment($scope.Vm.SelectedStoreGroupInterval.TargetDateStartDate).toDate()) {
                    return true;
                }
                return false;
            };
            this.Initialize();
        }
        MirroringStoreController.prototype.Initialize = function () {
            this.$scope.Vm = {
                L10N: {},
                FilterStatus: StoreMirrorStatusGroup.Active,
                EntityId: this.$authService.GetUser().BusinessUser.MobileSettings.EntityId
            };
            if (Forecasting.hasOwnProperty("mirroringStoreContainer")) {
                this.mirroringStoreContainer = Forecasting["mirroringStoreContainer"];
            }
            this.GetL10N();
            this.SetTitle();
        };
        MirroringStoreController.prototype.GetL10N = function () {
            var _this = this;
            this.translationService.GetTranslations().then(function (l10NData) {
                _this.L10N = _this.$scope.Vm.L10N = l10NData.Forecasting;
                _this.mirroringStoreContainer.L10N = _this.L10N;
                _this.SetTitle();
            });
        };
        MirroringStoreController.prototype.SetTitle = function (name) {
            if (!name) {
                if (this.$state && this.$state.current) {
                    name = this.$state.current.name;
                }
            }
            var title = "", mc = this.mirroringStoreContainer;
            if (mc && name) {
                var state = mc.GetState(name);
                if (state) {
                    title = state.GetTitle();
                }
            }
            this.popupMessageService.SetPageTitle(title);
        };
        MirroringStoreController.prototype.AddKeyValues = function (params, extendedParams) {
            if (extendedParams) {
                var pairs = extendedParams.split("&");
                _.each(pairs, function (pair) {
                    var keyValue = pair.split("=");
                    params[keyValue[0]] = keyValue[1];
                });
            }
        };
        MirroringStoreController.prototype.OpenDateRangeDialog = function (startDate, endDate, minDate, maxDate, setDefaultDates) {
            var range = { StartDate: startDate, EndDate: endDate }, minMax = { StartDate: minDate, EndDate: maxDate }, modalInstance = this.$modal.open({
                templateUrl: "/Areas/Core/Templates/mx-date-range.html",
                controller: "Core.DateRangeController",
                windowClass: "wide-sm",
                resolve: {
                    dateRange: function () { return range; },
                    minMaxDateRange: function () { return minMax; },
                    dateRangeOptions: function () {
                        return { SetDefaultDates: setDefaultDates };
                    }
                }
            });
            return modalInstance.result;
        };
        MirroringStoreController.prototype.Save = function (interval) {
            var _this = this;
            this.mirroringService.SaveStoreMirror(interval)
                .success(function () {
                _this.popupMessageService.ShowSuccess(_this.$scope.Vm.L10N.SavedSuccessfully);
                _this.$scope.Vm.StoreGroupIntervals = null;
                _this.$scope.NavigateTo(MirroringStoreStates.Stores);
            })
                .error(function (message, status) {
                if (status === Core.HttpStatus.Conflict) {
                    _this.popupMessageService.ShowError(_this.$scope.Vm.L10N.StoreMirrorOverlapMessage);
                }
                else {
                    _this.popupMessageService.ShowError(_this.$scope.Vm.L10N.Error + status + " " + message.Message);
                }
            });
        };
        return MirroringStoreController;
    }());
    Forecasting.MirroringStoreController = MirroringStoreController;
    Forecasting.mirroringStoreController = Core.NG.ForecastingModule.RegisterNamedController("MirroringStoreController", MirroringStoreController, Core.NG.$typedScope(), Core.NG.$state, Core.Auth.$authService, Core.$translation, Core.$popupMessageService, Core.NG.$modal, Forecasting.Services.$mirroringService);
})(Forecasting || (Forecasting = {}));
