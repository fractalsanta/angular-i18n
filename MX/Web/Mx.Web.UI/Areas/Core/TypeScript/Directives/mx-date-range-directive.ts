module Core.Directives {
    "use strict";

    interface IMxDateRangeScope extends ng.IScope {
        FilterLast(): void;
        OpenCustomRangeDialog(): void;
        ChangeDates(): void;
        Dates: IDateRange;
        MinMaxDates: IDateRange;
        Days: string;
        Model: {
            FilterText: string;
        };
        Translations: Api.Models.IL10N;
    }

    class MxDateRangeController {
        private _daysBetween = 14;
        private _customRange: Core.IDateRange;


        constructor(
            private $scope: IMxDateRangeScope,
            translationService: Core.ITranslationService,
            $modal: ng.ui.bootstrap.IModalService
        ) {
            if ($scope.Days) {
                this._daysBetween = Number($scope.Days);
            } else {
                $scope.Days = this._daysBetween.toString();
            }

            $scope.Model = { FilterText: '' };

            if ($scope.Dates) {
                if (! $scope.Dates.EndDate) {
                    $scope.Dates.EndDate = moment().toDate();
                }
                if (! $scope.Dates.StartDate) {
                    $scope.Dates.StartDate = moment().subtract({ days: this._daysBetween }).toDate();
                }
            } else {

                $scope.Dates = {
                    EndDate: moment().toDate(),
                    StartDate: moment().subtract({ days: this._daysBetween }).toDate()
                };
            }


            $scope.FilterLast = (): void => {

                $scope.Model.FilterText = $scope.Translations.Last + " " + this._daysBetween + " " + $scope.Translations.Days;
                $scope.Dates.EndDate = moment().toDate();
                $scope.Dates.StartDate = moment().subtract({ days: this._daysBetween }).toDate();
                $scope.ChangeDates();

                this._customRange = null;
            };

            $scope.OpenCustomRangeDialog = (): void => {

                var modalInstance = $modal.open(<ng.ui.bootstrap.IModalSettings>{
                    templateUrl: "/Areas/Core/Templates/mx-date-range.html",
                    controller: "Core.DateRangeController",
                    windowClass: "wide-sm",
                    resolve: { 
                        dateRange: (): Core.IDateRange => { return this._customRange; },
                        minMaxDateRange: (): Core.IDateRange => { return this.$scope.MinMaxDates; },
                        dateRangeOptions: (): Core.IDateRangeOptions => {
                            return <Core.IDateRangeOptions> { SetDefaultDates: true };
                        }
                    }
                });

                modalInstance.result.then((result: Core.IDateRange): void => {
                    var startDate = moment(result.StartDate);
                    var endDate = moment(result.EndDate);
                    var format = "MMM D, YYYY";

                    this._customRange = result;
                    $scope.Dates.StartDate = startDate.toDate();
                    $scope.Dates.EndDate = endDate.toDate();

                    $scope.Model.FilterText = startDate.format(format) + " - " + endDate.format(format);

                    $scope.ChangeDates();
                });
            };

            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                $scope.Translations = result.Core;
                $scope.FilterLast();
            });
        }
    }

    Core.NG.CoreModule.RegisterNamedController("MxDateRangeController", MxDateRangeController,
        Core.NG.$typedScope<IMxDateRangeScope>(),
        Core.$translation,
        Core.NG.$modal);

    class MxDateRangeDirective implements ng.IDirective {
        constructor() {
            return <ng.IDirective>{
                restrict: "E",
                scope: {
                    Dates: "=dates",
                    MinMaxDates: "=minmaxdates",
                    Days: "@days",
                    ChangeDates: "&change"
                },
                replace: true,
                templateUrl: "/Areas/Core/Templates/mx-date-range-directive.html",
                controller: "Core.MxDateRangeController"
            };
        }
    }

    NG.CoreModule.RegisterDirective("mxDateRange", MxDateRangeDirective);
}