var Operations;
(function (Operations) {
    var Reporting;
    (function (Reporting) {
        var AreaSummary;
        (function (AreaSummary) {
            var AreaSummaryController = (function () {
                function AreaSummaryController($scope, translationService, popupMessageService, authService, reportService, userSettingService, stateService, entityService, $q) {
                    var _this = this;
                    this.$scope = $scope;
                    this.translationService = translationService;
                    this.popupMessageService = popupMessageService;
                    this.authService = authService;
                    this.reportService = reportService;
                    this.userSettingService = userSettingService;
                    this.stateService = stateService;
                    this.entityService = entityService;
                    this.$q = $q;
                    this.EncodeValue = function (value) {
                        if (value == null)
                            return "";
                        if (typeof (value) === "string") {
                            value = "\"" + value.replace(",", "").replace("\"", "") + "\"";
                        }
                        return value;
                    };
                    this.Initialize();
                    translationService.GetTranslations().then(function (l10N) {
                        $scope.L10N = l10N.OperationsReportingAreaSummary;
                        popupMessageService.SetPageTitle($scope.L10N.AreaSummary);
                    });
                    this.$scope.ReportIsBeingLoaded = function () { return _this._reportIsBeingLoaded; };
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
                        _this.$scope.ChangePage(1);
                    };
                    this.$scope.ResetSort = function () {
                        if (_this.$scope.Vm.SortColumnId === null) {
                            _this.$scope.Vm.SortAscending = !_this.$scope.Vm.SortAscending;
                        }
                        _this.$scope.Vm.SortColumnId = null;
                        _this.ResetSortMap();
                        _this.$scope.ChangePage(1);
                    };
                    this.$scope.ShowManager = function () {
                        _this.reportService.DateFrom = $scope.Vm.Date;
                        _this.reportService.DateTo = $scope.Vm.Date;
                        _this.stateService.go(Core.UiRouterState.ViewManagerStates.ViewManager, { ReportTypeId: Reporting.Api.Models.ReportType.AreaSummary });
                    };
                    this.$scope.GetSortedRowByIndex = function (row) {
                        return _this.$scope.Vm.ReportData.Entities[row].Name;
                    };
                    this.$scope.GetSortedValueByIndex = function (column, index) {
                        return column.Values[index];
                    };
                    this.$scope.GetView = function (view) { return _this.GetView(view); };
                    this.$scope.GetArea = function (area) { return _this.GetArea(area); };
                    this.$scope.RequiresPaging = function () {
                        if (!$scope.Vm.ReportData) {
                            return false;
                        }
                        return ($scope.Vm.ReportData.Entities.length > $scope.Vm.PagingOptions.itemsPerPage);
                    };
                    this.$scope.ChangePage = function (page) {
                        $scope.Vm.CurrentPage = page;
                        var index = (page - 1) * $scope.Vm.PagingOptions.itemsPerPage;
                        $scope.Vm.CurrentPageSortMap = $scope.Vm.SortMap.slice(index, index + $scope.Vm.PagingOptions.itemsPerPage);
                    };
                    this.$scope.ExportData = function () {
                        var result = "";
                        var data = _this.$scope.Vm.ReportData;
                        result += _this.EncodeValue(_this.$scope.L10N.ExportStoreName) + ",";
                        result += _this.EncodeValue(_this.$scope.L10N.ColumnDate) + ",";
                        _.each(data.Columns, function (column) {
                            result += _this.EncodeValue(_this.$scope.L10N[column.ColumnLocalisationKey]) + ",";
                        });
                        if (result.length > 0) {
                            result = result.substr(0, result.length - 1);
                            result += "\n";
                        }
                        _.each($scope.Vm.SortMap, function (index) {
                            var entity = data.Entities[index];
                            var currentDate = moment($scope.Vm.Date);
                            result += _this.EncodeValue(entity.Number + "-" + entity.Name) + ",";
                            result += _this.EncodeValue(currentDate.format("YYYY-MM-DD")) + ",";
                            _.each(data.Columns, function (column) {
                                result += _this.EncodeValue(column.Values[index]) + ",";
                            });
                            if (result.length > 0) {
                                result = result.substr(0, result.length - 1);
                                result += "\n";
                            }
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
                AreaSummaryController.prototype.Initialize = function () {
                    var _this = this;
                    this._reportIsBeingLoaded = false;
                    this.ReportType = Reporting.Api.Models.ReportType.AreaSummary;
                    var canAccessViewManager = this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Operations_AreaSummary_CanAccessViewManager);
                    this.$scope.Vm = {
                        Views: null,
                        SelectedView: null,
                        Date: moment().toDate(),
                        ReportData: null,
                        Areas: null,
                        SelectedArea: null,
                        SortMap: null,
                        SortAscending: true,
                        SortColumnId: null,
                        CurrentPage: 1,
                        CurrentPageSortMap: null,
                        DatePickerOptions: {
                            Date: moment().toDate(),
                            DayOffset: 1,
                            MonthOffset: 0
                        },
                        PagingOptions: {
                            itemsPerPage: 20,
                            numPages: 5
                        },
                        ShowViewManager: canAccessViewManager,
                        ExportCurrentViewUri: null,
                        ExportFileName: ""
                    };
                    var promises = [];
                    promises.push(this.entityService.GetEntitiesByEntityType(Core.Api.Models.EntityType.Master)
                        .success(function (areas) {
                        _this.$scope.Vm.Areas = areas;
                        if (areas && areas.length > 0) {
                            _this.$scope.Vm.SelectedArea = areas[0];
                        }
                    }));
                    promises.push(this.reportService.GetViews(this.ReportType)
                        .then(function (views) {
                        _this.$scope.Vm.Views = views;
                        return _this.userSettingService.GetUserSetting(Administration.User.Api.Models.UserSettingEnum.AreaSummaryFavoriteView);
                    })
                        .then(function (favorite) {
                        var viewId = Number(favorite);
                        if (favorite) {
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
                    }));
                    this.$q.all(promises).then(function () {
                        _this.GetData(_this.$scope.Vm.DatePickerOptions.Date);
                    });
                    if (this.reportService.DateFrom != null) {
                        this.$scope.Vm.Date = this.reportService.DateFrom;
                        this.$scope.Vm.DatePickerOptions.Date = this.reportService.DateFrom;
                    }
                    this.$scope.ChangeDate = function (date) {
                        _this.$scope.Vm.Date = date;
                        _this.GetData(date);
                    };
                    this.$scope.FavouriteClick = function (event, view) {
                        if (view.IsDefault) {
                            view.IsDefault = false;
                            _this.userSettingService.SetUserSetting(Administration.User.Api.Models.UserSettingEnum.AreaSummaryFavoriteView, "");
                        }
                        else {
                            _this.SetFavourite(view.ViewId);
                            _this.userSettingService.SetUserSetting(Administration.User.Api.Models.UserSettingEnum.AreaSummaryFavoriteView, view.ViewId.toString());
                        }
                        event.preventDefault();
                        event.stopPropagation();
                    };
                };
                AreaSummaryController.prototype.GetView = function (view) {
                    this.$scope.Vm.SelectedView = view;
                    this.GetData(this.$scope.Vm.Date);
                };
                AreaSummaryController.prototype.GetArea = function (area) {
                    this.$scope.Vm.SelectedArea = area;
                    this.GetData(this.$scope.Vm.Date);
                };
                AreaSummaryController.prototype.SetFavourite = function (viewId) {
                    _.each(this.$scope.Vm.Views, function (view) {
                        view.IsDefault = view.ViewId === viewId;
                    });
                };
                AreaSummaryController.prototype.GetData = function (date) {
                    var _this = this;
                    this._reportIsBeingLoaded = true;
                    var viewId = this.$scope.Vm.SelectedView != null ? this.$scope.Vm.SelectedView.ViewId : null;
                    var entityId = this.$scope.Vm.SelectedArea != null ? this.$scope.Vm.SelectedArea.Id : null;
                    this.reportService.GetReportDataForEntity(entityId, viewId, date, date, this.ReportType)
                        .then(function (data) {
                        _this.$scope.Vm.ReportData = data;
                        _this.$scope.Vm.ExportFileName = data.ExportFileName;
                        _this.ResetSortMap();
                        _this.$scope.ChangePage(1);
                        _this.$scope.Vm.ExportCurrentViewUri = _this.reportService.GetExportUriForEntity(entityId, viewId, date, date, _this.ReportType);
                    }).finally(function () { return _this._reportIsBeingLoaded = false; });
                };
                AreaSummaryController.prototype.ResetSortMap = function () {
                    var _this = this;
                    if (this.$scope.Vm.ReportData) {
                        var sort = _.range(this.$scope.Vm.ReportData.Entities.length);
                        if (this.$scope.Vm.SortColumnId) {
                            this.$scope.SortRows(this.$scope.Vm.ReportData.Columns[this.$scope.Vm.SortColumnId - 1]);
                        }
                        else {
                            this.$scope.Vm.SortMap = _.chain(sort)
                                .sortBy(function (val) { return _this.$scope.Vm.ReportData.Entities[val].Name; })
                                .value();
                            if (!this.$scope.Vm.SortAscending) {
                                this.$scope.Vm.SortMap.reverse();
                            }
                        }
                    }
                };
                AreaSummaryController.prototype.GetColumnValueByIndex = function (column, index) {
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
                return AreaSummaryController;
            }());
            Core.NG.OperationsReportingAreaSummaryModule.RegisterRouteController("", "Templates/AreaSummary.html", AreaSummaryController, Core.NG.$typedScope(), Core.$translation, Core.$popupMessageService, Core.Auth.$authService, Reporting.reportService, Administration.User.Services.$userSettingService, Core.NG.$state, Core.Api.$entityService, Core.NG.$q);
        })(AreaSummary = Reporting.AreaSummary || (Reporting.AreaSummary = {}));
    })(Reporting = Operations.Reporting || (Operations.Reporting = {}));
})(Operations || (Operations = {}));
