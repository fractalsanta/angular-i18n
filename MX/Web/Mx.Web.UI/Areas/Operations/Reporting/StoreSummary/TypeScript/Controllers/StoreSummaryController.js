var Operations;
(function (Operations) {
    var Reporting;
    (function (Reporting) {
        var StoreSummary;
        (function (StoreSummary) {
            var StoreSummaryController = (function () {
                function StoreSummaryController($scope, translationService, popupMessageService, userSettingService, authService, constants, reportService, stateService) {
                    var _this = this;
                    this.$scope = $scope;
                    this.translationService = translationService;
                    this.popupMessageService = popupMessageService;
                    this.userSettingService = userSettingService;
                    this.authService = authService;
                    this.constants = constants;
                    this.reportService = reportService;
                    this.stateService = stateService;
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
                            _this.$scope.Vm.SortAscending = !_this.$scope.Vm.SortAscending;
                        }
                        else {
                            _this.$scope.Vm.SortColumnId = col.ColumnId;
                        }
                        _this.$scope.Vm.SortMap = _.chain(_this.$scope.Vm.SortMap)
                            .sortBy(function (val) { return val; })
                            .sortBy(function (val) { return _this.GetColumnValueByIndex(col, val); })
                            .value();
                        if (!_this.$scope.Vm.SortAscending) {
                            _this.$scope.Vm.SortMap.reverse();
                        }
                    };
                    this.$scope.ResetSort = function () {
                        if (_this.$scope.Vm.SortColumnId === null) {
                            _this.$scope.Vm.SortAscending = !_this.$scope.Vm.SortAscending;
                        }
                        _this.$scope.Vm.SortColumnId = null;
                        _this.ResetSortMap();
                        if (!_this.$scope.Vm.SortAscending) {
                            _this.$scope.Vm.SortMap.reverse();
                        }
                    };
                    this.$scope.GetSortedValueByIndex = function (column, index) {
                        return column.Values[index];
                    };
                    this.$scope.GetSortedRowByIndex = function (row) {
                        return moment(_this.$scope.Vm.ReportData.DateFrom).add({ days: row }).toDate();
                    };
                    this.$scope.GetView = function (view) { return _this.GetView(view); };
                    this.$scope.ShowManager = function () {
                        _this.reportService.DateFrom = _this.$scope.Vm.DateFrom;
                        _this.reportService.DateTo = _this.$scope.Vm.DateTo;
                        _this.stateService.go(Core.UiRouterState.ViewManagerStates.ViewManager, { ReportTypeId: Reporting.Api.Models.ReportType.StoreSummary });
                    };
                    this.$scope.ReportIsBeingLoaded = function () { return _this._reportIsBeingLoaded; };
                    this.$scope.FavouriteClick = function (event, view) {
                        if (view.IsDefault) {
                            view.IsDefault = false;
                            _this.userSettingService.SetUserSetting(Administration.User.Api.Models.UserSettingEnum.StoreSummaryFavouriteView, "");
                        }
                        else {
                            _this.SetFavourite(view.ViewId);
                            _this.userSettingService.SetUserSetting(Administration.User.Api.Models.UserSettingEnum.StoreSummaryFavouriteView, view.ViewId.toString());
                        }
                        event.preventDefault();
                        event.stopPropagation();
                    };
                    this.$scope.ExportData = function () {
                        var result = "", index = 0, c = 0;
                        var data = _this.$scope.Vm.ReportData;
                        result += _this.EncodeValue(_this.$scope.L10N.ColumnDate) + ",";
                        result += _this.EncodeValue(_this.$scope.L10N.ExportStoreName) + ",";
                        _.each(data.Columns, function (column) {
                            result += _this.EncodeValue(_this.$scope.L10N[column.ColumnLocalisationKey]) + ",";
                        });
                        if (result.length > 0) {
                            result = result.substr(0, result.length - 1);
                            result += "\n";
                        }
                        var entity = data.Entities[0];
                        var currentDate = moment(data.DateFrom);
                        var dateTo = moment(data.DateTo);
                        while (currentDate <= dateTo) {
                            result += _this.EncodeValue(currentDate.format("YYYY-MM-DD")) + ",";
                            result += _this.EncodeValue(entity.Number + "-" + entity.Name) + ",";
                            for (c = 0; c < data.Columns.length; c++) {
                                var value = data.Columns[c].Values[index];
                                result += _this.EncodeValue(value) + ",";
                            }
                            if (result.length > 0) {
                                result = result.substr(0, result.length - 1);
                                result += "\n";
                            }
                            index++;
                            currentDate = currentDate.add("days", 1);
                        }
                        var anchor = document.createElement('a');
                        anchor.setAttribute("style", "display:none");
                        anchor.setAttribute("href", 'data:attachment/csv,' + encodeURIComponent(result));
                        anchor.setAttribute("download", _this.$scope.Vm.ExportFileName);
                        document.body.appendChild(anchor);
                        anchor.click();
                        document.body.removeChild(anchor);
                    };
                }
                StoreSummaryController.prototype.Initialise = function () {
                    var _this = this;
                    this._reportIsBeingLoaded = false;
                    this.ReportType = Reporting.Api.Models.ReportType.StoreSummary;
                    var canEdit = this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Operations_StoreSummary_CanAccessViewManager);
                    this.$scope.Vm = {
                        DateFrom: null,
                        DateTo: null,
                        SelectedView: null,
                        ChangeDates: null,
                        Views: null,
                        ReportData: null,
                        SortMap: [],
                        SortColumnId: null,
                        SortAscending: true,
                        DateColumnType: Reporting.Api.Models.ReportColumnValueType.Date,
                        ShowViewManager: canEdit,
                        ExportCurrentViewUri: null,
                        ExportFileName: ""
                    };
                    var viewPromise = this.reportService.GetViews(this.ReportType)
                        .then(function (views) {
                        _this.$scope.Vm.Views = views;
                        return _this.userSettingService.GetUserSetting(Administration.User.Api.Models.UserSettingEnum.StoreSummaryFavouriteView);
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
                        this.$scope.Vm.DateFrom = this.reportService.DateFrom;
                    }
                    if (this.reportService.DateTo != null) {
                        this.$scope.Vm.DateTo = this.reportService.DateTo;
                    }
                    this.$scope.Vm.ChangeDates = function (startDate, endDate) {
                        _this.$scope.Vm.DateFrom = startDate;
                        _this.$scope.Vm.DateTo = endDate;
                        viewPromise.then(function () {
                            _this.GetData(startDate, endDate);
                        });
                    };
                    this.translationService.GetTranslations().then(function (l10N) {
                        _this.$scope.L10N = l10N.OperationsReportingStoreSummary;
                        _this.popupMessageService.SetPageTitle(_this.$scope.L10N.StoreSummary);
                    });
                };
                StoreSummaryController.prototype.GetView = function (view) {
                    this.$scope.Vm.SelectedView = view;
                    this.GetData(this.$scope.Vm.DateFrom, this.$scope.Vm.DateTo);
                };
                StoreSummaryController.prototype.GetData = function (dateFrom, dateTo) {
                    var _this = this;
                    this._reportIsBeingLoaded = true;
                    var viewId = this.$scope.Vm.SelectedView != null ? this.$scope.Vm.SelectedView.ViewId : null;
                    this.reportService.GetReportData(viewId, dateFrom, dateTo, this.ReportType)
                        .then(function (data) {
                        _this.$scope.Vm.ReportData = data;
                        _this.$scope.Vm.ExportFileName = data.ExportFileName;
                        _this.ResetSortMap();
                        _this.$scope.Vm.ExportCurrentViewUri = _this.reportService.GetExportUri(viewId, dateFrom, dateTo, _this.ReportType);
                    }).finally(function () { return _this._reportIsBeingLoaded = false; });
                };
                StoreSummaryController.prototype.SetFavourite = function (viewId) {
                    _.each(this.$scope.Vm.Views, function (view) {
                        view.IsDefault = view.ViewId === viewId;
                    });
                };
                StoreSummaryController.prototype.ResetSortMap = function () {
                    this.$scope.Vm.SortMap = _.range(moment(this.$scope.Vm.ReportData.DateTo).diff(moment(this.$scope.Vm.ReportData.DateFrom), "days") + 1);
                };
                StoreSummaryController.prototype.GetColumnValueByIndex = function (column, index) {
                    switch (column.ColumnValueType) {
                        case Reporting.Api.Models.ReportColumnValueType.Currency:
                        case Reporting.Api.Models.ReportColumnValueType.Decimal:
                        case Reporting.Api.Models.ReportColumnValueType.Integer:
                        case Reporting.Api.Models.ReportColumnValueType.Percentage:
                        case Reporting.Api.Models.ReportColumnValueType.Date:
                            return parseFloat(column.Values[index]) || 0;
                        case Reporting.Api.Models.ReportColumnValueType.String:
                            return column.Values[index].toString();
                        default:
                            return 0;
                    }
                };
                return StoreSummaryController;
            }());
            Core.NG.OperationsReportingStoreSummaryModule.RegisterRouteController("", "Templates/StoreSummary.html", StoreSummaryController, Core.NG.$typedScope(), Core.$translation, Core.$popupMessageService, Administration.User.Services.$userSettingService, Core.Auth.$authService, Core.Constants, Reporting.reportService, Core.NG.$state);
        })(StoreSummary = Reporting.StoreSummary || (Reporting.StoreSummary = {}));
    })(Reporting = Operations.Reporting || (Operations.Reporting = {}));
})(Operations || (Operations = {}));
