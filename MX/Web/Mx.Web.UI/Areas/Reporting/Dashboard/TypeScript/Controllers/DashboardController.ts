module Reporting.Dashboard {

    // TODO: move this enum to the Service LayerTypeDisplay
    export enum EntityType {
        Company = 1,
        Regions = 2,
        Areas = 3,
        Stores = 4
    }

    export interface IEntityGroup {
        TypeId: EntityType;
        Entities: Api.Models.IEntityMeasure[];
    }

    export interface IViewModel {
        TodayMoment?: Moment;
        YesterdayMoment?: Moment;

        Groups?: Api.Models.IReferenceGroup[];
        Intervals?: Api.Models.ReferenceInterval[];
        EntityMeasures?: Api.Models.IEntityMeasure[];
        EntityGroups?: IEntityGroup[];
        MaxMeasure: number;

        ShowBars: boolean;
        UserLevel: EntityType;
        IsGraphMode: boolean;

        CurrentGroupIndex?: number;
        CurrentMeasureIndex?: number;
        CurrentInterval: Api.Models.ReferenceInterval;
        Interval: string;
        SelectedMeasureId: string;
        CurrentEntity?: Api.Models.IEntityMeasure;

        ChartPoints: Api.Models.IGraphPoint[];
        ChartMode: string;
        ChartOptions: any;
    }

    export interface IDashboardScope extends ng.IScope {
        Model: IViewModel;
        Loc: Api.Models.IL10N;
        GraphSrc: string;

        IsToday(): boolean;
        IsGraphMode(): boolean;
        IsStoreMode(): boolean;
        IsTopLevel(): boolean;
        SetStoreMode(): void;
        SetGraphMode(): void;

        DrillDown(entity: Api.Models.IEntityMeasure): void;
        GoUp(): void;
        IsUpButtonVisible(): boolean;
        SetGroup(group: Api.Models.IReferenceGroup): void;
        SetInterval(interval: Api.Models.ReferenceInterval): void;

        // Measure Navigation
        SelectMeasure(measure: Api.Models.IReferenceMeasure): void;
        SetGraphMeasure(measure: Api.Models.IReferenceMeasure, index: number);
        Measures(): Api.Models.IReferenceMeasure[];
        CurrentMeasure(): Api.Models.IReferenceMeasure;

        // Value Helpers
        Value(entity: Api.Models.IEntityMeasure, index: number): string;
        ValueWidth(entity: Api.Models.IEntityMeasure): number;
        ValueClass(entity: Api.Models.IEntityMeasure, index: number): string;
        ValueClassBg(entity: Api.Models.IEntityMeasure, index: number): string;

        // Translation Helpers
        Display(item: string): string;
        ChartName(item: string): string;
        TypeDisplay(typeId: EntityType): string;

        SetChartMode(mode: string): void;
        GetChartClass(): string;

        RedrawGraph(): void;
        CalcMax(): void;
    }

    export class DashboardController {

        private _classBgLookup = { 'n': 'mx-bg-default', 'g': 'mx-bg-success', 'r': 'mx-bg-danger' };
        private _classColorLookup = { 'n': 'mx-col-default', 'g': 'mx-col-success', 'r': 'mx-col-danger' };
        private _measureSelected: Api.Models.IReferenceMeasure;
        private _groupSelected: Api.Models.IReferenceGroup;

        private Initialize() {

            var businessUser = this.authService.GetUser().BusinessUser;

            this.scope.Model = {
                ShowBars: false,
                CurrentInterval: Api.Models.ReferenceInterval.Today,
                ChartMode: "V",
                ChartOptions: {},
                ChartPoints: [],
                MaxMeasure: 0,
                IsGraphMode: false,
                Interval: "...",
                SelectedMeasureId: "",
                UserLevel: businessUser.EntityTypeId || EntityType.Stores
            };

            this.scope.Loc = <any>{};

            this.translationService.GetTranslations().then(result => {
                this.scope.Loc = result.Dashboard;
                this.SetTitle();
                this.scope.TypeDisplay = (typeId: number) => {
                    var key = EntityType[typeId];
                    return this.scope.Loc ? this.scope.Loc[key] : key;
                };
            });
        }

        private SetTitle() {
            var title = this.scope.Loc.Dashboard;
            if (this.scope.Model.CurrentEntity) {
                title += " - " + this.scope.Model.CurrentEntity.Name;
            }
            this.popupMessageService.SetPageTitle(title);
        }

        private Display(item: string) {
            var result;
            if (item == null && this._measureSelected != null) {
                item = this._measureSelected.Id;
            }
            if (item && this.scope.Loc) {
                result = this.scope.Loc[item + "DisplayName"];
            }
            return result ? result : item;

        }

        private FindMeasure(entity: Api.Models.IEntityMeasure, index: number) {
            var kpiName = this.scope.Model.Groups[this.scope.Model.CurrentGroupIndex].Measures[index].Id;
            return _.find(entity.Measures, { Id: kpiName });
        }

        private GetOptions(points: Api.Models.IGraphPoint[]) {
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
        }

        private RedrawGraph() {
            if (this.scope != null && this.scope.Model != null) {
                this.scope.Model.ChartOptions = this.GetOptions(this.scope.Model.ChartPoints);
                // rebuild Kendo Graph by requesting a unique template URL every time
                this.scope.GraphSrc = '/Areas/Reporting/Dashboard/Templates/Graph.html?t=' + moment().valueOf();
            }
        }

        private EmptyModel(scope: IDashboardScope) {
            return (scope.Model.Groups == null
                || scope.Model.CurrentGroupIndex == null
                || scope.Model.CurrentMeasureIndex == null
                || scope.Model.EntityMeasures == null);
        }

        private CalcMax() {
            if (this.scope != null && this.scope.Model != null) {
                if (this.EmptyModel(this.scope)) {
                    this.scope.Model.MaxMeasure = null;
                    return;
                }
                var projection = (entity: Api.Models.IEntityMeasure) => _.find(entity.Measures[this.scope.Model.CurrentMeasureIndex].Intervals, { Id: this.scope.Model.CurrentInterval }).Value;
                var values = _.map(this.scope.Model.EntityMeasures, projection);
                this.scope.Model.MaxMeasure = _.max(values);
            }
        }

        private FetchGraph(entity: Api.Models.IEntityMeasure) {
            this.scope.GraphSrc = "/Blank.html";
            if (entity) {
                var date = this.scope.IsToday() ? this.scope.Model.TodayMoment : moment(this.scope.Model.TodayMoment).subtract("days", 1);
                this.apiMeasuresService.GetMeasureDrilldown(entity.Id, date.format(this.constants.InternalDateFormat), this.scope.CurrentMeasure().Id).then(result => {
                    if (result && result.data) {
                        this.scope.Model.ChartPoints = result.data.Points;
                        this.RedrawGraph();
                    }
                });
            }
        }

        private FetchEntities(groupId: number, entityId: number, typeId: number) {
            var model = this.scope.Model;

            model.CurrentGroupIndex = _.findIndex(model.Groups, { Id: groupId });
            if (this.scope.IsGraphMode() && model.CurrentEntity) {
                // retrieve the graph data for the current entity, while its being updated
                this.FetchGraph(model.CurrentEntity);
            }
            model.CurrentEntity = null;
            model.EntityMeasures = null;
            model.EntityGroups = null;

            var dateString = model.TodayMoment.format(this.constants.InternalDateFormat);
            var requestEntityId = (entityId == null) ? 0 : entityId;
            var requestTypeId = (typeId == null) ? model.UserLevel : typeId;

            var promise = this.apiMeasuresService.GetMeasures(requestEntityId, requestTypeId, groupId, dateString);

            promise.then(result=> {
                model.EntityMeasures = result.data;
                this.CalcMax();
                if (model.EntityMeasures && model.EntityMeasures.length > 0) {
                    model.CurrentEntity = requestEntityId ?
                    _.find(model.EntityMeasures, { Id: requestEntityId }) :
                    _.find(model.EntityMeasures, (e: Api.Models.IEntityMeasure) => e.TypeId == model.UserLevel);
                    var groups = _.groupBy(model.EntityMeasures, "TypeId");
                    var title = this.scope.CurrentMeasure()
                        ? this.scope.Display(this.scope.CurrentMeasure().Id) + " - " + this.scope.ChartName(this.scope.CurrentMeasure().Id)
                        : "";
                    this.graphService.SetChartTitle(model.ChartOptions, title);

                    model.EntityGroups = _.map(<any>groups, (entities: Api.Models.IEntityMeasure[], type: EntityType) => {
                        var group: IEntityGroup = {
                            TypeId: type,
                            Entities: entities
                        };
                        return group;
                    });
                    this.SetTitle();
                } else {
                    // if no measures found then enforce store mode, we are going to the very top level
                    this.scope.SetStoreMode();
                }
            });
            return promise;
        }

        private Measures() {
            return this.EmptyModel(this.scope) ? [] : this._groupSelected.Measures;
        }

        private CurrentMeasure() {
            return this.EmptyModel(this.scope) ? null : this._measureSelected;
        }

        private SetGroup(group: Api.Models.IReferenceGroup) {
            if (group != null) {
                var groupId = group.Id;
                this._groupSelected = group;
                this.scope.Model.CurrentMeasureIndex = 0;
                var current = this.scope.Model.CurrentEntity;
                if (current) {
                    if (this.scope.IsGraphMode()) {
                        this.FetchEntities(groupId, current.ParentId, current.TypeId - 1).then(() => {
                            this.scope.Model.CurrentEntity = _.find(this.scope.Model.EntityMeasures, { Id: current.Id });
                            this.SetTitle();
                        });
                    } else if (this.scope.IsStoreMode()) {
                        this.FetchEntities(groupId, current.Id, current.TypeId);
                    }
                } else {
                    this.FetchEntities(groupId, null, null);
                }
            }
        }

        private SelectMeasure(measure: Api.Models.IReferenceMeasure) {
            this._measureSelected = measure;
            this.scope.Model.SelectedMeasureId = measure.Id;
            var i = 0;
            _.each(this.scope.Model.Groups, (x) => {
                
                if (_.any(x.Measures, (m) => m.Id == measure.Id)) {

                    var measureIndex = _.findIndex(x.Measures, (m) => m.Id == measure.Id);            
                    
                    if (this.scope.Model.CurrentGroupIndex == i) {
                        if (this.scope.IsGraphMode()) {
                            this.FetchGraph(this.scope.Model.CurrentEntity);
                        }
                    } else {
                        this.scope.Model.CurrentGroupIndex = i;
                        this.scope.SetGroup(x);
                    }
                    this.scope.Model.CurrentMeasureIndex = measureIndex;

                }
                i++;
            });
        }

        private SetGraphMeasure(measure: Api.Models.IReferenceMeasure, index: number) {
            if (this.scope.Model.CurrentEntity) {
                this._measureSelected = measure;
                this.scope.Model.CurrentMeasureIndex = index;
                this.scope.SelectMeasure(measure);
            }
        }

        private DrillDown(entity: Api.Models.IEntityMeasure) {
            if (entity.TypeId == EntityType.Stores) {
                this.scope.Model.CurrentEntity = entity;
                this.scope.SetGraphMode();
                this.FetchGraph(entity);
            }
            else {
                var group = this._groupSelected.Id;
                this.FetchEntities(group, entity.Id, entity.TypeId);
            }
        }

        private SetUpScopeFunctions() {

            var scope = this.scope;
            var model = this.scope.Model;

            scope.Display = (item: string) => this.Display(item);

            scope.ChartName = (item: string) => {
                var result = scope ? scope.Loc[item + "ChartSubTitle"] : null;
                return result ? result : item;
            };

            scope.SetChartMode = mode => model.ChartMode = mode;

            scope.GetChartClass = (mode: string = model.ChartMode) => {
                return {
                    'V': 'icons-vertical-bars',
                    'B': 'icons-horizontal-bars',
                    'L': 'icons-line-graph',
                    'P': 'icons-pie-chart'
                }[mode];
            };

            scope.IsToday = () => model.CurrentInterval != Api.Models.ReferenceInterval.Yesterday;
            scope.IsGraphMode = () => model.IsGraphMode;
            scope.IsStoreMode = () => !model.IsGraphMode;
            scope.IsTopLevel = () => (!model.IsGraphMode) && (!scope.IsUpButtonVisible());

            scope.SetStoreMode = () => {
                model.IsGraphMode = false;
                if (model.CurrentEntity && model.CurrentEntity.TypeId == EntityType.Stores) {
                    model.CurrentEntity = _.find(model.EntityMeasures, { Id: model.CurrentEntity.ParentId });
                }
                this.SetTitle();
            };

            scope.SetGraphMode = () => {
                if (!(model.CurrentInterval === Api.Models.ReferenceInterval.Today || model.CurrentInterval === Api.Models.ReferenceInterval.Yesterday)) {
                    scope.SetInterval(Api.Models.ReferenceInterval.Today);
                }

                model.IsGraphMode = true;
                this.SetTitle();
            };

            scope.IsUpButtonVisible = () => scope.IsStoreMode() && model.CurrentEntity && model.CurrentEntity.TypeId != model.UserLevel;

            scope.Measures = () => this.Measures();
            scope.CurrentMeasure = () => this.CurrentMeasure();

            scope.SetGroup = (group: Api.Models.IReferenceGroup) => this.SetGroup(group);

            scope.GoUp = () => {
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
                    this.FetchEntities(groupId, current.ParentId, current.TypeId - 1);
                }
            };


            scope.SelectMeasure = (measure: Api.Models.IReferenceMeasure) => this.SelectMeasure(measure);
            scope.SetGraphMeasure = (measure: Api.Models.IReferenceMeasure, index: number) => this.SetGraphMeasure(measure, index);

            scope.Value = (entity: Api.Models.IEntityMeasure, index: number = model.CurrentMeasureIndex, interval: Api.Models.ReferenceInterval = model.CurrentInterval) => {
                if (model.EntityMeasures == null) { return ""; };
                var measure = this.FindMeasure(entity, index);
                return _.find(measure.Intervals, { Id: interval }).DisplayValue;
            };

            scope.ValueWidth = (entity: Api.Models.IEntityMeasure) => {
                if (!model.EntityMeasures || !model.MaxMeasure) { return 0; };
                var measure = this.FindMeasure(entity, model.CurrentMeasureIndex);
                return Math.round(_.find(measure.Intervals, { Id: model.CurrentInterval }).Value * 100 / model.MaxMeasure);
            };

            scope.ValueClass = (entity: Api.Models.IEntityMeasure, index: number = model.CurrentMeasureIndex, interval: Api.Models.ReferenceInterval = model.CurrentInterval) => {
                if (model.EntityMeasures == null) { return ""; };
                var measure = this.FindMeasure(entity, index);
                var value = _.find(measure.Intervals, { Id: interval }).Class;
                return this._classColorLookup[value];
            };

            scope.ValueClassBg = (entity: Api.Models.IEntityMeasure, index: number = model.CurrentMeasureIndex, interval: Api.Models.ReferenceInterval = model.CurrentInterval) => {
                if (model.EntityMeasures == null) { return ""; };
                var measure = this.FindMeasure(entity, index);
                var value = _.find(measure.Intervals, { Id: interval }).Class;
                return this._classBgLookup[value];
            };

            scope.SetInterval = (interval: Api.Models.ReferenceInterval) => {
                model.CurrentInterval = interval;
                model.Interval = scope.Loc[Api.Models.ReferenceInterval[interval]];

                this.CalcMax();
                if (scope.IsGraphMode()) {
                    this.FetchGraph(model.CurrentEntity);
                }
            }

            scope.DrillDown = (entity: Api.Models.IEntityMeasure) => this.DrillDown(entity);
            scope.RedrawGraph = () => this.RedrawGraph();
            scope.CalcMax = () => this.CalcMax();

        }

        private SetUpWatchers() {
            this.scope.$watch('Model.ChartMode', this.scope.RedrawGraph);
            this.scope.$watch('Model.CurrentMeasureIndex', this.scope.CalcMax);
        }

        constructor(
            private scope: IDashboardScope,
            private translationService: Core.ITranslationService,
            private apiMeasuresService: Api.IMeasuresService,
            private apiReferenceService: Api.IReferenceDataService,
            private popupMessageService: Core.IPopupMessageService,
            private graphService: IDashboardService,
            private authService: Core.Auth.IAuthService,
            private constants: Core.IConstants
            ) {

            this.Initialize();
            this.SetUpScopeFunctions();
            this.SetUpWatchers();

            var model = this.scope.Model;

            apiReferenceService.Get().then(result=> {
                model.Intervals = result.data.Intervals;
                // expecting result.data.Today to have the format: YYYY-MM-DD (no timezone info)
                var today = moment(result.data.Today);
                model.TodayMoment = today;
                model.YesterdayMoment = moment(today).subtract("days", 1); // call subtract() on a clone
                model.Groups = _.where(result.data.Groups, g=> g.Measures.length > 0);

                this._groupSelected = model.Groups.length > 0 ? model.Groups[0] : null;
                this._measureSelected = this._groupSelected.Measures[0];

                if (model.Groups.length > 0) {
                    model.CurrentGroupIndex = 0;
                    model.CurrentMeasureIndex = 0;
                    this.FetchEntities(model.Groups[0].Id, null, null);
                    model.SelectedMeasureId = this._groupSelected.Measures[0].Id;
                }
                if (result.data.Intervals.length > 0) {
                    model.CurrentInterval = result.data.Intervals[0];
                    scope.SetInterval(Api.Models.ReferenceInterval.Today);
                }
            });
        }
    }

    Core.NG.ReportingDashboardModule.RegisterRouteController("", "Templates/Dashboard.html", DashboardController,
        Core.NG.$typedScope<IDashboardScope>(),
        Core.$translation,
        Api.$measuresService,
        Api.$referenceDataService,
        Core.$popupMessageService,
        $dashboardService,
        Core.Auth.$authService,
        Core.Constants);
}
