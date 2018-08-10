var Forecasting;
(function (Forecasting) {
    "use strict";
    var EvaluatorGraphController = (function () {
        function EvaluatorGraphController($scope, $timeout) {
            var _this = this;
            this.$scope = $scope;
            this.$timeout = $timeout;
            $scope.$watch("Options.SeriesEvaluationData", function (newValue) {
                if (newValue && $scope.Options.SeriesEvaluationData && $scope.Options.SeriesEvaluationData.length) {
                    _this.DrawGraph();
                }
                else {
                    _this.ResetGraph();
                }
            }, false);
        }
        EvaluatorGraphController.prototype.ResetGraph = function () {
            var dayGraph = $("." + this.$scope.Options.Metric).data("kendoChart");
            if (!dayGraph) {
                return;
            }
            dayGraph.setOptions({
                chartArea: {
                    height: 280
                },
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
            dayGraph.redraw();
        };
        EvaluatorGraphController.prototype.DrawGraph = function () {
            var dayGraph = $("." + this.$scope.Options.Metric).data("kendoChart"), template, tooltipTemplate;
            if (!dayGraph) {
                var self = this;
                this.$timeout(function () {
                    self.DrawGraph();
                }, 100);
                return;
            }
            if (this.$scope.Options.Template === "c") {
                template = "#= Core.GetLocalizedCurrency(value) #";
                tooltipTemplate =
                    "<table>" +
                        "#= Forecasting.GetTooltipEvents(dataItem.events) #" +
                        "<tr><td>" + this.$scope.Options.SeriesEvaluationData[0].name + ":&nbsp;</td><td align='left'>${Core.GetLocalizedCurrency(dataItem.actual)}</td></tr>" +
                        "<tr><td>" + this.$scope.Options.SeriesEvaluationData[1].name + ":&nbsp;</td><td align='left'>${Core.GetLocalizedCurrency(dataItem.manager)}</td></tr>" +
                        "<tr><td>" + this.$scope.Options.SeriesEvaluationData[2].name + ":&nbsp;</td><td align='left'>${Core.GetLocalizedCurrency(dataItem.system)}</td></tr>" +
                        "</table>";
            }
            else {
                template = "#= value #";
                tooltipTemplate =
                    "<table>" +
                        "#= Forecasting.GetTooltipEvents(dataItem.events) #" +
                        "<tr><td>" + this.$scope.Options.SeriesEvaluationData[0].name + ":&nbsp;</td><td align='left'>${dataItem.actual}</td></tr>" +
                        "<tr><td>" + this.$scope.Options.SeriesEvaluationData[1].name + ":&nbsp;</td><td align='left'>${dataItem.manager}</td></tr>" +
                        "<tr><td>" + this.$scope.Options.SeriesEvaluationData[2].name + ":&nbsp;</td><td align='left'>${dataItem.system}</td></tr>" +
                        "</table>";
            }
            dayGraph.setOptions({
                chartArea: {
                    height: 280
                },
                valueAxis: [{
                        labels: {
                            template: template
                        }
                    }],
                tooltip: {
                    visible: true,
                    color: "black",
                    template: tooltipTemplate
                },
                legend: {
                    visible: true,
                    position: "top"
                },
                transitions: false,
                seriesDefaults: {
                    type: "line",
                    missingValues: "gap",
                    width: 5,
                    markers: {
                        size: 18,
                        background: "transparent"
                    }
                },
                categoryAxis: [{
                        categories: this.$scope.Options.SeriesEvaluationTimes,
                        labels: {
                            rotation: 45,
                            margin: {
                                left: 25,
                                top: 5
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
                series: this.$scope.Options.SeriesEvaluationData
            });
            dayGraph.redraw();
        };
        return EvaluatorGraphController;
    }());
    var EvaluatorGraph = (function () {
        function EvaluatorGraph() {
            return {
                restrict: "E",
                replace: true,
                controller: "Forecasting.EvaluatorGraphController",
                templateUrl: "/Areas/Forecasting/Templates/EvaluatorGraphDirective.html",
                scope: {
                    Options: "=options"
                },
                link: function ($scope, element) {
                    $(window).on("resize.mxForecastGraph", function () {
                        var dayGraph = $("." + $scope.Options.Metric).data("kendoChart");
                        if (!dayGraph) {
                            return;
                        }
                        dayGraph.redraw();
                        $scope.$apply();
                    });
                    $scope.$on("$destroy", function () {
                        $(window).off("resize.mxForecastGraph");
                        var dayGraph = $("." + $scope.Options.Metric).data("kendoChart");
                        if (!dayGraph) {
                            return;
                        }
                        dayGraph.destroy();
                        element.remove();
                    });
                }
            };
        }
        return EvaluatorGraph;
    }());
    Core.NG.ForecastingModule.RegisterNamedController("EvaluatorGraphController", EvaluatorGraphController, Core.NG.$typedScope(), Core.NG.$timeout, Forecasting.Services.$forecastingObjectService);
    Core.NG.ForecastingModule.RegisterDirective("evaluatorGraph", EvaluatorGraph);
})(Forecasting || (Forecasting = {}));
