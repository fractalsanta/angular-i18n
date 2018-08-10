var Inventory;
(function (Inventory) {
    var Waste;
    (function (Waste) {
        "use strict";
        var FilterEnum;
        (function (FilterEnum) {
            FilterEnum[FilterEnum["AllItems"] = 0] = "AllItems";
            FilterEnum[FilterEnum["RawItems"] = 1] = "RawItems";
            FilterEnum[FilterEnum["FinishedItems"] = 2] = "FinishedItems";
        })(FilterEnum || (FilterEnum = {}));
        var WasteHistoryController = (function () {
            function WasteHistoryController(scope, historyService, authService, popupMessageService, translationService, constants) {
                var _this = this;
                this.historyService = historyService;
                this._twoWeeks = 14;
                this._user = authService.GetUser();
                scope.$watch("Model.Search", function () {
                    scope.FilteredItems = scope.Filtered();
                }, true);
                translationService.GetTranslations().then(function (result) {
                    var tran = scope.Translations = result.InventoryWaste;
                    _this._filter = FilterEnum.AllItems;
                    _this._filterFunction = function () {
                        switch (_this._filter) {
                            case FilterEnum.RawItems:
                                scope.WasteItems = scope.Header.DefaultSort(_.filter(_this._wasteItems, function (x) { return !x.IsFinished; }));
                                scope.Model.CurrentFilter = tran.RawItems;
                                scope.FilteredItems = scope.Filtered();
                                break;
                            case FilterEnum.FinishedItems:
                                scope.WasteItems = scope.Header.DefaultSort(_.filter(_this._wasteItems, function (x) { return x.IsFinished; }));
                                scope.Model.CurrentFilter = tran.FinishedItems;
                                scope.FilteredItems = scope.Filtered();
                                break;
                            default:
                                scope.WasteItems = scope.Header.DefaultSort(_this._wasteItems);
                                scope.Model.CurrentFilter = tran.AllItems;
                                scope.FilteredItems = scope.Filtered();
                                break;
                        }
                    };
                    var performSort = function () {
                        scope.WasteItems = scope.Header.DefaultSort(scope.WasteItems);
                        scope.FilteredItems = scope.Filtered();
                    };
                    scope.Header = {
                        Columns: [
                            { Fields: ["WasteDate"], Title: tran.Date },
                            { Fields: ["Description", 'Code'], Title: tran.Description + ' (' + tran.ItemCode + ')' },
                            { Fields: ["Qty"], Title: tran.ItemQuantity },
                            { Fields: ["Reason"], Title: tran.Reason },
                            { Fields: ["TotalValue"], Title: tran.Cost, Class: "text-right" }
                        ],
                        OnSortEvent: performSort
                    };
                    scope.Header.Selected = scope.Header.Columns[0];
                    scope.GetFilterEnum = function () {
                        return FilterEnum;
                    };
                    scope.Model = {
                        Search: '',
                        CurrentFilter: tran.AllItems
                    };
                    scope.SetFilter = function (filterIndex) {
                        _this._filter = filterIndex;
                        _this._filterFunction();
                    };
                    popupMessageService.SetPageTitle(tran.WasteHistory);
                });
                var today = moment();
                scope.Dates = {
                    EndDate: today.toDate(),
                    StartDate: today.subtract('days', this._twoWeeks).toDate()
                };
                scope.WasteItems = [];
                scope.Filtered = function () {
                    if (scope.Model.Search) {
                        var lower = scope.Model.Search.toLowerCase();
                        return _.filter(scope.WasteItems, function (item) {
                            return (_.contains(item.Description.toLowerCase(), lower)
                                || _.contains(item.ProductCode.toLowerCase(), lower)
                                || (item.Reason && _.contains(item.Reason.toLowerCase(), lower)));
                        });
                    }
                    return scope.WasteItems;
                };
                scope.ChangeDates = function () {
                    historyService.GetWasteHistory(_this._user.BusinessUser.MobileSettings.EntityId, moment(scope.Dates.StartDate).format(constants.InternalDateFormat), moment(scope.Dates.EndDate).format(constants.InternalDateFormat)).success(function (result) {
                        _this._wasteItems = result;
                        _this._filterFunction();
                    });
                };
            }
            return WasteHistoryController;
        }());
        Core.NG.InventoryWasteModule.RegisterRouteController("History", "Templates/WasteHistory.html", WasteHistoryController, Core.NG.$typedScope(), Inventory.Waste.Api.$wasteHistoryService, Core.Auth.$authService, Core.$popupMessageService, Core.$translation, Core.Constants);
    })(Waste = Inventory.Waste || (Inventory.Waste = {}));
})(Inventory || (Inventory = {}));
