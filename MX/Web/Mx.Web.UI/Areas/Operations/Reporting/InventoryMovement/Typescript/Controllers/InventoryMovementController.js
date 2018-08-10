var Operations;
(function (Operations) {
    var Reporting;
    (function (Reporting) {
        var InventoryMovement;
        (function (InventoryMovement) {
            var InventoryMovementController = (function () {
                function InventoryMovementController($scope, translationService, popupMessageService, userSettingService, authService, constants, reportService, stateService) {
                    var _this = this;
                    this.$scope = $scope;
                    this.translationService = translationService;
                    this.popupMessageService = popupMessageService;
                    this.userSettingService = userSettingService;
                    this.authService = authService;
                    this.constants = constants;
                    this.reportService = reportService;
                    this.stateService = stateService;
                    this._category = null;
                    this._lastSearch = "";
                    this.EncodeValue = function (value) {
                        if (value == null)
                            return "";
                        if (typeof (value) === "string") {
                            value = "\"" + value.replace(",", "").replace("\"", "") + "\"";
                        }
                        return value;
                    };
                    this.Initialise();
                    this.$scope.SortRows = function (col) {
                        if (_this.$scope.Vm.SortColumnId === col.ColumnId) {
                            _this.SwitchSortOrder();
                            _this.$scope.Vm.SortMap.reverse();
                        }
                        else {
                            _this.ResetSortkeys();
                            _this.$scope.Vm.SortColumnId = col.ColumnId;
                            _this.$scope.Vm.SortMap = _.chain(_this.$scope.Vm.SortMap)
                                .sortBy(function (val) { return val; })
                                .sortBy(function (val) { return _this.GetColumnValueByIndex(col, val); })
                                .value();
                        }
                    };
                    this.$scope.SortCategories = function (col) {
                        if (_this.$scope.Vm.SortColumnId === col.ColumnId) {
                            _this.SwitchSortOrder();
                            _this.$scope.Vm.Categories.reverse();
                        }
                        else {
                            _this.ResetSortkeys();
                            _this.$scope.Vm.SortColumnId = col.ColumnId;
                            _this.$scope.Vm.Categories = _.sortBy(_this.$scope.Vm.Categories, function (cat) {
                                return _this.GetParsedTotalByGroup(col, cat.GroupId);
                            });
                        }
                    };
                    this.$scope.SortByCategory = function () {
                        if (_this.$scope.Vm.SortCategory) {
                            _this.SwitchSortOrder();
                            _this.$scope.Vm.Categories.reverse();
                        }
                        else {
                            _this.ResetSortkeys();
                            _this.$scope.Vm.SortCategory = true;
                            _this.$scope.Vm.Categories = _.sortBy(_this.$scope.Vm.Categories, function (cat) { return cat.GroupDescription; });
                        }
                    };
                    this.$scope.GetProductByIndex = function (index) {
                        return _this._products[index];
                    };
                    this.$scope.IsActive = function (category) {
                        return _this._category === category;
                    };
                    this.$scope.SetCategory = function (category) {
                        _this._category = category;
                        _this.ResetSortMap();
                    };
                    this.$scope.ShowTotals = function () {
                        _this._category = null;
                    };
                    this.$scope.IsTotals = function () {
                        return _this._category == null;
                    };
                    this.$scope.GetSortedValueByIndex = function (column, index) {
                        return column.Values[index];
                    };
                    this.$scope.GetTotal = function (column) {
                        return _this.$scope.GetTotalByGroup(column, _this._category);
                    };
                    this.$scope.GetTotalByGroup = function (column, group) {
                        var value = _.find(column.Summary, function (sum) { return sum.GroupId === group; });
                        return value ? value.Total : null;
                    };
                    this.$scope.GetView = function (view) { return _this.GetView(view); };
                    this.$scope.ShowManager = function () {
                        _this.reportService.DateFrom = _this.$scope.Vm.Dates[0];
                        _this.reportService.DateTo = _this.$scope.Vm.Dates[1];
                        _this.stateService.go(Core.UiRouterState.ViewManagerStates.ViewManager, { ReportTypeId: Reporting.Api.Models.ReportType.InventoryMovement });
                    };
                    this.$scope.ReportIsBeingLoaded = function () { return _this._reportIsBeingLoaded; };
                    this.$scope.FavouriteClick = function (event, view) {
                        if (view.IsDefault) {
                            view.IsDefault = false;
                            _this.userSettingService.SetUserSetting(Administration.User.Api.Models.UserSettingEnum.InventoryMovementFavouriteView, "");
                        }
                        else {
                            _this.SetFavourite(view.ViewId);
                            _this.userSettingService.SetUserSetting(Administration.User.Api.Models.UserSettingEnum.InventoryMovementFavouriteView, view.ViewId.toString());
                        }
                        event.preventDefault();
                        event.stopPropagation();
                    };
                    this.$scope.ExportData = function () {
                        var result = "", index = 0;
                        result += _this.EncodeValue(_this.$scope.L10N.ExportStoreName) + ",";
                        result += _this.EncodeValue(_this.$scope.L10N.Categories) + ",";
                        result += _this.EncodeValue(_this.$scope.L10N.ColumnItemCode) + ",";
                        result += _this.EncodeValue(_this.$scope.L10N.ColumnItemDescription) + ",";
                        _.each(_this.$scope.Vm.Columns, function (column) {
                            result += _this.EncodeValue(_this.$scope.L10N[column.ColumnLocalisationKey]) + ",";
                        });
                        if (result.length > 0) {
                            result = result.substr(0, result.length - 1);
                            result += "\n";
                        }
                        _.each(_this._data.Products, function (product) {
                            var group = _.find(_this._data.Groups, { 'GroupId': product.GroupId });
                            result += _this.EncodeValue(_this.$scope.Vm.CurrentEntity.Number + "-" + _this.$scope.Vm.CurrentEntity.Name) + ",";
                            result += _this.EncodeValue(group.GroupDescription) + ",";
                            result += _this.EncodeValue(product.Code) + ",";
                            result += _this.EncodeValue(product.Description) + ",";
                            _.each(_this._data.Columns, function (column) {
                                result += _this.EncodeValue(column.Values[index]) + ",";
                            });
                            if (result.length > 0) {
                                result = result.substr(0, result.length - 1);
                                result += "\n";
                            }
                            index++;
                        });
                        var anchor = document.createElement('a');
                        anchor.setAttribute("style", "display:none");
                        anchor.setAttribute("href", 'data:attachment/csv,' + encodeURIComponent(result));
                        anchor.setAttribute("download", _this.$scope.Vm.ExportFileName);
                        document.body.appendChild(anchor);
                        anchor.click();
                        document.body.removeChild(anchor);
                    };
                }
                InventoryMovementController.prototype.SwitchSortOrder = function () {
                    this.$scope.Vm.SortAscending = !this.$scope.Vm.SortAscending;
                };
                InventoryMovementController.prototype.ResetSortkeys = function () {
                    this.$scope.Vm.SortColumnId = null;
                    this.$scope.Vm.SortItemDescription = false;
                    this.$scope.Vm.SortItemCode = false;
                    this.$scope.Vm.SortCategory = false;
                    this.$scope.Vm.SortAscending = true;
                };
                InventoryMovementController.prototype.Initialise = function () {
                    var _this = this;
                    this._reportIsBeingLoaded = false;
                    this.ReportType = Reporting.Api.Models.ReportType.InventoryMovement;
                    var canEdit = this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Operations_InventoryMovement_CanAccess);
                    this.$scope.ClearSearch = function () {
                        _this.$scope.Vm.SearchText = "";
                        if (_this._lastSearch !== "") {
                            _this.GetData(_this.$scope.Vm.Dates[0], _this.$scope.Vm.Dates[1]);
                        }
                    };
                    this.$scope.Search = function () {
                        _this.GetData(_this.$scope.Vm.Dates[0], _this.$scope.Vm.Dates[1]);
                    };
                    this.$scope.SortBy = function (key) {
                        if (key === "description") {
                            if (_this.$scope.Vm.SortItemDescription) {
                                _this.SwitchSortOrder();
                                _this.$scope.Vm.SortMap.reverse();
                            }
                            else {
                                _this.ResetSortkeys();
                                _this.$scope.Vm.SortItemDescription = true;
                                _this.$scope.Vm.SortMap = _.chain(_this.$scope.Vm.SortMap)
                                    .sortBy(function (val) { return _this.$scope.GetProductByIndex(val).Description.toUpperCase(); })
                                    .value();
                            }
                        }
                        else if (key === "code") {
                            if (_this.$scope.Vm.SortItemCode) {
                                _this.SwitchSortOrder();
                                _this.$scope.Vm.SortMap.reverse();
                            }
                            else {
                                _this.ResetSortkeys();
                                _this.$scope.Vm.SortItemCode = true;
                                _this.$scope.Vm.SortMap = _.chain(_this.$scope.Vm.SortMap)
                                    .sortBy(function (val) { return _this.$scope.GetProductByIndex(val).Code.toUpperCase(); })
                                    .value();
                            }
                        }
                    };
                    var today = moment().toDate();
                    this.$scope.Vm = {
                        SelectedView: null,
                        Views: null,
                        Dates: [today, today],
                        SortMap: [],
                        SortColumnId: null,
                        SortAscending: true,
                        SortItemCode: false,
                        SortItemDescription: false,
                        SortCategory: false,
                        ShowViewManager: canEdit,
                        ExportCurrentViewUri: null,
                        Columns: [],
                        Categories: [],
                        SearchText: "",
                        State: {
                            Mode: 0
                        },
                        CurrentEntity: null,
                        ExportFileName: ""
                    };
                    var viewPromise = this.reportService.GetViews(this.ReportType)
                        .then(function (views) {
                        _this.$scope.Vm.Views = views;
                        return _this.userSettingService.GetUserSetting(Administration.User.Api.Models.UserSettingEnum.InventoryMovementFavouriteView);
                    })
                        .then(function (favourite) {
                        var viewId = Number(favourite);
                        if (favourite) {
                            _this.SetFavourite(viewId);
                        }
                        else {
                            _this.SetFavourite(-1);
                        }
                        var views = _this.$scope.Vm.Views;
                        var defaultView = _.find(views, function (view) { return view.IsDefault; });
                        if (defaultView == null && views.length > 0) {
                            defaultView = views[0];
                        }
                        _this.$scope.Vm.SelectedView = defaultView;
                    });
                    if (this.reportService.DateFrom != null) {
                        this.$scope.Vm.Dates[0] = this.reportService.DateFrom;
                    }
                    if (this.reportService.DateTo != null) {
                        this.$scope.Vm.Dates[1] = this.reportService.DateTo;
                    }
                    this.$scope.ChangeDates = function (dates) {
                        viewPromise.then(function () {
                            _this.GetData(_this.$scope.Vm.Dates[0], _this.$scope.Vm.Dates[1]);
                        });
                    };
                    this.translationService.GetTranslations().then(function (l10N) {
                        _this.$scope.L10N = l10N.OperationsReportingInventoryMovement;
                        _this.popupMessageService.SetPageTitle(_this.$scope.L10N.InventoryMovement);
                    });
                    this.$scope.ChangeDates(this.$scope.Vm.Dates);
                };
                InventoryMovementController.prototype.GetView = function (view) {
                    this.$scope.Vm.SelectedView = view;
                    this.GetData(this.$scope.Vm.Dates[0], this.$scope.Vm.Dates[1]);
                };
                InventoryMovementController.prototype.GetData = function (dateFrom, dateTo) {
                    var _this = this;
                    this._reportIsBeingLoaded = true;
                    var viewId = this.$scope.Vm.SelectedView != null ? this.$scope.Vm.SelectedView.ViewId : null;
                    this._lastSearch = this.$scope.Vm.SearchText;
                    this.reportService.GetProductData(viewId, dateFrom, dateTo, this.ReportType, this._lastSearch)
                        .then(function (data) {
                        _this.$scope.Vm.Columns = data.Columns;
                        _this.$scope.Vm.CurrentEntity = data.CurrentEntity;
                        _this.$scope.Vm.ExportFileName = data.ExportFileName;
                        _this._data = data;
                        _this._products = data.Products;
                        _this._categoryList = [];
                        _.forEach(data.Groups, function (row) {
                            _this._categoryList.push({ GroupId: row.GroupId, GroupDescription: row.GroupDescription, SortOrder: row.SortOrder, Items: [] });
                        });
                        var index = 0;
                        _.forEach(data.Products, function (row) {
                            var category = _.find(_this._categoryList, function (x) { return x.GroupId === row.GroupId; });
                            category.Items.push(index);
                            index++;
                        });
                        _this.$scope.Vm.Categories = _this._categoryList;
                        _this.$scope.ShowTotals();
                        _this.ResetSortMap();
                        _this.$scope.Vm.ExportCurrentViewUri = _this.reportService.GetExportUri(viewId, dateFrom, dateTo, _this.ReportType);
                    }).finally(function () { return _this._reportIsBeingLoaded = false; });
                };
                InventoryMovementController.prototype.ResetSortMap = function () {
                    var _this = this;
                    if (this._category == null) {
                        return;
                    }
                    var fr = _.find(this._categoryList, function (x) { return x.GroupId === _this._category; });
                    this.$scope.Vm.SortMap = fr.Items;
                    this.ResetSortkeys();
                    this.$scope.SortBy('code');
                };
                InventoryMovementController.prototype.SetFavourite = function (viewId) {
                    _.each(this.$scope.Vm.Views, function (view) {
                        view.IsDefault = view.ViewId === viewId;
                    });
                };
                InventoryMovementController.prototype.ParseColumnValue = function (value, type) {
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
                InventoryMovementController.prototype.GetColumnValueByIndex = function (column, index) {
                    return this.ParseColumnValue(column.Values[index], column.ColumnValueType);
                };
                InventoryMovementController.prototype.GetParsedTotalByGroup = function (column, group) {
                    return this.ParseColumnValue(this.$scope.GetTotalByGroup(column, group), column.ColumnValueType);
                };
                return InventoryMovementController;
            }());
            Core.NG.OperationsReportingInventoryMovementModule.RegisterRouteController("", "Templates/InventoryMovement.html", InventoryMovementController, Core.NG.$typedScope(), Core.$translation, Core.$popupMessageService, Administration.User.Services.$userSettingService, Core.Auth.$authService, Core.Constants, Reporting.reportService, Core.NG.$state);
        })(InventoryMovement = Reporting.InventoryMovement || (Reporting.InventoryMovement = {}));
    })(Reporting = Operations.Reporting || (Operations.Reporting = {}));
})(Operations || (Operations = {}));
