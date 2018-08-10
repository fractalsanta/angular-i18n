module Forecasting {
    "use strict";

    interface IForecastGraphScope extends ng.IScope {
        Options: Services.IForecastingOptions;
        ForecastObject: Services.IForecastObject;

        DayPartLink: IDayPartLink;
        DayLinks: IDayLink[];

        SetDayLinks(width: number): any;
        BuildDayLinks(): void;
        GetSeriesGraphData(fo: Services.IForecastObject): Services.ISeriesGraphData[];
        SeriesGraphData?: Services.ISeriesGraphData[];
    }

    interface IDayPartLink {
        svgPathWidth: number;
        name: string;
        nextLink: number;
        previousLink: number;
        previousShow: boolean;
        nextShow: boolean;
    }

    interface IDayLink {
        id: number;
        name: string;
        svgPathWidth: number;
    }

    interface IForecastGraphController {
        MakeDayPartLink(daySegmentInstances: any[], graph: string, id: number): IDayPartLink;
        SetDayLinksWrapper(graph: string): void;
        MakeDayLinks(daySegments: any[], graph: string): IDayLink[];
        ResetGraph(): void;
        DrawGraph(): void;
    }

    class ForecastGraphController implements IForecastGraphController {
        constructor(
            private $scope: IForecastGraphScope,
            private $timeout: ng.ITimeoutService
            ) {

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

            $scope.GetSeriesGraphData = (fo: Services.IForecastObject) => {
                if (!fo) {
                    return [];
                }

                var alls = fo.Metrics,
                    timeArray,
                    series,
                    seriesData,
                    i, j, part,
                    typeIndexes = alls.TypeIndexes,
                    intervalIndexes = [],
                    values = this.$scope.Options.MetricKey === "sales" ? alls.NewManagerSales : alls.NewManagerTransactions,
                    defaults = this.$scope.Options.MetricKey === "sales" ? alls.ManagerSales : alls.ManagerTransactions,
                    colors = ["#f1c40f", "#3498db", "#2ecc71", "#9b59b6", "#1abc9c", "#e74c3c"],
                    seriesGraphData: Services.ISeriesGraphData[] = [];

                if (values !== undefined) {
                    intervalIndexes = typeIndexes[Services.IntervalTypes.Interval];
                    for (part = -1; part < alls.DaySegments.length; part++) {
                        timeArray = [];
                        series = [];
                        seriesData = [];
                        for (j = 0; j < alls.DaySegments.length; j++) {
                            seriesData.push([]);
                        }

                        for (i = 0; i < intervalIndexes.length; i++) {
                            if (part === -1 || part === alls.DaySegmentIndexes[intervalIndexes[i]]
                                || part === alls.DaySegmentIndexes[intervalIndexes[i - 1]]) { // grab the first interval of the next segment for continually
                                var m = moment(alls.IntervalStarts[intervalIndexes[i]]),
                                    mf = (part !== -1 || m.minutes() === 0) ? m.format("h:mm A") : "";

                                timeArray.push(mf);
                                for (j = 0; j < seriesData.length; j++) {
                                    var value = values[intervalIndexes[i]] !== undefined ? values[intervalIndexes[i]] : defaults[intervalIndexes[i]];
                                    var prev = alls.DaySegmentIndexes[intervalIndexes[i - 1]] === j;
                                    var add = alls.DaySegmentIndexes[intervalIndexes[i]] === j;
                                    seriesData[j].push((add || prev) ? { "value": value, "inSegment": add } : null);
                                }
                            }
                        }

                        for (i = 0; i < seriesData.length; i++) {
                            if (part === -1 || part === i) {
                                series.push({
                                    color: colors[i],
                                    data: seriesData[i],
                                    markers: { visible: true },
                                    field: "value"
                                });
                            }
                        }

                        seriesGraphData.push({
                            Categories: timeArray,
                            Series: series,
                            SeriesName: (part === -1) ? "Day" : alls.DaySegments[part].DaySegmentType.Description
                        });
                    }
                }

                return seriesGraphData;
            };

            $scope.$watch("ForecastObject", (newValue: Services.IForecastObject): void => {
                if (newValue) {
                    $scope.SeriesGraphData = $scope.GetSeriesGraphData($scope.ForecastObject);
                    if ($scope.SeriesGraphData && $scope.SeriesGraphData.length) {
                        var self = this;
                        this.$timeout(function (): void {
                            self.DrawGraph();
                        });
                    }
                } else {
                    this.ResetGraph();
                }
            }, true);

            $scope.$watch("Options", (newValue: Services.IForecastingOptions): void => {
                if (newValue) {
                    $scope.SeriesGraphData = $scope.GetSeriesGraphData($scope.ForecastObject);
                    if ($scope.SeriesGraphData && $scope.SeriesGraphData.length) {
                        var self = this;
                        this.$timeout(function (): void {
                            self.DrawGraph();
                        });
                    }
                }
            }, true);
        }

        MakeDayPartLink(seriesGraphData: any[], graph: string, id: number): IDayPartLink {
            var isLast = (id === seriesGraphData.length - 1),
                dayPartLink: IDayPartLink = <IDayPartLink>{
                    svgPathWidth: $("." + graph + " svg g").children()[0].getBoundingClientRect().width,
                    name: seriesGraphData[id].description,
                    nextLink: (!isLast) ? id + 1 : 0,
                    previousLink: (!!id) ? id - 1 : 0,
                    previousShow: !!id,
                    nextShow: !isLast
                };

            return dayPartLink;
        }

        SetDayLinksWrapper(graph: string): void {
            var $graph = $("." + graph),
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

        MakeDayLinks(seriesGraphData: any[], graph: string): IDayLink[] {
            if (!seriesGraphData) {
                return;
            }

            var daySegmentsLength = seriesGraphData.length,
                svgGPaths = $("." + graph + " svg g g"),
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
                        name: seriesGraphData[i].description,
                        svgPathWidth: Math.floor(currentSVGGPath.getBoundingClientRect().width)
                    });
                }
            }

            return daySegmentLinks;
        }

        ResetGraph(): void {
            var dayGraph = $("." + this.$scope.Options.MetricKey).data("kendoChart"),
                dayLinksWrapper = $(".dayLinksWrapper");

            if (!dayGraph) {
                /* element not ready? */
                var self = this;
                setTimeout(function (): void { self.ResetGraph(); }, 100);
                return;
            }

            dayGraph.setOptions({
                valueAxis: [{
                    labels: {
                        template: null
                    }
                }],
                categoryAxis: [{
                    categories: []
                }],
                series: []
            });
            dayLinksWrapper.children().remove();
            dayGraph.redraw();
        }

        DrawGraph(): void {
            var dayGraph = $("." + this.$scope.Options.MetricKey).data("kendoChart"),
                part = this.$scope.Options.Part,
                seriesGraphData = this.$scope.SeriesGraphData[(part === null) ? 0 : part + 1],
                template;

            /**
             * Check for part
             */
            var timeArray = seriesGraphData.Categories;
            var series = seriesGraphData.Series;

            /**
             * Check for template
             */
            if (this.$scope.Options.IsCurrency) {
                template = "#= Core.GetLocalizedCurrency(value) #";
            } else {
                template = "#= value #";
            }

            if (!dayGraph) {
                /* element not ready? */
                var self = this;

                this.$timeout(function (): void {
                    self.DrawGraph();
                }, 100);
                return;
            }

            function tooltip(e: any): void {
                var graphElement, coord, dom, r, visible = e.dataItem.inSegment;

                if (part !== null) {
                    if (!visible) {
                        e.preventDefault();
                        this._tooltip.hide();
                    }

                    graphElement = this._getChartElement(e);
                    if (graphElement) {
                        graphElement.options.tooltip.visible = visible;
                    }

                    coord = this._eventCoordinates(e);
                    dom = this._activePoint || graphElement;

                    if (dom) {
                        dom = dom.parent;
                    } else {
                        dom = this._plotArea.charts[0];
                    }

                    if (dom) {
                        r = dom.getNearestPoint(coord.x, coord.y, 0);
                        r.options.tooltip.visible = visible;
                    }
                }
            }

            dayGraph.setOptions({
                valueAxis: [{
                    labels: {
                        template: template
                    }
                }],
                tooltip: {
                    visible: true,
                    template: template
                },
                legend: {
                    visible: false
                },
                transitions: false,
                seriesDefaults: {
                    type: "area",
                    missingValues: "gap"
                },
                categoryAxis: [{
                    categories: timeArray,
                    labels: {
                        rotation: 45,
                        margin: {
                            left: 25
                        }
                    }
                }],
                series: series,
                seriesHover: tooltip,
                seriesClick: tooltip
            });

            dayGraph.redraw();
            this.$scope.BuildDayLinks();
        }
    }

    class ForecastGraph implements ng.IDirective {
        constructor() {
            return <ng.IDirective>{
                restrict: "E",
                replace: true,
                templateUrl: "/Areas/Forecasting/Templates/ForecastGraphDirective.html",
                scope: {
                    Options: "=options",
                    ForecastObject: "=forecastobject"
                },
                controller: "Forecasting.ForecastGraphController",
                link: ($scope: IForecastGraphScope, element: any): void => {
                    $(window).on("resize.mxForecastGraph", (): void => {
                        var dayGraph = $("." + $scope.Options.MetricKey).data("kendoChart");

                        if (!dayGraph) {
                            return;
                        }
                        dayGraph.redraw();
                        $scope.BuildDayLinks();
                        $scope.$apply();
                    });

                    $scope.$on("$destroy", (): void => {
                        $(window).off("resize.mxForecastGraph");

                        var dayGraph = $("." + $scope.Options.MetricKey).data("kendoChart");
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

    Core.NG.ForecastingModule.RegisterNamedController("ForecastGraphController", ForecastGraphController,
        Core.NG.$typedScope<IForecastGraphScope>(),
        Core.NG.$timeout,
        Services.$forecastingObjectService);

    Core.NG.ForecastingModule.RegisterDirective("forecastGraph", ForecastGraph);
}