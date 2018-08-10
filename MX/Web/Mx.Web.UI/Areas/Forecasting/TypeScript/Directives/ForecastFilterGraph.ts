module Forecasting {
    "use strict";

    export var GetValueNoDecimals: (value: number) => string;

    Core.NG.CoreModule.Module().run([
        Core.NG.$filter.name, ($filter: ng.IFilterService): void => {
            GetValueNoDecimals = (value: number): string =>
                (value > 999 || $filter("number")(value, 0) === value.toString() ? value.toString() : "");
        }
    ]);

    export interface IForecastFilterGraphScope extends ng.IScope {
        Options: Services.IForecastingOptions;
        ForecastObject: Services.IForecastObject;
        L10N: Api.Models.ITranslations;

        Element: any;
        Graph: any;
        DayGraph: any;

        DayPartLink: IDayPartLink;
        DayLinks: IDayLink[];

        SetDayLinks(width: number): any;
        NavigateToParam(key: string, value: string): void;
        BuildDayLinks(): void;
        SeriesGraphData?: Services.ISeriesGraphData[];
    }

    export interface IDayPartLink {
        svgPathWidth: number;
        name: string;
        nextLink: number;
        previousLink: number;
        previousShow: boolean;
        nextShow: boolean;
    }

    export interface IDayLink {
        id: number;
        name: string;
        svgPathWidth: number;
    }

    export class ForecastFilterGraphController {
        private chartOptions: any;
        private timer: number = 0;

        constructor(
            private $scope: IForecastFilterGraphScope,
            private $timeout: ng.ITimeoutService,
            private forecastingObjectService: Services.IForecastingObjectService,
            private translationService: Core.ITranslationService
            ) {

            $scope.NavigateToParam = (key: string, value: string): void => {
                (<any>$scope.$parent).NavigateToParam(key, value);
            };

            $scope.SetDayLinks = (width: number): any => {
                return {
                    width: width,
                    display: "inline-block",
                    textAlign: "center"
                };
            };

            $scope.BuildDayLinks = (): void => {
                if (!this.$scope.SeriesGraphData) {
                    return;
                }

                var data = this.$scope.SeriesGraphData.slice(1);
                if ($scope.Options.Part !== null) {
                    $scope.DayPartLink = this.MakeDayPartLink(data, $scope.Options.MetricKey, $scope.Options.Part);
                } else {
                    $scope.DayLinks = this.MakeDayLinks(data, $scope.Options.MetricKey);
                    this.SetDayLinksWrapper($scope.Options.MetricKey);
                }
            };

            $scope.$watch("ForecastObject", (newValue: Services.IForecastObject): void => {
                if (newValue) {
                    this.$scope.SeriesGraphData = this.GetSeriesGraphData(this.$scope.ForecastObject, this.$scope.Options);
                    this.LoadData();
                } else {
                    this.ResetGraph();
                }
            }, true);

            $scope.$watch("Options", (newValue: Services.IForecastingOptions, oldValue: Services.IForecastingOptions): void => {
                if (!oldValue || !newValue ||
                    newValue.Part !== oldValue.Part ||
                    newValue.Filters !== oldValue.Filters ||
                    newValue.FiltersMap !== oldValue.FiltersMap
                ) {
                    this.LoadData();
                } else if (newValue.MetricKey !== oldValue.MetricKey) {
                    this.DrawGraph();
                }
            }, true);

            this.Initialize();
        }

        Initialize(): void {
            this.GetL10N();
            this.SetChartOptions();
        }

        GetL10N(): void {
            this.translationService.GetTranslations().then((l10NData: any): void => {
                this.$scope.L10N = l10NData.Forecasting;
            });
        }

        SetChartOptions(): void {
            var self = this,
                options = this.$scope.Options;

            function tooltip(e: any): void {
                (e: any): void => { self.Tooltip(e, this); };
                return;
            }

            this.chartOptions = {
                chartArea: {
                    margin: {
                        left: 30,
                        right: 30
                    }
                },
                valueAxis: [{
                    labels: {
                    }
                }],
                tooltip: {
                    visible: true,
                },
                legend: {
                    visible: true,
                    position: "top",
                    labels: {
                        font: "12px verdana"
                    }
                },
                transitions: false,
                seriesDefaults: {
                    type: "area",
                    missingValues: "gap",
                    markers: { visible: true },
                    field: "value." + options.MetricKey
                },
                categoryAxis: [{
                    labels: {
                        rotation: 45,
                        margin: {
                            left: 25
                        },
                        padding: {
                            top: 18
                        }
                    },
                    majorGridLines: {
                        visible: true,
                        color: "transparent"
                    },
                    minorGridLines: {
                        visible: true
                    },
                    majorTicks: {
                        visible: false,
                    },
                    minorTicks: {
                        visible: false
                    }
                }],
                seriesHover: tooltip,
                seriesClick: tooltip,
                legendItemClick: (e: any): void => {
                    e.preventDefault();

                    clearTimeout(this.timer);
                    this.timer = setTimeout((): void => {
                        self.ClickedLengedItemClicked(e);
                    }, 100);
                }
            };
        }

        GetSeriesGraphData(fo: Services.IForecastObject, options: Services.IForecastingOptions): Services.ISeriesGraphData[] {
            if (!fo || !options) {
                return [];
            }

            var ret: Services.ISeriesGraphData[];

            if (options.Filters && options.Filters.length && options.FiltersMap && fo.MetricsFiltered && fo.MetricsFiltered.length) {
                ret = this.forecastingObjectService.GetSeriesGraphData(fo.MetricsFiltered[0].Data, options);

                _.each(fo.MetricsFiltered, (filtered: Services.IAllForecastingDataFiltered): void => {
                    var res: Services.ISeriesGraphData[] = this.forecastingObjectService.GetSeriesGraphDataLine(filtered, options);

                    _.each(res, (seriesData: Services.ISeriesGraphData, i: number): void => {
                        if (seriesData.Series.length === 0) {
                            return;
                        }
                        var series = seriesData.Series[0];

                        series.markers = { visible: false };
                        series.tooltip = { visible: false };
                        series.visible = options.FiltersMap[filtered.FilterId || 0].Visible;
                        series.type = "line";
                        if (filtered.FilterId === null) {
                            series.color = "#000";
                            series.data = [];
                        }

                        ret[i].Series.push(series);
                    });
                });
            } else {
                ret = this.forecastingObjectService.GetSeriesGraphData(fo.Metrics, options);
            }

            return ret;
        }

        SetFilteredSeriesVisible(filters: Api.Models.IForecastFilterRecord[], filtersMap: Services.IFilterOptions[]): void {
            if (filters && filtersMap) {
                _.each(filters, (filter: Api.Models.IForecastFilterRecord): void => {
                    if (filtersMap[filter.Id || 0]) {
                        this.SetSeriesVisible(filter.Name, filtersMap[filter.Id || 0].Visible);
                    }
                });
            }
        }

        SetSeriesVisible(name: string, visible: boolean): boolean {
            var dayGraph = this.$scope.Graph.data("kendoChart"),
                filters = this.$scope.Options.Filters,
                map = this.$scope.Options.FiltersMap,
                redraw = false;

            if (dayGraph) {
                _.each(dayGraph.options.series, (series: any): void => {
                    if (series.name === name) {
                        if (series.visible !== visible) {
                            series.visible = visible;
                            redraw = true;
                        }
                    }
                });

                if (redraw) {
                    dayGraph.redraw();
                }

                if (filters && filters.length) {
                    if (name === filters[0].Name) {
                        this.SetSeriesVisible(undefined, visible);
                    }

                    _.each(filters, (filter: Api.Models.IForecastFilterRecord): void => {
                        if ((name || null) === filter.Name) {
                            if (map[filter.Id || 0].Visible !== visible) {
                                map[filter.Id || 0].Visible = visible;
                            }
                        }
                    });
                }
            }

            return redraw;
        }

        LoadData(): any {
            if (this.$scope.SeriesGraphData && this.$scope.SeriesGraphData.length) {
                var self = this;
                this.$timeout(function (): void {
                    self.DrawGraph();

                    self.SetFilteredSeriesVisible(self.$scope.Options.Filters, self.$scope.Options.FiltersMap);
                });
            }
        }

        // #region Day Part Links

        MakeDayPartLink(seriesGraphData: Services.ISeriesGraphData[], graph: string, id: number): IDayPartLink {
            var isLast = (id === seriesGraphData.length - 1),
                dayPartLink: IDayPartLink = <IDayPartLink>{
                    svgPathWidth: $("svg g", this.$scope.Graph).children()[0].getBoundingClientRect().width,
                    name: seriesGraphData[id].SeriesName,
                    nextLink: (!isLast) ? id + 1 : 0,
                    previousLink: (!!id) ? id - 1 : 0,
                    previousShow: !!id,
                    nextShow: !isLast
                };

            return dayPartLink;
        }

        SetDayLinksWrapper(graph: string): void {
            var $graph = this.$scope.Graph,
                svgPaths = $graph.find("svg").children(),
                outerPath = svgPaths[0],
                svgGPaths = $graph.find("svg g g").children(),
                innerPath = svgGPaths[0],
                outerPathWidth = Math.floor(outerPath.getBoundingClientRect().left),
                innerPathWidth = Math.floor(innerPath.getBoundingClientRect().left),
                marginLeft;

            if (innerPathWidth === 0) {
                innerPath = svgPaths[3];
                innerPathWidth = Math.floor(innerPath.getBoundingClientRect().width);
            }

            marginLeft = innerPathWidth - outerPathWidth;

            $(".dayLinksWrapper").css({
                marginLeft: marginLeft
            });
        }

        MakeDayLinks(seriesGraphData: Services.ISeriesGraphData[], graph: string): IDayLink[] {
            if (!seriesGraphData) {
                return;
            }

            var daySegmentsLength = seriesGraphData.length,
                svgGPaths = $("svg g g", this.$scope.Graph),
                svgGPathsChildren = svgGPaths.children(),
                svgGPathsLength = svgGPathsChildren.length,
                svgGPathsArray = [],
                daySegmentLinks = [],
                currentSVGGPath,
                i;

            // Get all day parts plotted on the graph
            for (i = 0; i < svgGPathsLength; i += 1) {
                svgGPathsArray.push(svgGPathsChildren[i]);
            }

            // Make links by looping through paths
            for (i = 0; i < daySegmentsLength; i += 1) {
                currentSVGGPath = svgGPathsArray[i];
                if (currentSVGGPath) {
                    // Put objects into an array so we can use them with Angular
                    daySegmentLinks.push({
                        id: i,
                        name: seriesGraphData[i].SeriesName,
                        svgPathWidth: Math.floor(currentSVGGPath.getBoundingClientRect().width)
                    });
                }
            }

            return daySegmentLinks;
        }

        // #endregion

        // #region Graph

        ResetGraph(): void {
            var dayGraph = this.$scope.Graph.data("kendoChart");

            if (dayGraph && dayGraph.options) {
                dayGraph.options.series = [];
                dayGraph.redraw();
            }
        }

        DrawGraph(): void {
            var dayGraph = this.$scope.Graph.data("kendoChart"),
                self = this,
                options = this.$scope.Options,
                part: number = options.Part,
                seriesGraphData = this.$scope.SeriesGraphData[(part === null) ? 0 : part + 1],
                template;

            if (!dayGraph) {
                /* element not ready? */
                this.$timeout(function (): void {
                    self.DrawGraph();
                }, 100);
                return;
            }

            if (options.IsCurrency) {
                template = "#= Core.GetLocalizedCurrency(value) #";
            } else {
                template = "#= Forecasting.GetValueNoDecimals(value) #";
            }

            this.chartOptions.seriesDefaults.field = "value." + options.MetricKey;
            this.chartOptions.series = seriesGraphData.Series;

            dayGraph.setOptions(this.chartOptions);

            dayGraph.options.valueAxis.labels.template = template;
            dayGraph.options.tooltip.template = template;
            dayGraph.options.categoryAxis.categories = seriesGraphData.Categories;

            dayGraph.redraw();
            this.$scope.BuildDayLinks();
        }

        Tooltip(e: any, kendo: any): void {
            var graphElement, coord, dom, r, visible = (e.dataItem.inSegment === true);

            // if (part !== null) 
            {
                if (!visible) {
                    e.preventDefault();
                    kendo._tooltip.hide();
                }

                graphElement = kendo._getChartElement(e);
                if (graphElement) {
                    graphElement.options.tooltip.visible = visible;
                }

                coord = kendo._eventCoordinates(e);
                dom = kendo._activePoint || graphElement;

                if (dom) {
                    dom = dom.parent;
                } else {
                    dom = kendo._plotArea.charts[0];
                }

                if (dom) {
                    r = dom.getNearestPoint(coord.x, coord.y, 0);
                    r.options.tooltip.visible = visible;
                }
            }
        }

        ClickedLengedItemClicked(e: any): void {
            var name: string = e.text,
                visible: boolean = e.series.visible;

            this.SetSeriesVisible(name, !visible);
        }

        // #endregion
    }

    class ForecastFilterGraph implements ng.IDirective {
        constructor() {
            return <ng.IDirective>{
                restrict: "E",
                replace: true,
                templateUrl: "/Areas/Forecasting/Templates/ForecastFilterGraphDirective.html",
                scope: {
                    Options: "=options",
                    ForecastObject: "=forecastobject"
                },
                controller: "Forecasting.ForecastFilterGraphController",
                link: ($scope: IForecastFilterGraphScope, element: any): void => {
                    $scope.Element = element;
                    $scope.Graph = $(".forecast-filter-graph", element);

                    $(window).on("resize.mxForecastFilterGraph", (): void => {
                        var dayGraph = $scope.Graph.data("kendoChart");

                        if (!dayGraph) {
                            return;
                        }
                        dayGraph.redraw();
                        $scope.BuildDayLinks();
                        $scope.$apply();
                    });

                    $scope.$on("$destroy", (): void => {
                        $(window).off("resize.mxForecastFilterGraph");

                        var dayGraph = $scope.Graph.data("kendoChart");
                        if (!dayGraph) {
                            return;
                        }

                        dayGraph.destroy();
                        element.remove();
                    });
                }
            };
        }
    }

    Core.NG.ForecastingModule.RegisterNamedController("ForecastFilterGraphController", ForecastFilterGraphController,
        Core.NG.$typedScope<IForecastFilterGraphScope>(),
        Core.NG.$timeout,
        Services.$forecastingObjectService,
        Core.$translation);

    Core.NG.ForecastingModule.RegisterDirective("forecastFilterGraph", ForecastFilterGraph);
}