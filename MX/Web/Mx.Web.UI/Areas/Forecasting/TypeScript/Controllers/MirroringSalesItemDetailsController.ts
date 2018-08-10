module Forecasting {
    "use strict";

    export interface IMirroringSalesItemDetailsControllerScope extends IMirroringControllerScope {
        Model: {
            Interval: IMySalesItemMirroringInterval;
        };

        IsReadOnly(): boolean;
        DeleteMirror(): void;
        ChangeEndDate(): void;
    }

    export class MirroringSalesItemDetailsController {
        private L10N: Api.Models.ITranslations = <Api.Models.ITranslations>{};

        constructor(
            private $scope: IMirroringSalesItemDetailsControllerScope,
            private $modal: ng.ui.bootstrap.IModalService,
            private popupMessageService: Core.IPopupMessageService,
            private mirroringService: Services.IMirroringService
            ) {

            $scope.IsReadOnly = (): boolean => {
                return true;
            };

            $scope.ChangeEndDate = (): void => {
                this.ChangeEndDateConfirmation()
                    .then((result: IMirroringChangeEndDateResult): void => {
                        mirroringService.SaveSalesItem(result.Interval).then((): void => {
                            this.$scope.Model.Interval = result.Interval;
                            this.popupMessageService.ShowSuccess(this.L10N.SavedSuccessfully);
                        });
                    });
            };

            $scope.DeleteMirror = (): void => {
                this.DeleteConfirmation()
                    .then((overwrite: boolean): void => {
                        var interval: IMySalesItemMirroringInterval = $scope.Model.Interval;
                        interval.OverwriteManager = overwrite;
                        mirroringService.Delete(interval).then((): void => {
                            this.$scope.Vm.SalesItemIntervals = null;
                            this.popupMessageService.ShowSuccess(this.L10N.DeleteMirrorSuccess);
                            this.$scope.NavigateTo(MirroringStates.List);
                        });
                    });
            };

            $scope.$watch("Vm.L10N", (newValue: Api.Models.ITranslations): void => {
                this.L10N = newValue;
            }, false);

            // #endregion

            this.Initialize();
        }

        public Initialize(): void {
            if (!this.$scope.Vm.SelectedSalesItemInterval) {
                this.$scope.Cancel();
            }

            this.$scope.Model = {
                Interval: this.$scope.Vm.SelectedSalesItemInterval
            };
        }

        public DeleteConfirmation(): ng.IPromise<any> {
            var confirm = <Core.IConfirmation> {
                Title: this.$scope.Vm.L10N.DeleteMirror,
                Message: this.$scope.Vm.L10N.DeleteMirrorMessage,
                ConfirmationType: Core.ConfirmationTypeEnum.Danger,
                ConfirmText: this.$scope.Vm.L10N.Delete
            };
            var modalInstance = this.$modal.open(<ng.ui.bootstrap.IModalSettings>{
                templateUrl: "/Areas/Forecasting/Templates/MirroringSaveConfirmationDialog.html",
                controller: "Forecasting.MirrorConfirmationController",
                windowClass: "wide-sm",
                resolve: {
                    confirmation: (): Core.IConfirmation => {
                        return confirm;
                    },
                    Interval: (): IMySalesItemMirroringInterval => {
                        return this.$scope.Model.Interval;
                    }
                }
            });

            return modalInstance.result;
        }

        public ChangeEndDateConfirmation(): ng.IPromise<any> {
            var modalInstance = this.$modal.open(<ng.ui.bootstrap.IModalSettings>{
                templateUrl: "/Areas/Forecasting/Templates/MirroringChangeEndDateDialog.html",
                controller: "Forecasting.MirroringChangeEndDateController",
                windowClass: "wide-sm",
                resolve: {
                    Interval: (): IMySalesItemMirroringInterval => {
                        return this.$scope.Model.Interval;
                    }
                }
            });

            return modalInstance.result;
        }

    }

    export var mirroringSalesItemDetailsController = Core.NG.ForecastingModule.RegisterNamedController("MirroringSalesItemDetailsController", MirroringSalesItemDetailsController,
        Core.NG.$typedScope<IMirroringSalesItemDetailsControllerScope>(),
        Core.NG.$modal,
        Core.$popupMessageService,
         Forecasting.Services.$mirroringService
      );
}