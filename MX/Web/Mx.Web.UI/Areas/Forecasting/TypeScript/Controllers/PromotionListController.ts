module Forecasting {
    "use strict";

    class PromotionListController {
        constructor(private scope: IPromotionListControllerScope
            , private $modal: ng.ui.bootstrap.IModalService
            , private $state: ng.ui.IStateService
            , private promotionService: Services.IPromotionService
            , private translationService: Core.ITranslationService
            , private popupMessageService: Core.IPopupMessageService
            , private constants: Core.IConstants
        ) {
            this.Initialize();
            this.ApplyDateRange();
        }

        private Initialize(): void {
            this.scope.Vm = {
                  FilterText: ""
                , DateRange: { StartDate: null, EndDate: null }
                , Promotions: []
                , FilteredPromotions: []
                , CurrentPagePromotions: []
                , PagingOptions: { itemsPerPage: 20, numPages: 5 }
                , CurrentPage: 1
            };

            this.scope.Header = {
                  Columns: []
                , OnSortEvent: (): void => {
                    this.ApplySort();
                }
                , DefaultSort: (data: any[]): any[] => {
                    return data;
                }
                , IsAscending: true
            };

            this.translationService.GetTranslations().then((l10NData: Core.Api.Models.ITranslations): void => {
                this.scope.L10N = l10NData.ForecastingPromotions;
                this.popupMessageService.SetPageTitle(this.scope.L10N.PageTitle);
                this.scope.Header.Columns = [
                      { Fields: ["Name"], Title: this.scope.L10N.ListColumnDescription }
                    , { Fields: ["StartDate", "EndDate"], Title: this.scope.L10N.ListColumnPeriod }
                    , { Fields: ["TimelineText"], Title: this.scope.L10N.ListColumnStatus }
                    , { Title: "" }
                ];
                this.scope.Header.Selected = this.scope.Header.Columns[1]; // period
            });

            this.scope.RequiresPaging = (): boolean => {
                return this.scope.Vm.FilteredPromotions.length > this.scope.Vm.PagingOptions.itemsPerPage;
            };

            this.scope.ChangePage = (page: number): void => {
                this.scope.Vm.CurrentPage = page;
                var first = (page - 1) * this.scope.Vm.PagingOptions.itemsPerPage;
                var last = first + this.scope.Vm.PagingOptions.itemsPerPage;
                this.scope.Vm.CurrentPagePromotions = this.scope.Vm.FilteredPromotions.slice(first, last);
            };

            this.scope.OpenDateRange = (): void => {
                this.OpenDateRangeDialog(this.scope.Vm.DateRange)
                    .then((result: Core.IDateRange): void => {
                        this.scope.Vm.DateRange = result;
                        this.ApplyDateRange();
                    });
            };

            this.scope.$watch("Vm.FilterText", (): void => {
                this.ApplyFilter();
            });

            this.promotionService.EventPromotionDeleted.SubscribeController(this.scope,
                (id: number) => this.OnPromotionDeleted(id));
            this.promotionService.EventPromotionUpserted.SubscribeController(this.scope,
                () => this.OnPromotionUpserted());
        }

        private ApplyFilter(): void {
            var searchTerm = this.scope.Vm.FilterText.toUpperCase();
            if (searchTerm === "") {
                this.scope.Vm.FilteredPromotions = this.scope.Vm.Promotions;
            } else {
                this.scope.Vm.FilteredPromotions = _.filter(this.scope.Vm.Promotions, (item: Api.Models.IPromotionListItem): boolean => {
                    return item.Name.toUpperCase().indexOf(searchTerm) > -1
                        || item.TimelineText.toUpperCase().indexOf(searchTerm) > -1;
                });
            }
            this.scope.ChangePage(1);
        }

        private ApplySort(): void {
            this.scope.Vm.Promotions = this.scope.Header.DefaultSort(this.scope.Vm.Promotions);
            this.ApplyFilter();
        }

        private ApplyDateRange(): void {
            this.promotionService.Get(this.scope.Vm.DateRange.StartDate, this.scope.Vm.DateRange.EndDate, Api.Enums.PromotionStatus.Active)
                .success((results: Api.Models.IPromotionListItem[]): void => {
                    this.scope.Vm.Promotions = results;
                    this.ApplySort();
                });
        }

        private OpenDateRangeDialog(range: Core.IDateRange): ng.IPromise<any> {
            var minMax: Core.IDateRange = <Core.IDateRange> { StartDate: new Date(1970, 1, 1), EndDate: new Date(3000, 1, 1) };
            var dialog = this.$modal.open(<ng.ui.bootstrap.IModalSettings> {
                templateUrl: "/Areas/Core/Templates/mx-date-range.html",
                controller: "Core.DateRangeController",
                windowClass: "wide-sm",
                resolve: {
                      dateRange: (): Core.IDateRange => { return range; }
                    , minMaxDateRange: (): Core.IDateRange => { return minMax; }
                    , dateRangeOptions: (): Core.IDateRangeOptions => {
                        return <Core.IDateRangeOptions> { SetDefaultDates: false };
                    }
                }
            });

            return dialog.result;
        }

        private OnPromotionDeleted(id: number): void {
            var index = _.findIndex(this.scope.Vm.Promotions, (item: Api.Models.IPromotionListItem) => item.PromotionId === id);
            if (index !== -1) {
                this.scope.Vm.Promotions.splice(index, 1);
                this.ApplyFilter();
            }
        }

        private OnPromotionUpserted(): void {
            this.ApplyDateRange();
        }
    }

    export var promotionListController = Core.NG.ForecastingModule.RegisterNamedController("PromotionListController"
        , PromotionListController
        , Core.NG.$typedScope<IPromotionListControllerScope>()
        , Core.NG.$modal
        , Core.NG.$state
        , Services.$promotionService
        , Core.$translation
        , Core.$popupMessageService
        , Core.Constants
        );
}