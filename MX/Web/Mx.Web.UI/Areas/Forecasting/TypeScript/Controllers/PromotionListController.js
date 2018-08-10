var Forecasting;
(function (Forecasting) {
    "use strict";
    var PromotionListController = (function () {
        function PromotionListController(scope, $modal, $state, promotionService, translationService, popupMessageService, constants) {
            this.scope = scope;
            this.$modal = $modal;
            this.$state = $state;
            this.promotionService = promotionService;
            this.translationService = translationService;
            this.popupMessageService = popupMessageService;
            this.constants = constants;
            this.Initialize();
            this.ApplyDateRange();
        }
        PromotionListController.prototype.Initialize = function () {
            var _this = this;
            this.scope.Vm = {
                FilterText: "",
                DateRange: { StartDate: null, EndDate: null },
                Promotions: [],
                FilteredPromotions: [],
                CurrentPagePromotions: [],
                PagingOptions: { itemsPerPage: 20, numPages: 5 },
                CurrentPage: 1
            };
            this.scope.Header = {
                Columns: [],
                OnSortEvent: function () {
                    _this.ApplySort();
                },
                DefaultSort: function (data) {
                    return data;
                },
                IsAscending: true
            };
            this.translationService.GetTranslations().then(function (l10NData) {
                _this.scope.L10N = l10NData.ForecastingPromotions;
                _this.popupMessageService.SetPageTitle(_this.scope.L10N.PageTitle);
                _this.scope.Header.Columns = [
                    { Fields: ["Name"], Title: _this.scope.L10N.ListColumnDescription },
                    { Fields: ["StartDate", "EndDate"], Title: _this.scope.L10N.ListColumnPeriod },
                    { Fields: ["TimelineText"], Title: _this.scope.L10N.ListColumnStatus },
                    { Title: "" }
                ];
                _this.scope.Header.Selected = _this.scope.Header.Columns[1];
            });
            this.scope.RequiresPaging = function () {
                return _this.scope.Vm.FilteredPromotions.length > _this.scope.Vm.PagingOptions.itemsPerPage;
            };
            this.scope.ChangePage = function (page) {
                _this.scope.Vm.CurrentPage = page;
                var first = (page - 1) * _this.scope.Vm.PagingOptions.itemsPerPage;
                var last = first + _this.scope.Vm.PagingOptions.itemsPerPage;
                _this.scope.Vm.CurrentPagePromotions = _this.scope.Vm.FilteredPromotions.slice(first, last);
            };
            this.scope.OpenDateRange = function () {
                _this.OpenDateRangeDialog(_this.scope.Vm.DateRange)
                    .then(function (result) {
                    _this.scope.Vm.DateRange = result;
                    _this.ApplyDateRange();
                });
            };
            this.scope.$watch("Vm.FilterText", function () {
                _this.ApplyFilter();
            });
            this.promotionService.EventPromotionDeleted.SubscribeController(this.scope, function (id) { return _this.OnPromotionDeleted(id); });
            this.promotionService.EventPromotionUpserted.SubscribeController(this.scope, function () { return _this.OnPromotionUpserted(); });
        };
        PromotionListController.prototype.ApplyFilter = function () {
            var searchTerm = this.scope.Vm.FilterText.toUpperCase();
            if (searchTerm === "") {
                this.scope.Vm.FilteredPromotions = this.scope.Vm.Promotions;
            }
            else {
                this.scope.Vm.FilteredPromotions = _.filter(this.scope.Vm.Promotions, function (item) {
                    return item.Name.toUpperCase().indexOf(searchTerm) > -1
                        || item.TimelineText.toUpperCase().indexOf(searchTerm) > -1;
                });
            }
            this.scope.ChangePage(1);
        };
        PromotionListController.prototype.ApplySort = function () {
            this.scope.Vm.Promotions = this.scope.Header.DefaultSort(this.scope.Vm.Promotions);
            this.ApplyFilter();
        };
        PromotionListController.prototype.ApplyDateRange = function () {
            var _this = this;
            this.promotionService.Get(this.scope.Vm.DateRange.StartDate, this.scope.Vm.DateRange.EndDate, Forecasting.Api.Enums.PromotionStatus.Active)
                .success(function (results) {
                _this.scope.Vm.Promotions = results;
                _this.ApplySort();
            });
        };
        PromotionListController.prototype.OpenDateRangeDialog = function (range) {
            var minMax = { StartDate: new Date(1970, 1, 1), EndDate: new Date(3000, 1, 1) };
            var dialog = this.$modal.open({
                templateUrl: "/Areas/Core/Templates/mx-date-range.html",
                controller: "Core.DateRangeController",
                windowClass: "wide-sm",
                resolve: {
                    dateRange: function () { return range; },
                    minMaxDateRange: function () { return minMax; },
                    dateRangeOptions: function () {
                        return { SetDefaultDates: false };
                    }
                }
            });
            return dialog.result;
        };
        PromotionListController.prototype.OnPromotionDeleted = function (id) {
            var index = _.findIndex(this.scope.Vm.Promotions, function (item) { return item.PromotionId === id; });
            if (index !== -1) {
                this.scope.Vm.Promotions.splice(index, 1);
                this.ApplyFilter();
            }
        };
        PromotionListController.prototype.OnPromotionUpserted = function () {
            this.ApplyDateRange();
        };
        return PromotionListController;
    }());
    Forecasting.promotionListController = Core.NG.ForecastingModule.RegisterNamedController("PromotionListController", PromotionListController, Core.NG.$typedScope(), Core.NG.$modal, Core.NG.$state, Forecasting.Services.$promotionService, Core.$translation, Core.$popupMessageService, Core.Constants);
})(Forecasting || (Forecasting = {}));
