module Forecasting {
    "use strict";

    interface IEvaluatorGraphScope extends ng.IScope {
        Options: IEvaluatorOptions;
    }

    interface IEvaluatorGraphController {
        DrawGraph(): void;
        ResetGraph(): void;
    }

    class EvaluatorGraphController implements IEvaluatorGraphController {
        constructor(
            private $scope: IEvaluatorGraphScope,
            private $timeout: ng.ITimeoutService
            ) {
            $scope.$watch("Options.SeriesEvaluationData", (newValue: any): void => {
                if (newValue && $scope.Options.SeriesEvaluationData && $scope.Options.SeriesEvaluationData.length) {
                    this.DrawGraph();
                } else {
                    this.ResetGraph();
                }
            }, false); 
        }

        ResetGraph(): void {
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
        }

        DrawGraph(): void {
            var dayGraph = $("." + this.$scope.Options.Metric).data("kendoChart"),
                template,
                tooltipTemplate;

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

            } else {
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
                    position: "top",
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
                        visible: false,
                    },
                    minorTicks: {
                        visible: false
                    }
                }],
                series: this.$scope.Options.SeriesEvaluationData
            });

            dayGraph.redraw();
        }       
    }

    class EvaluatorGraph implements ng.IDirective {
        constructor() {
            return <ng.IDirective>{
                restrict: "E",
                replace: true,
                controller: "Forecasting.EvaluatorGraphController",
                templateUrl: "/Areas/Forecasting/Templates/EvaluatorGraphDirective.html",
                scope: {
                    Options: "=options"
                },
                link: ($scope: IEvaluatorGraphScope, element: any): void => {
                    $(window).on("resize.mxForecastGraph", (): void => {
                        var dayGraph = $("." + $scope.Options.Metric).data("kendoChart");

                        if (!dayGraph) {
                            return;
                        }
                        dayGraph.redraw();
                        $scope.$apply();
                    });

                    $scope.$on("$destroy", (): void => {
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
    }

    Core.NG.ForecastingModule.RegisterNamedController("EvaluatorGraphController", EvaluatorGraphController,
        Core.NG.$typedScope<IEvaluatorGraphScope>(),
        Core.NG.$timeout,
        Services.$forecastingObjectService);

    Core.NG.ForecastingModule.RegisterDirective("evaluatorGraph", EvaluatorGraph);
}