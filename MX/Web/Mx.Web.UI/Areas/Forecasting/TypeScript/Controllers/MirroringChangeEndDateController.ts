module Forecasting {
    "use strict";

    export interface IMirroringChangeEndDateControllerScope extends ng.IScope {
        Cancel(): void;
        OK(): void;
        Model: {
            L10N: Api.Models.ITranslations;
            DatePickerOptions: Core.NG.IMxDayPickerOptions;
            Interval: IMySalesItemMirroringInterval;
            EndDate: Date;
        };
        CanSave(): boolean;
        SourceDateRangeBeforeTarget(): boolean;
        EndDateChanged(d: Date): void;
    }

    export class MirroringChangeEndDateController {
        constructor(
            private $scope: IMirroringChangeEndDateControllerScope,
            private modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private translationService: Core.ITranslationService,
            private mirroringService: Services.IMirroringService,
            private interval: IMySalesItemMirroringInterval
            ) {

            $scope.Cancel = (): void => modalInstance.dismiss();
            $scope.OK = (): void => {
                interval.TargetDateEndDate = $scope.Model.DatePickerOptions.Date;
                interval.OverwriteManager = $scope.Model.Interval.OverwriteManager;
                mirroringService.CalculateDates(interval);
                var result: IMirroringChangeEndDateResult = { Interval: interval };
                modalInstance.close(result);
            };

            var CheckDatesEqual = (d1: Date, d2: Date): boolean => {
                return (d1.getFullYear() === d2.getFullYear()) && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
            };

            this.$scope.CanSave = (): boolean => {
                return !CheckDatesEqual($scope.Model.DatePickerOptions.Date, interval.TargetDateEndDate) ||
                    $scope.Model.Interval.OverwriteManager !== interval.OverwriteManager;
            };

            this.$scope.EndDateChanged = (d: Date): void => {
                $scope.Model.Interval.TargetDateEndDate = d;
                mirroringService.CalculateDates($scope.Model.Interval);
            };

            this.$scope.SourceDateRangeBeforeTarget = (): boolean => {
                if ($scope.Model.Interval.SourceDateEndDate < moment($scope.Model.Interval.TargetDateStartDate).toDate()) {
                    return true;
                }

                return false;
            };

            this.Initialize();
        }

        public Initialize(): void {
            this.$scope.Model = {
                L10N: null,
                EndDate: this.interval.TargetDateEndDate,
                DatePickerOptions: {
                    Date: this.interval.TargetDateEndDate,
                    DayOffset: 1,
                    MonthOffset: 0,
                    Min: this.interval.TargetDateStartDate
                },
                Interval: _.cloneDeep(this.interval)
            };

            this.GetL10N();
        }

        private GetL10N(): void {
            var model: any = this.$scope.Model;

            this.translationService.GetTranslations().then((l10NData: any): void => {
                model.L10N = l10NData.Forecasting;
            });
        }

    }

    export var mirroringChangeEndDateController = Core.NG.ForecastingModule.RegisterNamedController("MirroringChangeEndDateController", MirroringChangeEndDateController,
        Core.NG.$typedScope<IMirroringChangeEndDateControllerScope>(),
        Core.NG.$modalInstance,
        Core.$translation,
        Forecasting.Services.$mirroringService,
        Core.NG.$typedCustomResolve<IMySalesItemMirroringInterval>("Interval")
        );
}