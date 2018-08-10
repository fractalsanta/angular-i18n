var Reporting;
(function (Reporting) {
    var Dashboard;
    (function (Dashboard) {
        (function (EntityType) {
            EntityType[EntityType["Company"] = 1] = "Company";
            EntityType[EntityType["Regions"] = 2] = "Regions";
            EntityType[EntityType["Areas"] = 3] = "Areas";
            EntityType[EntityType["Stores"] = 4] = "Stores";
        })(Dashboard.EntityType || (Dashboard.EntityType = {}));
        var EntityType = Dashboard.EntityType;
        var DashboardController = (function () {
            function DashboardController(scope, translationService, apiMeasuresService, apiReferenceService, popupMessageService, graphService, authService, constants) {
                var _this = this;
                this.scope = scope;
                this.translationService = translationService;
                this.apiMeasuresService = apiMeasuresService;
                this.apiReferenceService = apiReferenceService;
                this.popupMessageService = popupMessageService;
                this.graphService = graphService;
                this.authService = authService;
                this.constants = constants;
                this._classBgLookup = { 'n': 'mx-bg-default', 'g': 'mx-bg-success', 'r': 'mx-bg-danger' };
                this._classColorLookup = { 'n': 'mx-col-default', 'g': 'mx-col-success', 'r': 'mx-col-danger' };
                this.Initialize();
                this.SetUpScopeFunctions();
                this.SetUpWatchers();
                var model = this.scope.Model;
                apiReferenceService.Get().then(function (result) {
                    model.Intervals = result.data.Intervals;
                    var today = moment(result.data.Today);
                    model.TodayMoment = today;
                    model.YesterdayMoment = moment(today).subtract("days", 1);
                    model.Groups = _.where(result.data.Groups, function (g) { return g.Measures.length > 0; });
                    _this._groupSelected = model.Groups.length > 0 ? model.Groups[0] : null;
                    _this._measureSelected = _this._groupSelected.Measures[0];
                    if (model.Groups.length > 0) {
                        model.CurrentGroupIndex = 0;
                        model.CurrentMeasureIndex = 0;
                        _this.FetchEntities(model.Groups[0].Id, null, null);
                        model.SelectedMeasureId = _this._groupSelected.Measures[0].Id;
                    }
                    if (result.data.Intervals.length > 0) {
                        model.CurrentInterval = result.data.Intervals[0];
                        scope.SetInterval(Dashboard.Api.Models.ReferenceInterval.Today);
                    }
                });
            }
            DashboardController.prototype.Initialize = function () {
                var _this = this;
                var businessUser = this.authService.GetUser().BusinessUser;
                this.scope.Model = {
                    ShowBars: false,
                    CurrentInterval: Dashboard.Api.Models.ReferenceInterval.Today,
                    ChartMode: "V",
                    ChartOptions: {},
                    ChartPoints: [],
                    MaxMeasure: 0,
                    IsGraphMode: false,
                    Interval: "...",
                    SelectedMeasureId: "",
                    UserLevel: businessUser.EntityTypeId || EntityType.Stores
                };
                this.scope.Loc = {};
                this.translationService.GetTranslations().then(function (result) {
                    _this.scope.Loc = result.Dashboard;
                    _this.SetTitle();
                    _this.scope.TypeDisplay = function (typeId) {
                        var key = EntityType[typeId];
                        return _this.scope.Loc ? _this.scope.Loc[key] : key;
                    };
                });
            };
            DashboardController.prototype.SetTitle = function () {
                var title = this.scope.Loc.Dashboard;
                if (this.scope.Model.CurrentEntity) {
                    title += " - " + this.scope.Model.CurrentEntity.Name;
                }
                this.popupMessageService.SetPageTitle(title);
            };
            DashboardController.prototype.Display = function (item) {
                var result;
                if (item == null && this._measureSelected != null) {
                    item = this._measureSelected.Id;
                }
                if (item && this.scope.Loc) {
                    result = this.scope.Loc[item + "DisplayName"];
                }
                return result ? result : item;
            };
            DashboardController.prototype.FindMeasure = function (entity, index) {
                var kpiName = this.scope.Model.Groups[this.scope.Model.CurrentGroupIndex].Measures[index].Id;
                return _.find(entity.Measures, { Id: kpiName });
            };
            DashboardController.prototype.GetOptions = function (points) {
                var title = this.scope.CurrentMeasure()
                    ? this.scope.Display(this.scope.CurrentMeasure().Id) + " - " + this.scope.ChartName(this.scope.CurrentMeasure().Id)
                    : "";
                switch (this.scope.Model.ChartMode) {
                    case "V": return this.graphService.GetVerticalBarGraphOptions(points, title);
                    case "L": return this.graphService.GetLineGraphOptions(points, title);
                    case "B": return this.graphService.GetBarGraphOptions(points, title);
                    case "P": return this.graphService.GetPieChartOptions(points, title);
                    default: return {};
                }
            };
            DashboardController.prototype.RedrawGraph = function () {
                if (this.scope != null && this.scope.Model != null) {
                    this.scope.Model.ChartOptions = this.GetOptions(this.scope.Model.ChartPoints);
                    this.scope.GraphSrc = '/Areas/Reporting/Dashboard/Templates/Graph.html?t=' + moment().valueOf();
                }
            };
            DashboardController.prototype.EmptyModel = function (scope) {
                return (scope.Model.Groups == null
                    || scope.Model.CurrentGroupIndex == null
                    || scope.Model.CurrentMeasureIndex == null
                    || scope.Model.EntityMeasures == null);
            };
            DashboardController.prototype.CalcMax = function () {
                var _this = this;
                if (this.scope != null && this.scope.Model != null) {
                    if (this.EmptyModel(this.scope)) {
                        this.scope.Model.MaxMeasure = null;
                        return;
                    }
                    var projection = function (entity) { return _.find(entity.Measures[_this.scope.Model.CurrentMeasureIndex].Intervals, { Id: _this.scope.Model.CurrentInterval }).Value; };
                    var values = _.map(this.scope.Model.EntityMeasures, projection);
                    this.scope.Model.MaxMeasure = _.max(values);
                }
            };
            DashboardController.prototype.FetchGraph = function (entity) {
                var _this = this;
                this.scope.GraphSrc = "/Blank.html";
                if (entity) {
                    var date = this.scope.IsToday() ? this.scope.Model.TodayMoment : moment(this.scope.Model.TodayMoment).subtract("days", 1);
                    this.apiMeasuresService.GetMeasureDrilldown(entity.Id, date.format(this.constants.InternalDateFormat), this.scope.CurrentMeasure().Id).then(function (result) {
                        if (result && result.data) {
                            _this.scope.Model.ChartPoints = result.data.Points;
                            _this.RedrawGraph();
                        }
                    });
                }
            };
            DashboardController.prototype.FetchEntities = function (groupId, entityId, typeId) {
                var _this = this;
                var model = this.scope.Model;
                model.CurrentGroupIndex = _.findIndex(model.Groups, { Id: groupId });
                if (this.scope.IsGraphMode() && model.CurrentEntity) {
                    this.FetchGraph(model.CurrentEntity);
                }
                model.CurrentEntity = null;
                model.EntityMeasures = null;
                model.EntityGroups = null;
                var dateString = model.TodayMoment.format(this.constants.InternalDateFormat);
                var requestEntityId = (entityId == null) ? 0 : entityId;
                var requestTypeId = (typeId == null) ? model.UserLevel : typeId;
                var promise = this.apiMeasuresService.GetMeasures(requestEntityId, requestTypeId, groupId, dateString);
                promise.then(function (result) {
                    model.EntityMeasures = result.data;
                    _this.CalcMax();
                    if (model.EntityMeasures && model.EntityMeasures.length > 0) {
                        model.CurrentEntity = requestEntityId ?
                            _.find(model.EntityMeasures, { Id: requestEntityId }) :
                            _.find(model.EntityMeasures, function (e) { return e.TypeId == model.UserLevel; });
                        var groups = _.groupBy(model.EntityMeasures, "TypeId");
                        var title = _this.scope.CurrentMeasure()
                            ? _this.scope.Display(_this.scope.CurrentMeasure().Id) + " - " + _this.scope.ChartName(_this.scope.CurrentMeasure().Id)
                            : "";
                        _this.graphService.SetChartTitle(model.ChartOptions, title);
                        model.EntityGroups = _.map(groups, function (entities, type) {
                            var group = {
                                TypeId: type,
                                Entities: entities
                            };
                            return group;
                        });
                        _this.SetTitle();
                    }
                    else {
                        _this.scope.SetStoreMode();
                    }
                });
                return promise;
            };
            DashboardController.prototype.Measures = function () {
                return this.EmptyModel(this.scope) ? [] : this._groupSelected.Measures;
            };
            DashboardController.prototype.CurrentMeasure = function () {
                return this.EmptyModel(this.scope) ? null : this._measureSelected;
            };
            DashboardController.prototype.SetGroup = function (group) {
                var _this = this;
                if (group != null) {
                    var groupId = group.Id;
                    this._groupSelected = group;
                    this.scope.Model.CurrentMeasureIndex = 0;
                    var current = this.scope.Model.CurrentEntity;
                    if (current) {
                        if (this.scope.IsGraphMode()) {
                            this.FetchEntities(groupId, current.ParentId, current.TypeId - 1).then(function () {
                                _this.scope.Model.CurrentEntity = _.find(_this.scope.Model.EntityMeasures, { Id: current.Id });
                                _this.SetTitle();
                            });
                        }
                        else if (this.scope.IsStoreMode()) {
                            this.FetchEntities(groupId, current.Id, current.TypeId);
                        }
                    }
                    else {
                        this.FetchEntities(groupId, null, null);
                    }
                }
            };
            DashboardController.prototype.SelectMeasure = function (measure) {
                var _this = this;
                this._measureSelected = measure;
                this.scope.Model.SelectedMeasureId = measure.Id;
                var i = 0;
                _.each(this.scope.Model.Groups, function (x) {
                    if (_.any(x.Measures, function (m) { return m.Id == measure.Id; })) {
                        var measureIndex = _.findIndex(x.Measures, function (m) { return m.Id == measure.Id; });
                        if (_this.scope.Model.CurrentGroupIndex == i) {
                            if (_this.scope.IsGraphMode()) {
                                _this.FetchGraph(_this.scope.Model.CurrentEntity);
                            }
                        }
                        else {
                            _this.scope.Model.CurrentGroupIndex = i;
                            _this.scope.SetGroup(x);
                        }
                        _this.scope.Model.CurrentMeasureIndex = measureIndex;
                    }
                    i++;
                });
            };
            DashboardController.prototype.SetGraphMeasure = function (measure, index) {
                if (this.scope.Model.CurrentEntity) {
                    this._measureSelected = measure;
                    this.scope.Model.CurrentMeasureIndex = index;
                    this.scope.SelectMeasure(measure);
                }
            };
            DashboardController.prototype.DrillDown = function (entity) {
                if (entity.TypeId == EntityType.Stores) {
                    this.scope.Model.CurrentEntity = entity;
                    this.scope.SetGraphMode();
                    this.FetchGraph(entity);
                }
                else {
                    var group = this._groupSelected.Id;
                    this.FetchEntities(group, entity.Id, entity.TypeId);
                }
            };
            DashboardController.prototype.SetUpScopeFunctions = function () {
                var _this = this;
                var scope = this.scope;
                var model = this.scope.Model;
                scope.Display = function (item) { return _this.Display(item); };
                scope.ChartName = function (item) {
                    var result = scope ? scope.Loc[item + "ChartSubTitle"] : null;
                    return result ? result : item;
                };
                scope.SetChartMode = function (mode) { return model.ChartMode = mode; };
                scope.GetChartClass = function (mode) {
                    if (mode === void 0) { mode = model.ChartMode; }
                    return {
                        'V': 'icons-vertical-bars',
                        'B': 'icons-horizontal-bars',
                        'L': 'icons-line-graph',
                        'P': 'icons-pie-chart'
                    }[mode];
                };
                scope.IsToday = function () { return model.CurrentInterval != Dashboard.Api.Models.ReferenceInterval.Yesterday; };
                scope.IsGraphMode = function () { return model.IsGraphMode; };
                scope.IsStoreMode = function () { return !model.IsGraphMode; };
                scope.IsTopLevel = function () { return (!model.IsGraphMode) && (!scope.IsUpButtonVisible()); };
                scope.SetStoreMode = function () {
                    model.IsGraphMode = false;
                    if (model.CurrentEntity && model.CurrentEntity.TypeId == EntityType.Stores) {
                        model.CurrentEntity = _.find(model.EntityMeasures, { Id: model.CurrentEntity.ParentId });
                    }
                    _this.SetTitle();
                };
                scope.SetGraphMode = function () {
                    if (!(model.CurrentInterval === Dashboard.Api.Models.ReferenceInterval.Today || model.CurrentInterval === Dashboard.Api.Models.ReferenceInterval.Yesterday)) {
                        scope.SetInterval(Dashboard.Api.Models.ReferenceInterval.Today);
                    }
                    model.IsGraphMode = true;
                    _this.SetTitle();
                };
                scope.IsUpButtonVisible = function () { return scope.IsStoreMode() && model.CurrentEntity && model.CurrentEntity.TypeId != model.UserLevel; };
                scope.Measures = function () { return _this.Measures(); };
                scope.CurrentMeasure = function () { return _this.CurrentMeasure(); };
                scope.SetGroup = function (group) { return _this.SetGroup(group); };
                scope.GoUp = function () {
                    if (scope.IsTopLevel()) {
                        return;
                    }
                    if (scope.IsGraphMode()) {
                        scope.SetStoreMode();
                        return;
                    }
                    var current = model.CurrentEntity;
                    if (current) {
                        var groupId = model.Groups[model.CurrentGroupIndex].Id;
                        _this.FetchEntities(groupId, current.ParentId, current.TypeId - 1);
                    }
                };
                scope.SelectMeasure = function (measure) { return _this.SelectMeasure(measure); };
                scope.SetGraphMeasure = function (measure, index) { return _this.SetGraphMeasure(measure, index); };
                scope.Value = function (entity, index, interval) {
                    if (index === void 0) { index = model.CurrentMeasureIndex; }
                    if (interval === void 0) { interval = model.CurrentInterval; }
                    if (model.EntityMeasures == null) {
                        return "";
                    }
                    ;
                    var measure = _this.FindMeasure(entity, index);
                    return _.find(measure.Intervals, { Id: interval }).DisplayValue;
                };
                scope.ValueWidth = function (entity) {
                    if (!model.EntityMeasures || !model.MaxMeasure) {
                        return 0;
                    }
                    ;
                    var measure = _this.FindMeasure(entity, model.CurrentMeasureIndex);
                    return Math.round(_.find(measure.Intervals, { Id: model.CurrentInterval }).Value * 100 / model.MaxMeasure);
                };
                scope.ValueClass = function (entity, index, interval) {
                    if (index === void 0) { index = model.CurrentMeasureIndex; }
                    if (interval === void 0) { interval = model.CurrentInterval; }
                    if (model.EntityMeasures == null) {
                        return "";
                    }
                    ;
                    var measure = _this.FindMeasure(entity, index);
                    var value = _.find(measure.Intervals, { Id: interval }).Class;
                    return _this._classColorLookup[value];
                };
                scope.ValueClassBg = function (entity, index, interval) {
                    if (index === void 0) { index = model.CurrentMeasureIndex; }
                    if (interval === void 0) { interval = model.CurrentInterval; }
                    if (model.EntityMeasures == null) {
                        return "";
                    }
                    ;
                    var measure = _this.FindMeasure(entity, index);
                    var value = _.find(measure.Intervals, { Id: interval }).Class;
                    return _this._classBgLookup[value];
                };
                scope.SetInterval = function (interval) {
                    model.CurrentInterval = interval;
                    model.Interval = scope.Loc[Dashboard.Api.Models.ReferenceInterval[interval]];
                    _this.CalcMax();
                    if (scope.IsGraphMode()) {
                        _this.FetchGraph(model.CurrentEntity);
                    }
                };
                scope.DrillDown = function (entity) { return _this.DrillDown(entity); };
                scope.RedrawGraph = function () { return _this.RedrawGraph(); };
                scope.CalcMax = function () { return _this.CalcMax(); };
            };
            DashboardController.prototype.SetUpWatchers = function () {
                this.scope.$watch('Model.ChartMode', this.scope.RedrawGraph);
                this.scope.$watch('Model.CurrentMeasureIndex', this.scope.CalcMax);
            };
            return DashboardController;
        }());
        Dashboard.DashboardController = DashboardController;
        Core.NG.ReportingDashboardModule.RegisterRouteController("", "Templates/Dashboard.html", DashboardController, Core.NG.$typedScope(), Core.$translation, Dashboard.Api.$measuresService, Dashboard.Api.$referenceDataService, Core.$popupMessageService, Dashboard.$dashboardService, Core.Auth.$authService, Core.Constants);
    })(Dashboard = Reporting.Dashboard || (Reporting.Dashboard = {}));
})(Reporting || (Reporting = {}));
