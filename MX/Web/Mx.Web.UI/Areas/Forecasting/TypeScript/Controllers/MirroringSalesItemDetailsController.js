var Forecasting;
(function (Forecasting) {
    "use strict";
    var MirroringSalesItemDetailsController = (function () {
        function MirroringSalesItemDetailsController($scope, $modal, popupMessageService, mirroringService) {
            var _this = this;
            this.$scope = $scope;
            this.$modal = $modal;
            this.popupMessageService = popupMessageService;
            this.mirroringService = mirroringService;
            this.L10N = {};
            $scope.IsReadOnly = function () {
                return true;
            };
            $scope.ChangeEndDate = function () {
                _this.ChangeEndDateConfirmation()
                    .then(function (result) {
                    mirroringService.SaveSalesItem(result.Interval).then(function () {
                        _this.$scope.Model.Interval = result.Interval;
                        _this.popupMessageService.ShowSuccess(_this.L10N.SavedSuccessfully);
                    });
                });
            };
            $scope.DeleteMirror = function () {
                _this.DeleteConfirmation()
                    .then(function (overwrite) {
                    var interval = $scope.Model.Interval;
                    interval.OverwriteManager = overwrite;
                    mirroringService.Delete(interval).then(function () {
                        _this.$scope.Vm.SalesItemIntervals = null;
                        _this.popupMessageService.ShowSuccess(_this.L10N.DeleteMirrorSuccess);
                        _this.$scope.NavigateTo(Forecasting.MirroringStates.List);
                    });
                });
            };
            $scope.$watch("Vm.L10N", function (newValue) {
                _this.L10N = newValue;
            }, false);
            this.Initialize();
        }
        MirroringSalesItemDetailsController.prototype.Initialize = function () {
            if (!this.$scope.Vm.SelectedSalesItemInterval) {
                this.$scope.Cancel();
            }
            this.$scope.Model = {
                Interval: this.$scope.Vm.SelectedSalesItemInterval
            };
        };
        MirroringSalesItemDetailsController.prototype.DeleteConfirmation = function () {
            var _this = this;
            var confirm = {
                Title: this.$scope.Vm.L10N.DeleteMirror,
                Message: this.$scope.Vm.L10N.DeleteMirrorMessage,
                ConfirmationType: Core.ConfirmationTypeEnum.Danger,
                ConfirmText: this.$scope.Vm.L10N.Delete
            };
            var modalInstance = this.$modal.open({
                templateUrl: "/Areas/Forecasting/Templates/MirroringSaveConfirmationDialog.html",
                controller: "Forecasting.MirrorConfirmationController",
                windowClass: "wide-sm",
                resolve: {
                    confirmation: function () {
                        return confirm;
                    },
                    Interval: function () {
                        return _this.$scope.Model.Interval;
                    }
                }
            });
            return modalInstance.result;
        };
        MirroringSalesItemDetailsController.prototype.ChangeEndDateConfirmation = function () {
            var _this = this;
            var modalInstance = this.$modal.open({
                templateUrl: "/Areas/Forecasting/Templates/MirroringChangeEndDateDialog.html",
                controller: "Forecasting.MirroringChangeEndDateController",
                windowClass: "wide-sm",
                resolve: {
                    Interval: function () {
                        return _this.$scope.Model.Interval;
                    }
                }
            });
            return modalInstance.result;
        };
        return MirroringSalesItemDetailsController;
    }());
    Forecasting.MirroringSalesItemDetailsController = MirroringSalesItemDetailsController;
    Forecasting.mirroringSalesItemDetailsController = Core.NG.ForecastingModule.RegisterNamedController("MirroringSalesItemDetailsController", MirroringSalesItemDetailsController, Core.NG.$typedScope(), Core.NG.$modal, Core.$popupMessageService, Forecasting.Services.$mirroringService);
})(Forecasting || (Forecasting = {}));
