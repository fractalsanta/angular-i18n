var Operations;
(function (Operations) {
    var Reporting;
    (function (Reporting) {
        var ProductMix;
        (function (ProductMix) {
            var ProductMixController = (function () {
                function ProductMixController($scope, translationService, popupMessageService, userSettingService, authService, constants, reportService, stateService) {
                    this.$scope = $scope;
                    this.translationService = translationService;
                    this.popupMessageService = popupMessageService;
                    this.userSettingService = userSettingService;
                    this.authService = authService;
                    this.constants = constants;
                    this.reportService = reportService;
                    this.stateService = stateService;
                    this._category = null;
                    this.Initialise();
                    this.GetData(this.$scope.Vm.Dates[0], this.$scope.Vm.Dates[1]);
                }
                ProductMixController.prototype.Initialise = function () {
                    var _this = this;
                    this._reportLoading = false;
                    var today = moment().toDate();
                    var canAccessViewManager = this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Operations_ProductMix_CanAccessViewManager);
                    this.ReportType = Reporting.Api.Models.ReportType.ProductMix;
                    this.translationService.GetTranslations().then(function (l10N) {
                        _this.$scope.L10N = l10N.OperationsReportingProductMix;
                        _this.popupMessageService.SetPageTitle(_this.$scope.L10N.ProductMix);
                    });
                    this.$scope.Vm = {
                        Dates: [today, today],
                        Views: [],
                        SelectedView: null,
                        SortMap: [],
                        SortColumnId: null,
                        SortAscending: true,
                        SortItemCode: false,
                        SortItemDescription: false,
                        SortCategory: false,
                        ShowViewManager: canAccessViewManager,
                        State: {
                            Mode: 0
                        },
                        SearchText: null,
                        Columns: [],
                        Categories: [],
                        ExportCurrentViewUri: null
                    };
                    var viewPromise = this.reportService.GetViews(this.ReportType)
                        .then(function (views) {
                        _this.$scope.Vm.Views = views;
                        return _this.userSettingService.GetUserSetting(Administration.User.Api.Models.UserSettingEnum.ProductMixFavouriteView);
                    })
                        .then(function (favouriteView) {
                        if (favouriteView) {
                            _this.SetFavourite(Number(favouriteView));
                        }
                        else {
                            _this.SetFavourite(-1);
                        }
                        var defaultView = _.find(_this.$scope.Vm.Views, function (view) { return view.IsDefault; });
                        if (defaultView == null && _this.$scope.Vm.Views.length > 0) {
                            defaultView = _this.$scope.Vm.Views[0];
                        }
                        _this.$scope.Vm.SelectedView = defaultView;
                    });
                    this.$scope.ShowViewManager = function () {
                        _this.reportService.DateFrom = _this.$scope.Vm.Dates[0];
                        _this.reportService.DateTo = _this.$scope.Vm.Dates[1];
                        _this.stateService.go(Core.UiRouterState.ViewManagerStates.ViewManager, { ReportTypeId: Reporting.Api.Models.ReportType.ProductMix });
                    };
                    this.$scope.UpdateFavouriteView = function (event, view) {
                        if (view.IsDefault) {
                            view.IsDefault = false;
                            _this.userSettingService.SetUserSetting(Administration.User.Api.Models.UserSettingEnum
                                .ProductMixFavouriteView, "");
                        }
                        else {
                            _this.SetFavourite(view.ViewId);
                            _this.userSettingService.SetUserSetting(Administration.User.Api.Models.UserSettingEnum
                                .ProductMixFavouriteView, view.ViewId.toString());
                        }
                        event.preventDefault();
                        event.stopPropagation();
                    };
                    this.$scope.GetView = function (view) {
                        _this.$scope.Vm.SelectedView = view;
                        _this.GetData(_this.$scope.Vm.Dates[0], _this.$scope.Vm.Dates[1]);
                    };
                    this.$scope.ChangeDates = function (dates) {
                        viewPromise.then(function () {
                            _this.GetData(_this.$scope.Vm.Dates[0], _this.$scope.Vm.Dates[0]);
                        });
                    };
                    this.$scope.IsReportLoading = function () {
                        return _this._reportLoading;
                    };
                    this.$scope.IsTotals = function () {
                        return _this._category == null;
                    };
                    this.$scope.ShowTotals = function () {
                        return _this._category = null;
                    };
                    this.$scope.IsActive = function (category) {
                        return _this._category === category;
                    };
                    this.$scope.SetCategory = function (category) {
                        _this._category = category;
                        _this.ResetSortMap();
                    };
                    this.$scope.GetTotal = function (column) {
                        return _this.$scope.GetTotalByGroup(column, _this._category);
                    };
                    this.$scope.GetTotalByGroup = function (column, group) {
                        var value = _.find(column.Summary, function (sum) { return sum.GroupId === group; });
                        return value ? value.Total : null;
                    };
                    this.$scope.GetProductByIndex = function (index) {
                        return _this._products[index];
                    };
                    this.$scope.GetSortedValueByIndex = function (column, index) {
                        return column.Values[index];
                    };
                    this.$scope.SortBy = function (key) {
                        if (key === "description") {
                            if (_this.$scope.Vm.SortItemDescription) {
                                _this.SwitchSortOrder();
                                _this.$scope.Vm.SortMap.reverse();
                            }
                            else {
                                _this.ResetSortKeys();
                                _this.$scope.Vm.SortItemDescription = true;
                                _this.$scope.Vm.SortMap = _.chain(_this.$scope.Vm.SortMap)
                                    .sortBy(function (val) { return _this.$scope.GetProductByIndex(val.Index).Description.toUpperCase(); })
                                    .value();
                            }
                        }
                        else if (key === "code") {
                            if (_this.$scope.Vm.SortItemCode) {
                                _this.SwitchSortOrder();
                                _this.$scope.Vm.SortMap.reverse();
                            }
                            else {
                                _this.ResetSortKeys();
                                _this.$scope.Vm.SortItemCode = true;
                                _this.$scope.Vm.SortMap = _.chain(_this.$scope.Vm.SortMap)
                                    .sortBy(function (val) { return _this.$scope.GetProductByIndex(val.Index).Code.toUpperCase(); })
                                    .value();
                            }
                        }
                    };
                    this.$scope.SortByCategory = function () {
                        if (_this.$scope.Vm.SortCategory) {
                            _this.SwitchSortOrder();
                            _this.$scope.Vm.Categories.reverse();
                        }
                        else {
                            _this.ResetSortKeys();
                            _this.$scope.Vm.SortCategory = true;
                            _this.$scope.Vm.Categories = _.sortBy(_this.$scope.Vm.Categories, function (cat) { return cat.GroupDescription; });
                        }
                    };
                    this.$scope.SortRows = function (col) {
                        if (_this.$scope.Vm.SortColumnId === col.ColumnId) {
                            _this.SwitchSortOrder();
                            _this.$scope.Vm.SortMap.reverse();
                        }
                        else {
                            _this.ResetSortKeys();
                            _this.$scope.Vm.SortColumnId = col.ColumnId;
                            _this.$scope.Vm.SortMap = _.chain(_this.$scope.Vm.SortMap)
                                .sortBy(function (val) { return val; })
                                .sortBy(function (val) { return _this.GetColumnValueByIndex(col, val.Index); })
                                .value();
                        }
                    };
                    this.$scope.SortCategories = function (col) {
                        if (_this.$scope.Vm.SortColumnId === col.ColumnId) {
                            _this.SwitchSortOrder();
                            _this.$scope.Vm.Categories.reverse();
                        }
                        else {
                            _this.ResetSortKeys();
                            _this.$scope.Vm.SortColumnId = col.ColumnId;
                            _this.$scope.Vm.Categories = _.sortBy(_this.$scope.Vm.Categories, function (cat) {
                                return _this.GetParsedTotalByGroup(col, cat.GroupId);
                            });
                        }
                    };
                    this.$scope.Search = function () {
                        if (_this.$scope.Vm.SearchText) {
                            var result = _.where(_this._products, function (item) {
                                return _.contains(item.Description.toLowerCase(), _this.$scope.Vm.SearchText.toLowerCase()) ||
                                    _.contains(item.Code.toLowerCase(), _this.$scope.Vm.SearchText.toLowerCase());
                            });
                            _this.$scope.Vm.Categories = [];
                            _.forEach(result, function (row) {
                                var category = _.find(_this._categoryList, function (c) { return c.GroupId === row.GroupId; });
                                if (!_.any(_this.$scope.Vm.Categories, function (item) { return item.GroupId === category.GroupId; })) {
                                    _this.$scope.Vm.Categories.push({
                                        GroupId: row.GroupId,
                                        GroupDescription: category.GroupDescription,
                                        SortOrder: category.SortOrder,
                                        Items: []
                                    });
                                }
                                _this.$scope.Vm.Categories[_this.$scope.Vm.Categories.length - 1].Items.push(row);
                            });
                            _this.ResetSortMap();
                        }
                        return [];
                    };
                    this.$scope.ClearSearch = function () {
                        _this.$scope.Vm.SearchText = "";
                        _this.$scope.Vm.Categories = _.clone(_this._categoryList);
                        _this.ResetSortMap();
                    };
                    this.$scope.ChangeDates(this.$scope.Vm.Dates);
                };
                ProductMixController.prototype.GetData = function (dateFrom, dateTo) {
                    var _this = this;
                    this._reportLoading = true;
                    var viewId = this.$scope.Vm.SelectedView != null ? this.$scope.Vm.SelectedView.ViewId : null;
                    this.reportService.GetProductData(viewId, dateFrom, dateTo, Reporting.Api.Models.ReportType.ProductMix, "")
                        .then(function (data) {
                        _this.$scope.Vm.Columns = data.Columns;
                        _this._products = data.Products;
                        _this._categoryList = [];
                        _.forEach(data.Groups, function (row) {
                            _this._categoryList.push({
                                GroupId: row.GroupId,
                                GroupDescription: row.GroupDescription,
                                SortOrder: row.SortOrder,
                                Items: []
                            });
                        });
                        var index = 0;
                        _.forEach(data.Products, function (row) {
                            var category = _.find(_this._categoryList, function (c) { return c.GroupId === row.GroupId; });
                            row.Index = index;
                            category.Items.push(row);
                            index++;
                        });
                        _this.$scope.ClearSearch();
                        _this.$scope.ShowTotals();
                        _this.$scope.Vm.ExportCurrentViewUri = _this.reportService.GetExportUri(viewId, dateFrom, dateTo, _this.ReportType);
                    })
                        .finally(function () {
                        _this._reportLoading = false;
                    });
                };
                ProductMixController.prototype.ResetSortMap = function () {
                    var _this = this;
                    if (this._category == null) {
                        return;
                    }
                    var fr = _.find(this.$scope.Vm.Categories, function (c) { return c.GroupId === _this._category; });
                    this.$scope.Vm.SortMap = fr.Items;
                    this.ResetSortKeys();
                    this.$scope.SortBy("code");
                };
                ProductMixController.prototype.ResetSortKeys = function () {
                    this.$scope.Vm.SortColumnId = null;
                    this.$scope.Vm.SortItemDescription = false;
                    this.$scope.Vm.SortItemCode = false;
                    this.$scope.Vm.SortCategory = false;
                    this.$scope.Vm.SortAscending = true;
                };
                ProductMixController.prototype.SwitchSortOrder = function () {
                    this.$scope.Vm.SortAscending = !this.$scope.Vm.SortAscending;
                };
                ProductMixController.prototype.GetColumnValueByIndex = function (column, index) {
                    return this.ParseColumnValue(column.Values[index], column.ColumnValueType);
                };
                ProductMixController.prototype.GetParsedTotalByGroup = function (column, group) {
                    return this.ParseColumnValue(this.$scope.GetTotalByGroup(column, group), column.ColumnValueType);
                };
                ProductMixController.prototype.ParseColumnValue = function (value, type) {
                    switch (type) {
                        case Reporting.Api.Models.ReportColumnValueType.Currency:
                        case Reporting.Api.Models.ReportColumnValueType.Decimal:
                        case Reporting.Api.Models.ReportColumnValueType.Integer:
                        case Reporting.Api.Models.ReportColumnValueType.Percentage:
                        case Reporting.Api.Models.ReportColumnValueType.Date:
                            return parseFloat(value) || 0;
                        case Reporting.Api.Models.ReportColumnValueType.String:
                            return value.toString();
                        default:
                            return 0;
                    }
                };
                ProductMixController.prototype.SetFavourite = function (viewId) {
                    _.each(this.$scope.Vm.Views, function (view) {
                        view.IsDefault = (viewId === view.ViewId);
                    });
                };
                return ProductMixController;
            }());
            Core.NG.OperationsReportingProductMixModule.RegisterRouteController("", "Templates/ProductMix.html", ProductMixController, Core.NG.$typedScope(), Core.$translation, Core.$popupMessageService, Administration.User.Services.$userSettingService, Core.Auth.$authService, Core.Constants, Reporting.reportService, Core.NG.$state);
        })(ProductMix = Reporting.ProductMix || (Reporting.ProductMix = {}));
    })(Reporting = Operations.Reporting || (Operations.Reporting = {}));
})(Operations || (Operations = {}));
