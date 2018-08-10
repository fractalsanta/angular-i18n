var Forecasting;
(function (Forecasting) {
    "use strict";
    Core.NG.CoreModule.Module().run([
        Core.NG.$filter.name, function ($filter) {
            Forecasting.GetValueNoDecimals = function (value) {
                return (value > 999 || $filter("number")(value, 0) === value.toString() ? value.toString() : "");
            };
        }
    ]);
    var ForecastFilterGraphController = (function () {
        function ForecastFilterGraphController($scope, $timeout, forecastingObjectService, translationService) {
            var _this = this;
            this.$scope = $scope;
            this.$timeout = $timeout;
            this.forecastingObjectService = forecastingObjectService;
            this.translationService = translationService;
            this.timer = 0;
            $scope.NavigateToParam = function (key, value) {
                $scope.$parent.NavigateToParam(key, value);
            };
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
            $scope.$watch("ForecastObject", function (newValue) {
                if (newValue) {
                    _this.$scope.SeriesGraphData = _this.GetSeriesGraphData(_this.$scope.ForecastObject, _this.$scope.Options);
                    _this.LoadData();
                }
                else {
                    _this.ResetGraph();
                }
            }, true);
            $scope.$watch("Options", function (newValue, oldValue) {
                if (!oldValue || !newValue ||
                    newValue.Part !== oldValue.Part ||
                    newValue.Filters !== oldValue.Filters ||
                    newValue.FiltersMap !== oldValue.FiltersMap) {
                    _this.LoadData();
                }
                else if (newValue.MetricKey !== oldValue.MetricKey) {
                    _this.DrawGraph();
                }
            }, true);
            this.Initialize();
        }
        ForecastFilterGraphController.prototype.Initialize = function () {
            this.GetL10N();
            this.SetChartOptions();
        };
        ForecastFilterGraphController.prototype.GetL10N = function () {
            var _this = this;
            this.translationService.GetTranslations().then(function (l10NData) {
                _this.$scope.L10N = l10NData.Forecasting;
            });
        };
        ForecastFilterGraphController.prototype.SetChartOptions = function () {
            var _this = this;
            var self = this, options = this.$scope.Options;
            function tooltip(e) {
                var _this = this;
                (function (e) { self.Tooltip(e, _this); });
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
                        labels: {}
                    }],
                tooltip: {
                    visible: true
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
                            visible: false
                        },
                        minorTicks: {
                            visible: false
                        }
                    }],
                seriesHover: tooltip,
                seriesClick: tooltip,
                legendItemClick: function (e) {
                    e.preventDefault();
                    clearTimeout(_this.timer);
                    _this.timer = setTimeout(function () {
                        self.ClickedLengedItemClicked(e);
                    }, 100);
                }
            };
        };
        ForecastFilterGraphController.prototype.GetSeriesGraphData = function (fo, options) {
            var _this = this;
            if (!fo || !options) {
                return [];
            }
            var ret;
            if (options.Filters && options.Filters.length && options.FiltersMap && fo.MetricsFiltered && fo.MetricsFiltered.length) {
                ret = this.forecastingObjectService.GetSeriesGraphData(fo.MetricsFiltered[0].Data, options);
                _.each(fo.MetricsFiltered, function (filtered) {
                    var res = _this.forecastingObjectService.GetSeriesGraphDataLine(filtered, options);
                    _.each(res, function (seriesData, i) {
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
            }
            else {
                ret = this.forecastingObjectService.GetSeriesGraphData(fo.Metrics, options);
            }
            return ret;
        };
        ForecastFilterGraphController.prototype.SetFilteredSeriesVisible = function (filters, filtersMap) {
            var _this = this;
            if (filters && filtersMap) {
                _.each(filters, function (filter) {
                    if (filtersMap[filter.Id || 0]) {
                        _this.SetSeriesVisible(filter.Name, filtersMap[filter.Id || 0].Visible);
                    }
                });
            }
        };
        ForecastFilterGraphController.prototype.SetSeriesVisible = function (name, visible) {
            var dayGraph = this.$scope.Graph.data("kendoChart"), filters = this.$scope.Options.Filters, map = this.$scope.Options.FiltersMap, redraw = false;
            if (dayGraph) {
                _.each(dayGraph.options.series, function (series) {
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
                    _.each(filters, function (filter) {
                        if ((name || null) === filter.Name) {
                            if (map[filter.Id || 0].Visible !== visible) {
                                map[filter.Id || 0].Visible = visible;
                            }
                        }
                    });
                }
            }
            return redraw;
        };
        ForecastFilterGraphController.prototype.LoadData = function () {
            if (this.$scope.SeriesGraphData && this.$scope.SeriesGraphData.length) {
                var self = this;
                this.$timeout(function () {
                    self.DrawGraph();
                    self.SetFilteredSeriesVisible(self.$scope.Options.Filters, self.$scope.Options.FiltersMap);
                });
            }
        };
        ForecastFilterGraphController.prototype.MakeDayPartLink = function (seriesGraphData, graph, id) {
            var isLast = (id === seriesGraphData.length - 1), dayPartLink = {
                svgPathWidth: $("svg g", this.$scope.Graph).children()[0].getBoundingClientRect().width,
                name: seriesGraphData[id].SeriesName,
                nextLink: (!isLast) ? id + 1 : 0,
                previousLink: (!!id) ? id - 1 : 0,
                previousShow: !!id,
                nextShow: !isLast
            };
            return dayPartLink;
        };
        ForecastFilterGraphController.prototype.SetDayLinksWrapper = function (graph) {
            var $graph = this.$scope.Graph, svgPaths = $graph.find("svg").children(), outerPath = svgPaths[0], svgGPaths = $graph.find("svg g g").children(), innerPath = svgGPaths[0], outerPathWidth = Math.floor(outerPath.getBoundingClientRect().left), innerPathWidth = Math.floor(innerPath.getBoundingClientRect().left), marginLeft;
            if (innerPathWidth === 0) {
                innerPath = svgPaths[3];
                innerPathWidth = Math.floor(innerPath.getBoundingClientRect().width);
            }
            marginLeft = innerPathWidth - outerPathWidth;
            $(".dayLinksWrapper").css({
                marginLeft: marginLeft
            });
        };
        ForecastFilterGraphController.prototype.MakeDayLinks = function (seriesGraphData, graph) {
            if (!seriesGraphData) {
                return;
            }
            var daySegmentsLength = seriesGraphData.length, svgGPaths = $("svg g g", this.$scope.Graph), svgGPathsChildren = svgGPaths.children(), svgGPathsLength = svgGPathsChildren.length, svgGPathsArray = [], daySegmentLinks = [], currentSVGGPath, i;
            for (i = 0; i < svgGPathsLength; i += 1) {
                svgGPathsArray.push(svgGPathsChildren[i]);
            }
            for (i = 0; i < daySegmentsLength; i += 1) {
                currentSVGGPath = svgGPathsArray[i];
                if (currentSVGGPath) {
                    daySegmentLinks.push({
                        id: i,
                        name: seriesGraphData[i].SeriesName,
                        svgPathWidth: Math.floor(currentSVGGPath.getBoundingClientRect().width)
                    });
                }
            }
            return daySegmentLinks;
        };
        ForecastFilterGraphController.prototype.ResetGraph = function () {
            var dayGraph = this.$scope.Graph.data("kendoChart");
            if (dayGraph && dayGraph.options) {
                dayGraph.options.series = [];
                dayGraph.redraw();
            }
        };
        ForecastFilterGraphController.prototype.DrawGraph = function () {
            var dayGraph = this.$scope.Graph.data("kendoChart"), self = this, options = this.$scope.Options, part = options.Part, seriesGraphData = this.$scope.SeriesGraphData[(part === null) ? 0 : part + 1], template;
            if (!dayGraph) {
                this.$timeout(function () {
                    self.DrawGraph();
                }, 100);
                return;
            }
            if (options.IsCurrency) {
                template = "#= Core.GetLocalizedCurrency(value) #";
            }
            else {
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
        };
        ForecastFilterGraphController.prototype.Tooltip = function (e, kendo) {
            var graphElement, coord, dom, r, visible = (e.dataItem.inSegment === true);
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
                }
                else {
                    dom = kendo._plotArea.charts[0];
                }
                if (dom) {
                    r = dom.getNearestPoint(coord.x, coord.y, 0);
                    r.options.tooltip.visible = visible;
                }
            }
        };
        ForecastFilterGraphController.prototype.ClickedLengedItemClicked = function (e) {
            var name = e.text, visible = e.series.visible;
            this.SetSeriesVisible(name, !visible);
        };
        return ForecastFilterGraphController;
    }());
    Forecasting.ForecastFilterGraphController = ForecastFilterGraphController;
    var ForecastFilterGraph = (function () {
        function ForecastFilterGraph() {
            return {
                restrict: "E",
                replace: true,
                templateUrl: "/Areas/Forecasting/Templates/ForecastFilterGraphDirective.html",
                scope: {
                    Options: "=options",
                    ForecastObject: "=forecastobject"
                },
                controller: "Forecasting.ForecastFilterGraphController",
                link: function ($scope, element) {
                    $scope.Element = element;
                    $scope.Graph = $(".forecast-filter-graph", element);
                    $(window).on("resize.mxForecastFilterGraph", function () {
                        var dayGraph = $scope.Graph.data("kendoChart");
                        if (!dayGraph) {
                            return;
                        }
                        dayGraph.redraw();
                        $scope.BuildDayLinks();
                        $scope.$apply();
                    });
                    $scope.$on("$destroy", function () {
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
        return ForecastFilterGraph;
    }());
    Core.NG.ForecastingModule.RegisterNamedController("ForecastFilterGraphController", ForecastFilterGraphController, Core.NG.$typedScope(), Core.NG.$timeout, Forecasting.Services.$forecastingObjectService, Core.$translation);
    Core.NG.ForecastingModule.RegisterDirective("forecastFilterGraph", ForecastFilterGraph);
})(Forecasting || (Forecasting = {}));
