var Forecasting;
(function (Forecasting) {
    "use strict";
    var MirroringStates = (function () {
        function MirroringStates() {
        }
        MirroringStates.List = "SalesItems";
        MirroringStates.Details = "SalesItemDetails";
        MirroringStates.Add = "SalesItemAdd";
        return MirroringStates;
    }());
    Forecasting.MirroringStates = MirroringStates;
    var MirroringController = (function () {
        function MirroringController($scope, $state, $authService, translationService, popupMessageService, $modal, mirroringService) {
            var _this = this;
            this.$scope = $scope;
            this.$state = $state;
            this.$authService = $authService;
            this.translationService = translationService;
            this.popupMessageService = popupMessageService;
            this.$modal = $modal;
            this.mirroringService = mirroringService;
            this.L10N = {};
            this.mirroringContainer = {};
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
                if (toState.name.match("SalesItems$")) {
                    _this.$scope.Vm.SelectedSalesItemInterval = null;
                }
            });
            $scope.Cancel = function () {
                _this.$scope.NavigateTo(MirroringStates.List);
            };
            $scope.ViewDetails = function (interval, index) {
                _this.$scope.Vm.SelectedSalesItemInterval = interval;
                _this.$scope.NavigateTo(MirroringStates.Details);
            };
            $scope.AddItem = function () {
                _this.$scope.Vm.SelectedSalesItemInterval = {};
                _this.$scope.NavigateTo(MirroringStates.Add);
            };
            $scope.OpenDateRangeDialog = function (startDate, endDate, minDate, maxDate, setDefaultDates) {
                return _this.OpenDateRangeDialog(startDate, endDate, minDate, maxDate, setDefaultDates);
            };
            $scope.GetZoneSelectedCount = function () {
                var zone = _this.$scope.Vm.SelectedSalesItemInterval ? _this.$scope.Vm.SelectedSalesItemInterval.Zone : {}, count = "" + (zone ? zone.EntityCount || 0 : 0);
                return _this.L10N.Restaurants ? _this.L10N.Restaurants.replace(/\{0\}/g, count) : "";
            };
            $scope.Save = function (interval) {
                _this.Save(interval);
            };
            $scope.SameDay = function () {
                if (!$scope.Vm.SelectedSalesItemInterval || !$scope.Vm.SelectedSalesItemInterval.TargetDateStartDate || !$scope.Vm.SelectedSalesItemInterval.SourceDateStartDate) {
                    return true;
                }
                if ($scope.Vm.SelectedSalesItemInterval.TargetDateStartDate.getDay() === $scope.Vm.SelectedSalesItemInterval.SourceDateStartDate.getDay()) {
                    return true;
                }
                return false;
            };
            $scope.SourceDateRangeBeforeTarget = function () {
                if (!$scope.Vm.SelectedSalesItemInterval || !$scope.Vm.SelectedSalesItemInterval.SourceDateEndDate || !$scope.Vm.SelectedSalesItemInterval.TargetDateStartDate) {
                    return true;
                }
                if ($scope.Vm.SelectedSalesItemInterval.SourceDateEndDate < moment($scope.Vm.SelectedSalesItemInterval.TargetDateStartDate).toDate()) {
                    return true;
                }
                return false;
            };
            this.Initialize();
        }
        MirroringController.prototype.Initialize = function () {
            this.$scope.Vm = {
                L10N: {},
                FilterText: ""
            };
            if (Forecasting.hasOwnProperty("mirroringContainer")) {
                this.mirroringContainer = Forecasting["mirroringContainer"];
            }
            this.GetL10N();
            this.GetZones();
            this.SetTitle();
        };
        MirroringController.prototype.GetL10N = function () {
            var _this = this;
            this.translationService.GetTranslations().then(function (l10NData) {
                _this.L10N = _this.$scope.Vm.L10N = l10NData.Forecasting;
                _this.mirroringContainer.L10N = _this.L10N;
                _this.SetTitle();
            });
        };
        MirroringController.prototype.SetTitle = function (name) {
            if (!name) {
                if (this.$state && this.$state.current) {
                    name = this.$state.current.name;
                }
            }
            var title = "", mc = this.mirroringContainer;
            if (mc && name) {
                var state = mc.GetState(name);
                if (state) {
                    title = state.GetTitle();
                }
            }
            this.popupMessageService.SetPageTitle(title);
        };
        MirroringController.prototype.GetZones = function () {
            var _this = this;
            this.mirroringService.GetForecastZones()
                .success(function (zones) {
                _this.$scope.Vm.Zones = zones;
            })
                .error(function (message, status) {
                _this.popupMessageService.ShowError(_this.$scope.Vm.L10N.Error + message);
            });
        };
        MirroringController.prototype.AddKeyValues = function (params, extendedParams) {
            if (extendedParams) {
                var pairs = extendedParams.split("&");
                _.each(pairs, function (pair) {
                    var keyValue = pair.split("=");
                    params[keyValue[0]] = keyValue[1];
                });
            }
        };
        MirroringController.prototype.OpenDateRangeDialog = function (startDate, endDate, minDate, maxDate, setDefaultDates) {
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
        MirroringController.prototype.Save = function (interval) {
            var _this = this;
            this.mirroringService.SaveSalesItem(interval)
                .success(function () {
                _this.popupMessageService.ShowSuccess(_this.$scope.Vm.L10N.SavedSuccessfully);
                _this.$scope.Vm.SalesItemIntervals = null;
                _this.$scope.NavigateTo(MirroringStates.List);
            })
                .error(function (message, status) {
                if (status === Core.HttpStatus.Conflict) {
                    _this.popupMessageService.ShowError(_this.$scope.Vm.L10N.MirrorOverlapMessage);
                }
                else {
                    _this.popupMessageService.ShowError(_this.$scope.Vm.L10N.Error + status + " " + message.Message);
                }
            });
        };
        return MirroringController;
    }());
    Forecasting.MirroringController = MirroringController;
    Forecasting.mirroringController = Core.NG.ForecastingModule.RegisterNamedController("MirroringController", MirroringController, Core.NG.$typedScope(), Core.NG.$state, Core.Auth.$authService, Core.$translation, Core.$popupMessageService, Core.NG.$modal, Forecasting.Services.$mirroringService);
})(Forecasting || (Forecasting = {}));
