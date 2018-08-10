module Forecasting {
    "use strict";

    export interface IMirroringSalesItemAddControllerScope extends IMirroringControllerScope {
        Model: {
            Interval: IMySalesItemMirroringInterval;
            TargetDateOptions: any;
            SourceDateOptions: any;
        };

        OnAdjustmentChange(interval: IMySalesItemMirroringInterval): void;
        OnAdjustmentBlur(interval: IMySalesItemMirroringInterval): void;
        SelectTargetSalesItem(): void;
        SelectSourceSalesItem(): void;
        OpenSourceStartDateDialog(e: JQueryEventObject): void;
        OnDateChange(): void;
        OpenTargetDateRangeDialog(options: any): void;
        IsDirty(): boolean;
        Save(): void;
    }

    export class MirroringSalesItemAddController {
        private L10N: Api.Models.ITranslations = <Api.Models.ITranslations>{};
        private ForecastSalesItems: Services.IForecastSalesItems;

        constructor(
            private $scope: IMirroringSalesItemAddControllerScope,
            private $modal: ng.ui.bootstrap.IModalService,
            private popupMessageService: Core.IPopupMessageService,
            private confirmationService: Core.IConfirmationService,
            private mirroringService: Services.IMirroringService
            ) {

            // #region data

            $scope.$watch("Vm.L10N", (newValue: Api.Models.ITranslations): void => {
                this.L10N = newValue;
            }, false);

            $scope.OnAdjustmentChange = (interval: IMySalesItemMirroringInterval): void => {
                interval.Adjustment =
                    mirroringService.CalculateAdjustment(
                        parseInt(interval.AdjustmentPercent, 10) || 0
                    );
            };

            $scope.OnAdjustmentBlur = (interval: IMySalesItemMirroringInterval): void => {
                if (interval.AdjustmentPercent === "%") {
                    interval.AdjustmentPercent = "0%";
                }
            };

            $scope.IsDirty = (): boolean => {
                var interval = $scope.Model.Interval;

                if (interval.TargetSalesItem.Id) { return true; }
                if (interval.SourceSalesItem.Id) { return true; }
                if (interval.TargetDateStartDate) { return true; }
                if (interval.SourceDateStartDate) { return true; }
                if (interval.Zone && interval.Zone.Id) { return true; }
                if (interval.Adjustment !== 1) { return true; }

                return false;
            };

            $scope.Cancel = (): void => {
                if ($scope.IsDirty()) {
                    this.confirmationService.Confirm({
                        Title: this.$scope.Vm.L10N.MirrorCancelTitle,
                        Message: this.$scope.Vm.L10N.MirrorCancelItemMessage,
                        ConfirmText: this.$scope.Vm.L10N.MirrorCancelConfirm,
                        ConfirmationType: Core.ConfirmationTypeEnum.Positive
                    }).then((result): void => {
                        if (result) {
                            this.$scope.NavigateTo(MirroringStates.List);
                        }
                    });
                } else {
                    this.$scope.NavigateTo(MirroringStates.List);
                }
            };

            $scope.Save = (): void => {
                this.SaveConfirmation()
                    .then((yes: boolean): void => {
                        if (yes) {
                            (<IMirroringControllerScope>$scope.$parent).Save($scope.Model.Interval);
                        }
                    });
            };

            // #endregion

            // #region sales items

            $scope.SelectTargetSalesItem = (): void => {
                this.OpenSelectSalesItemDialog()
                    .then((salesItem: Api.Models.ISalesItem): void => {
                        $scope.Model.Interval.TargetSalesItem = <Api.Models.ISalesItem>{
                            Id: salesItem.Id,
                            Description: salesItem.Description,
                            ItemCode: salesItem.ItemCode
                        };
                    });
            };

            $scope.SelectSourceSalesItem = (): void => {
                this.OpenSelectSalesItemDialog()
                    .then((salesItem: Api.Models.ISalesItem): void => {
                        $scope.Model.Interval.SourceSalesItem = <Api.Models.ISalesItem>{
                            Id: salesItem.Id,
                            Description: salesItem.Description,
                            ItemCode: salesItem.ItemCode
                        };
                    });
            };

            // #endregion

            // #region dates

            $scope.OpenTargetDateRangeDialog = (options: any): void => {
                var interval = $scope.Model.Interval;

                $scope.OpenDateRangeDialog(
                    interval.TargetDateStartDate,
                    interval.TargetDateEndDate,
                    options.Min,
                    options.Max,
                    false)
                .then((result: Core.IDateRange): void => {
                    interval.TargetDateStartDate = result.StartDate;
                    interval.TargetDateEndDate = result.EndDate;
                    interval.SourceDateStartDate = null;
                    $scope.Model.SourceDateOptions.Max = mirroringService.CalculateDates(interval);
                });
            };

            $scope.OpenSourceStartDateDialog = (e: JQueryEventObject): void => {
                e.preventDefault();
                e.stopPropagation();

                $scope.Model.SourceDateOptions.Open = true;
            };

            $scope.OnDateChange = (): void => {
                $scope.Model.SourceDateOptions.Open = false;
                $scope.Model.SourceDateOptions.Max = mirroringService.CalculateDates($scope.Model.Interval);
            };

            // #endregion

            this.Initialize();
        }

        public Initialize(): void {
            this.$scope.Model = {
                Interval: <Forecasting.IMySalesItemMirroringInterval>{
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
        }

        public GetSalesItems(search?: string): void {
            this.ForecastSalesItems = <Services.IForecastSalesItems>{
                EntityId: 0,
                SalesItems: [],
                SearchParam: ""
            };

            this.mirroringService.GetSalesItems(search)
                .success((salesItems: Api.Models.ISalesItem[]): void => {
                    this.ForecastSalesItems.SalesItems = salesItems;
                })
                .error((message: any, status: any): void => {
                    this.popupMessageService.ShowError(this.$scope.Vm.L10N.Error + message);
                });
        }

        public OpenSelectSalesItemDialog(): ng.IPromise<any> {
            this.ForecastSalesItems.SelectedSalesItem = null;
            this.ForecastSalesItems.SelectedDescription = "";

            var modalInstance = this.$modal.open({
                templateUrl: "/Areas/Forecasting/Templates/SelectSalesItemsDialog.html",
                controller: "Forecasting.SelectSalesItemController",
                windowClass: "modal-transparent",
                resolve: {
                    ForecastSalesItems: (): Services.IForecastSalesItems => {
                        return this.ForecastSalesItems;
                    }
                }
            });

            return modalInstance.result;
        }

        public SaveConfirmation(): ng.IPromise<any> {
            return this.confirmationService.Confirm({
                Title: this.$scope.Vm.L10N.SaveMirrorTitle,
                Message: this.$scope.Vm.L10N.SaveMirrorMessage,
                ConfirmText: this.$scope.Vm.L10N.Save,
                ConfirmationType: Core.ConfirmationTypeEnum.Positive
            });
        }
    }

    export var mirroringSalesItemAddController = Core.NG.ForecastingModule.RegisterNamedController("MirroringSalesItemAddController", MirroringSalesItemAddController,
        Core.NG.$typedScope<IMirroringSalesItemAddControllerScope>(),
        Core.NG.$modal,
        Core.$popupMessageService,
        Core.$confirmationService,
        Services.$mirroringService
        );
}