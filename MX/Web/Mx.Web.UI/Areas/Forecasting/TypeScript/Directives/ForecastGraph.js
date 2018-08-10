var Forecasting;
(function (Forecasting) {
    "use strict";
    var ForecastGraphController = (function () {
        function ForecastGraphController($scope, $timeout) {
            var _this = this;
            this.$scope = $scope;
            this.$timeout = $timeout;
            $scope.SetDayLinks = function (width) {
                return {
                    width: width,
                    display: "inline-block",
                    textAlign: "center"
                };
            };
            $scope.BuildDayLinks = function () {
                if (!_this.$scope.SeriesGraphData) {
                    return;
                }
                var data = _this.$scope.SeriesGraphData.slice(1);
                if ($scope.Options.Part !== null) {
                    $scope.DayPartLink = _this.MakeDayPartLink(data, $scope.Options.MetricKey, $scope.Options.Part);
                }
                else {
                    $scope.DayLinks = _this.MakeDayLinks(data, $scope.Options.MetricKey);
                    _this.SetDayLinksWrapper($scope.Options.MetricKey);
                }
            };
            $scope.GetSeriesGraphData = function (fo) {
                if (!fo) {
                    return [];
                }
                var alls = fo.Metrics, timeArray, series, seriesData, i, j, part, typeIndexes = alls.TypeIndexes, intervalIndexes = [], values = _this.$scope.Options.MetricKey === "sales" ? alls.NewManagerSales : alls.NewManagerTransactions, defaults = _this.$scope.Options.MetricKey === "sales" ? alls.ManagerSales : alls.ManagerTransactions, colors = ["#f1c40f", "#3498db", "#2ecc71", "#9b59b6", "#1abc9c", "#e74c3c"], seriesGraphData = [];
                if (values !== undefined) {
                    intervalIndexes = typeIndexes[Forecasting.Services.IntervalTypes.Interval];
                    for (part = -1; part < alls.DaySegments.length; part++) {
                        timeArray = [];
                        series = [];
                        seriesData = [];
                        for (j = 0; j < alls.DaySegments.length; j++) {
                            seriesData.push([]);
                        }
                        for (i = 0; i < intervalIndexes.length; i++) {
                            if (part === -1 || part === alls.DaySegmentIndexes[intervalIndexes[i]]
                                || part === alls.DaySegmentIndexes[intervalIndexes[i - 1]]) {
                                var m = moment(alls.IntervalStarts[intervalIndexes[i]]), mf = (part !== -1 || m.minutes() === 0) ? m.format("h:mm A") : "";
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
            $scope.$watch("ForecastObject", function (newValue) {
                if (newValue) {
                    $scope.SeriesGraphData = $scope.GetSeriesGraphData($scope.ForecastObject);
                    if ($scope.SeriesGraphData && $scope.SeriesGraphData.length) {
                        var self = _this;
                        _this.$timeout(function () {
                            self.DrawGraph();
                        });
                    }
                }
                else {
                    _this.ResetGraph();
                }
            }, true);
            $scope.$watch("Options", function (newValue) {
                if (newValue) {
                    $scope.SeriesGraphData = $scope.GetSeriesGraphData($scope.ForecastObject);
                    if ($scope.SeriesGraphData && $scope.SeriesGraphData.length) {
                        var self = _this;
                        _this.$timeout(function () {
                            self.DrawGraph();
                        });
                    }
                }
            }, true);
        }
        ForecastGraphController.prototype.MakeDayPartLink = function (seriesGraphData, graph, id) {
            var isLast = (id === seriesGraphData.length - 1), dayPartLink = {
                svgPathWidth: $("." + graph + " svg g").children()[0].getBoundingClientRect().width,
                name: seriesGraphData[id].description,
                nextLink: (!isLast) ? id + 1 : 0,
                previousLink: (!!id) ? id - 1 : 0,
                previousShow: !!id,
                nextShow: !isLast
            };
            return dayPartLink;
        };
        ForecastGraphController.prototype.SetDayLinksWrapper = function (graph) {
            var $graph = $("." + graph), svgPaths = $graph.find("svg").children(), outerPath = svgPaths[0], svgGPaths = $graph.find("svg g g").children(), innerPath = svgGPaths[0], outerPathWidth = Math.floor(outerPath.getBoundingClientRect().left), innerPathWidth = Math.floor(innerPath.getBoundingClientRect().left), marginLeft;
            if (innerPathWidth === 0) {
                innerPath = svgPaths[3];
                innerPathWidth = Math.floor(innerPath.getBoundingClientRect().width);
            }
            marginLeft = innerPathWidth - outerPathWidth;
            $(".dayLinksWrapper").css({
                marginLeft: marginLeft
            });
        };
        ForecastGraphController.prototype.MakeDayLinks = function (seriesGraphData, graph) {
            if (!seriesGraphData) {
                return;
            }
            var daySegmentsLength = seriesGraphData.length, svgGPaths = $("." + graph + " svg g g"), svgGPathsChildren = svgGPaths.children(), svgGPathsLength = svgGPathsChildren.length, svgGPathsArray = [], daySegmentLinks = [], currentSVGGPath, i;
            for (i = 0; i < svgGPathsLength; i += 1) {
                svgGPathsArray.push(svgGPathsChildren[i]);
            }
            for (i = 0; i < daySegmentsLength; i += 1) {
                currentSVGGPath = svgGPathsArray[i];
                if (currentSVGGPath) {
                    daySegmentLinks.push({
                        id: i,
                        name: seriesGraphData[i].description,
                        svgPathWidth: Math.floor(currentSVGGPath.getBoundingClientRect().width)
                    });
                }
            }
            return daySegmentLinks;
        };
        ForecastGraphController.prototype.ResetGraph = function () {
            var dayGraph = $("." + this.$scope.Options.MetricKey).data("kendoChart"), dayLinksWrapper = $(".dayLinksWrapper");
            if (!dayGraph) {
                var self = this;
                setTimeout(function () { self.ResetGraph(); }, 100);
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
        };
        ForecastGraphController.prototype.DrawGraph = function () {
            var dayGraph = $("." + this.$scope.Options.MetricKey).data("kendoChart"), part = this.$scope.Options.Part, seriesGraphData = this.$scope.SeriesGraphData[(part === null) ? 0 : part + 1], template;
            var timeArray = seriesGraphData.Categories;
            var series = seriesGraphData.Series;
            if (this.$scope.Options.IsCurrency) {
                template = "#= Core.GetLocalizedCurrency(value) #";
            }
            else {
                template = "#= value #";
            }
            if (!dayGraph) {
                var self = this;
                this.$timeout(function () {
                    self.DrawGraph();
                }, 100);
                return;
            }
            function tooltip(e) {
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
                    }
                    else {
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
        };
        return ForecastGraphController;
    }());
    var ForecastGraph = (function () {
        function ForecastGraph() {
            return {
                restrict: "E",
                replace: true,
                templateUrl: "/Areas/Forecasting/Templates/ForecastGraphDirective.html",
                scope: {
                    Options: "=options",
                    ForecastObject: "=forecastobject"
                },
                controller: "Forecasting.ForecastGraphController",
                link: function ($scope, element) {
                    $(window).on("resize.mxForecastGraph", function () {
                        var dayGraph = $("." + $scope.Options.MetricKey).data("kendoChart");
                        if (!dayGraph) {
                            return;
                        }
                        dayGraph.redraw();
                        $scope.BuildDayLinks();
                        $scope.$apply();
                    });
                    $scope.$on("$destroy", function () {
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
        return ForecastGraph;
    }());
    Core.NG.ForecastingModule.RegisterNamedController("ForecastGraphController", ForecastGraphController, Core.NG.$typedScope(), Core.NG.$timeout, Forecasting.Services.$forecastingObjectService);
    Core.NG.ForecastingModule.RegisterDirective("forecastGraph", ForecastGraph);
})(Forecasting || (Forecasting = {}));
