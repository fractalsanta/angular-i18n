module Forecasting {
    "use strict";

    export interface IMirroringSalesItemsControllerScope extends IMirroringControllerScope {
        Model: {
            FilteredIntervals?: IMySalesItemMirroringInterval[];
        };

        Header(): Core.Directives.IGridHeader;
        FilterIntervals(): void;
        OpenDateRange(): void;
    }

    export class MirroringSalesItemsController {
        private _initialDays = 14;
        private L10N: Api.Models.ITranslations = <Api.Models.ITranslations>{};
        private Header: Core.Directives.IGridHeader;

        constructor(
            private $scope: IMirroringSalesItemsControllerScope,
            private popupMessageService: Core.IPopupMessageService,
            private mirroringService: Services.IMirroringService,
            private $timeout: ng.ITimeoutService
            ) {

            // #region toolbar

            $scope.FilterIntervals = (): void => {
                var text = this.$scope.Vm.FilterText,
                    intervals = this.$scope.Vm.SalesItemIntervals,
                    filtered;

                filtered = this.ApplySearchFilter(text, intervals);

                this.$scope.Model.FilteredIntervals = filtered;

                this.Header.OnSortEvent();
            };

            $scope.$watch("Vm.FilterText", (): void => {
                this.$scope.FilterIntervals();
            }, true);

            // #endregion

            // #region data

            $scope.Header = (): Core.Directives.IGridHeader => {
                return this.Header;
            };

            $scope.$watch("Vm.L10N", (newValue: Api.Models.ITranslations): void => {
                this.L10N = newValue;
                this.Header = this.GetHeader();
                this.$timeout(() => {
                    $(window).resize();
                });
            }, false);

            $scope.$watch("Vm.Dates", (newValue: Core.IDateRange, oldValue: Core.IDateRange): void => {
                if (newValue && oldValue && (newValue.StartDate != oldValue.StartDate || newValue.EndDate != oldValue.EndDate)) {
                    this.LoadData($scope.Vm.Dates);
                }
            }, true);

            // #endregion

            $scope.OpenDateRange = (): void => {
                $scope.OpenDateRangeDialog(
                    $scope.Vm.Dates.StartDate,
                    $scope.Vm.Dates.EndDate,
                    moment("1970-1-1").toDate(),
                    moment("3000-12-31").toDate(),
                    false)
                    .then((result: Core.IDateRange): void => {
                        $scope.Vm.Dates = result;
                    });
            };


            this.Initialize();
        }

        public Initialize(): void {
            this.Header = this.GetHeader();

            this.$scope.Vm.Dates = <Core.IDateRange>{
                StartDate: null,
                EndDate: null
            };

            this.$scope.Model = {
            };

            if (!this.$scope.Vm.SalesItemIntervals) {
                this.LoadData(this.$scope.Vm.Dates);
            } else {
                this.$scope.FilterIntervals();
            }
        }

        public GetHeader(): Core.Directives.IGridHeader {
            var performSort = (): void => {
                this.$scope.Model.FilteredIntervals = this.Header.DefaultSort(this.$scope.Model.FilteredIntervals);
            },
            defaultSort = (data: any[]): any[] => {
                return data;
            },
            header = <Core.Directives.IGridHeader> {
                Columns: [
                    { Title: this.L10N.TargetSalesItemCode, Fields: ["TargetSalesItem.Description"] },
                    { Title: this.L10N.MirrorDates, Fields: ["TargetDateStartDate"] },
                    { Title: this.L10N.Zone },
                    { Title: "" } // chevron
                ],
                OnSortEvent: performSort,
                DefaultSort: defaultSort,
                IsAscending: true
            };

            header.Selected = header.Columns[1];

            return header;
        }

        public LoadData(dates: Core.IDateRange): void {
            var startDate: Date = dates && dates.StartDate ? dates.StartDate : moment().add("d", -this._initialDays).toDate(),
                endDate: Date = dates && dates.EndDate ? dates.EndDate : moment("3000-12-31").toDate();

            this.mirroringService.GetSalesItemMirrorIntervals(startDate, endDate)
                .success((intervals: IMySalesItemMirroringInterval[]): void => {
                    _.each(intervals, (interval: IMySalesItemMirroringInterval): void => {
                        this.mirroringService.Cast(interval);
                    });

                    this.$scope.Vm.SalesItemIntervals = intervals;
                    this.$scope.FilterIntervals();
                })
                .error((message: any, status: any): void => {
                    this.popupMessageService.ShowError(this.$scope.Vm.L10N.Error + message);
                });
        }

        public ApplySearchFilter(text: string, items: IMySalesItemMirroringInterval[]): IMySalesItemMirroringInterval[] {
            var filtered: IMySalesItemMirroringInterval[] = items;

            if (text) {
                // http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
                var textEscaped = text.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"),
                    regex = new RegExp(textEscaped, "i");

                filtered = _.filter(items, (item: IMySalesItemMirroringInterval): boolean => {
                    if (item.TargetSalesItem && item.TargetSalesItem.Description.match(regex) != null) {
                        return true;
                    }

                    if (item.TargetSalesItem && ("(" + item.TargetSalesItem.ItemCode.toString() + ")").match(regex) != null) {
                        return true;
                    }

                    if (item.Zone && item.Zone.Name.match(regex) != null) {
                        return true;
                    }

                    return false;
                });
            }

            return filtered;
        }
    }

    export var mirroringSalesItemsController = Core.NG.ForecastingModule.RegisterNamedController("MirroringSalesItemsController", MirroringSalesItemsController,
        Core.NG.$typedScope<IMirroringSalesItemsControllerScope>(),
        Core.$popupMessageService,
        Forecasting.Services.$mirroringService,
        Core.NG.$timeout
        );
}