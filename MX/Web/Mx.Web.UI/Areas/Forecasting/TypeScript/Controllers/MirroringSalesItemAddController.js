var Forecasting;
(function (Forecasting) {
    "use strict";
    var MirroringSalesItemAddController = (function () {
        function MirroringSalesItemAddController($scope, $modal, popupMessageService, confirmationService, mirroringService) {
            var _this = this;
            this.$scope = $scope;
            this.$modal = $modal;
            this.popupMessageService = popupMessageService;
            this.confirmationService = confirmationService;
            this.mirroringService = mirroringService;
            this.L10N = {};
            $scope.$watch("Vm.L10N", function (newValue) {
                _this.L10N = newValue;
            }, false);
            $scope.OnAdjustmentChange = function (interval) {
                interval.Adjustment =
                    mirroringService.CalculateAdjustment(parseInt(interval.AdjustmentPercent, 10) || 0);
            };
            $scope.OnAdjustmentBlur = function (interval) {
                if (interval.AdjustmentPercent === "%") {
                    interval.AdjustmentPercent = "0%";
                }
            };
            $scope.IsDirty = function () {
                var interval = $scope.Model.Interval;
                if (interval.TargetSalesItem.Id) {
                    return true;
                }
                if (interval.SourceSalesItem.Id) {
                    return true;
                }
                if (interval.TargetDateStartDate) {
                    return true;
                }
                if (interval.SourceDateStartDate) {
                    return true;
                }
                if (interval.Zone && interval.Zone.Id) {
                    return true;
                }
                if (interval.Adjustment !== 1) {
                    return true;
                }
                return false;
            };
            $scope.Cancel = function () {
                if ($scope.IsDirty()) {
                    _this.confirmationService.Confirm({
                        Title: _this.$scope.Vm.L10N.MirrorCancelTitle,
                        Message: _this.$scope.Vm.L10N.MirrorCancelItemMessage,
                        ConfirmText: _this.$scope.Vm.L10N.MirrorCancelConfirm,
                        ConfirmationType: Core.ConfirmationTypeEnum.Positive
                    }).then(function (result) {
                        if (result) {
                            _this.$scope.NavigateTo(Forecasting.MirroringStates.List);
                        }
                    });
                }
                else {
                    _this.$scope.NavigateTo(Forecasting.MirroringStates.List);
                }
            };
            $scope.Save = function () {
                _this.SaveConfirmation()
                    .then(function (yes) {
                    if (yes) {
                        $scope.$parent.Save($scope.Model.Interval);
                    }
                });
            };
            $scope.SelectTargetSalesItem = function () {
                _this.OpenSelectSalesItemDialog()
                    .then(function (salesItem) {
                    $scope.Model.Interval.TargetSalesItem = {
                        Id: salesItem.Id,
                        Description: salesItem.Description,
                        ItemCode: salesItem.ItemCode
                    };
                });
            };
            $scope.SelectSourceSalesItem = function () {
                _this.OpenSelectSalesItemDialog()
                    .then(function (salesItem) {
                    $scope.Model.Interval.SourceSalesItem = {
                        Id: salesItem.Id,
                        Description: salesItem.Description,
                        ItemCode: salesItem.ItemCode
                    };
                });
            };
            $scope.OpenTargetDateRangeDialog = function (options) {
                var interval = $scope.Model.Interval;
                $scope.OpenDateRangeDialog(interval.TargetDateStartDate, interval.TargetDateEndDate, options.Min, options.Max, false)
                    .then(function (result) {
                    interval.TargetDateStartDate = result.StartDate;
                    interval.TargetDateEndDate = result.EndDate;
                    interval.SourceDateStartDate = null;
                    $scope.Model.SourceDateOptions.Max = mirroringService.CalculateDates(interval);
                });
            };
            $scope.OpenSourceStartDateDialog = function (e) {
                e.preventDefault();
                e.stopPropagation();
                $scope.Model.SourceDateOptions.Open = true;
            };
            $scope.OnDateChange = function () {
                $scope.Model.SourceDateOptions.Open = false;
                $scope.Model.SourceDateOptions.Max = mirroringService.CalculateDates($scope.Model.Interval);
            };
            this.Initialize();
        }
        MirroringSalesItemAddController.prototype.Initialize = function () {
            this.$scope.Model = {
                Interval: {
                    Adjustment: 1,
                    SourceSalesItem: {},
                    TargetSalesItem: {},
                    Zone: {}
                },
                TargetDateOptions: {
                    Min: moment().add({ days: 1 }).toDate(),
                    Max: moment().add({ months: 13 }),
                    Start: moment().add({ days: 1 }).toDate(),
                    End: moment().add({ days: 2 }).toDate()
                },
                SourceDateOptions: {
                    Open: false,
                    Min: moment().subtract({ months: 13 }),
                    Max: moment().subtract({ days: 1 })
                }
            };
            this.$scope.Model.Interval.AdjustmentPercent = "0%";
            this.$scope.Vm.SelectedSalesItemInterval = this.$scope.Model.Interval;
            this.GetSalesItems();
        };
        MirroringSalesItemAddController.prototype.GetSalesItems = function (search) {
            var _this = this;
            this.ForecastSalesItems = {
                EntityId: 0,
                SalesItems: [],
                SearchParam: ""
            };
            this.mirroringService.GetSalesItems(search)
                .success(function (salesItems) {
                _this.ForecastSalesItems.SalesItems = salesItems;
            })
                .error(function (message, status) {
                _this.popupMessageService.ShowError(_this.$scope.Vm.L10N.Error + message);
            });
        };
        MirroringSalesItemAddController.prototype.OpenSelectSalesItemDialog = function () {
            var _this = this;
            this.ForecastSalesItems.SelectedSalesItem = null;
            this.ForecastSalesItems.SelectedDescription = "";
            var modalInstance = this.$modal.open({
                templateUrl: "/Areas/Forecasting/Templates/SelectSalesItemsDialog.html",
                controller: "Forecasting.SelectSalesItemController",
                windowClass: "modal-transparent",
                resolve: {
                    ForecastSalesItems: function () {
                        return _this.ForecastSalesItems;
                    }
                }
            });
            return modalInstance.result;
        };
        MirroringSalesItemAddController.prototype.SaveConfirmation = function () {
            return this.confirmationService.Confirm({
                Title: this.$scope.Vm.L10N.SaveMirrorTitle,
                Message: this.$scope.Vm.L10N.SaveMirrorMessage,
                ConfirmText: this.$scope.Vm.L10N.Save,
                ConfirmationType: Core.ConfirmationTypeEnum.Positive
            });
        };
        return MirroringSalesItemAddController;
    }());
    Forecasting.MirroringSalesItemAddController = MirroringSalesItemAddController;
    Forecasting.mirroringSalesItemAddController = Core.NG.ForecastingModule.RegisterNamedController("MirroringSalesItemAddController", MirroringSalesItemAddController, Core.NG.$typedScope(), Core.NG.$modal, Core.$popupMessageService, Core.$confirmationService, Forecasting.Services.$mirroringService);
})(Forecasting || (Forecasting = {}));
