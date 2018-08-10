module Core {
    "use strict";

    interface ICustomRangeControllerScope extends ng.IScope {
        StartDate: Date;
        EndDate: Date;
        MinDate: Date;
        MaxDate: Date;
        Cancel(): void;
        Confirm(startDate: Date, endDate: Date): void;
        DisableStartDate(): boolean;

        Translations: Api.Models.IL10N;
    }

    class DateRangeController {
        constructor(
            $scope: ICustomRangeControllerScope,
            $modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            dateRange: Core.IDateRange,
            minMaxDateRange: Core.IDateRange,
            translationService: Core.ITranslationService,
            dateRangeOptions: IDateRangeOptions) {

            // TODO: Possible passing of number of days?
            if (dateRangeOptions && dateRangeOptions.SetDefaultDates) {
                $scope.EndDate = (dateRange && dateRange.EndDate) || moment().toDate();
                $scope.StartDate = (dateRange && dateRange.StartDate) || moment().add("d", -14).toDate();
            } else {
                $scope.EndDate = (dateRange && dateRange.EndDate);
                $scope.StartDate = (dateRange && dateRange.StartDate);
            }
            $scope.MinDate = (minMaxDateRange && minMaxDateRange.StartDate);
            $scope.MaxDate = (minMaxDateRange && minMaxDateRange.EndDate);

            $scope.Translations = <Api.Models.IL10N>{};

            $scope.Cancel = (): void => {
                $modalInstance.dismiss();
            };

            $scope.Confirm = (startDate: Date, endDate: Date): void => {
                $modalInstance.close(<Core.IDateRange>{ StartDate: startDate, EndDate: endDate });
            };

            $scope.DisableStartDate = (): boolean => {
                return dateRangeOptions && dateRangeOptions.DisableStartDate;
            };

            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                $scope.Translations = result.Core;

            });
        }
    }

    NG.CoreModule.RegisterNamedController("DateRangeController", DateRangeController,
        Core.NG.$typedScope<ICustomRangeControllerScope>(),
        Core.NG.$modalInstance,
        Core.NG.$typedCustomResolve<Core.IDateRange>("dateRange"),
        Core.NG.$typedCustomResolve<Core.IDateRange>("minMaxDateRange"),
        Core.$translation,
        Core.NG.$typedCustomResolve<IDateRangeOptions>("dateRangeOptions")
        );
}