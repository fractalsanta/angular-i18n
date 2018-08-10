module Reporting.Dashboard {

    export interface IDashboardService {
        GetLineGraphOptions(points: Api.Models.IGraphPoint[], title: string): {};
        GetBarGraphOptions(points: Api.Models.IGraphPoint[], title: string): {};
        GetVerticalBarGraphOptions(points: Api.Models.IGraphPoint[], title: string): {};
        GetPieChartOptions(points: Api.Models.IGraphPoint[], title: string): {};
        SetChartTitle( chartOptions: any, title: string): void;
    }

    class DashboardService implements IDashboardService {

        GetBarGraphOptions(points: Api.Models.IGraphPoint[], title: string) {
            return this.GetBarOptions(points, title, "bar", false);
        }

        GetVerticalBarGraphOptions(points: Api.Models.IGraphPoint[], title: string) {
            return this.GetBarOptions(points, title, "column", true);
        }

        GetLineGraphOptions(points: Api.Models.IGraphPoint[], title: string) {
            var rotation = this.GetRotation(points);

            return {
                legend: {
                    visible: false
                },
                title: {
                    text: title
                },
                seriesDefaults: {
                    type: "line"
                },
                dataSource: {
                    data: points
                },
                series: [{
                        labels: {
                            visible: true,
                            template: "#= dataItem.Label #"
                        },
                        field: "Value",
                        color: "#1c638d"
                }],
                valueAxis: {
                    labels: {
                        format: "{0}"
                    }
                },
                categoryAxis: {
                    categories: points,
                    field: "Axis",
                    majorGridLines: {
                        visible: false
                    },
                    labels: {
                        rotation: rotation
                    }
                },
                tooltip: {
                    visible: true,
                    format: "{0}%",
                    background: "white",
                    border: {
                        color: "#1c638d",
                        width: 1
                    },
                    template: "#= dataItem.Axis #: #= dataItem.Label #"
                }
            };
        }

        private GetRotation(points: Api.Models.IGraphPoint[]): number {
            if (points.length) {
                var max = _.max(points, x => x.Axis.length);
                if (max && max.Axis && max.Axis.length > 4) {
                    return 45;
                }
            }
            return 0;
        }

        private GetBarOptions(points: Api.Models.IGraphPoint[], title: string, type: string, isVertical: boolean): {} {

            var rotation = 0;
            if (isVertical) {
                rotation = this.GetRotation(points);
            }

            return {
                dataSource: {
                    data: points
                },
                legend: {
                    visible: false
                },
                title: {
                    text: title
                },
                seriesDefaults: {
                    type: type
                },
                series: [{
                        labels: {
                            visible: true,
                            template: "#= dataItem.Label #",
                            rotation: (isVertical ? -90 : 0)
                        },
                        color: "#1c638d",
                        field: "Value"
                }],
                valueAxis: {
                    line: {
                        visible: false
                    }
                },
                categoryAxis: {
                    categories: points,
                    field: "Axis",
                    majorGridLines: {
                        visible: false
                    },
                    labels: {
                        rotation: rotation
                    }
                },
                tooltip: {
                    visible: true,
                    background: "white",
                    border: {
                        color: "#1c638d",
                        width: 1
                    },
                    template: "#= dataItem.Axis #: #= dataItem.Label #"
                },
                plotArea: {
                    margin: {
                        top: (isVertical ? 20 : 0)
                    }

                }
            };
        }

        GetPieChartOptions(points: Api.Models.IGraphPoint[], title: string) {
            var colors = ["#ffb800", "#ff8517", "#e34a00", "#0069a5", "#0098ee", "#7bd2f6"];
            var color = (index: number) => colors[index % colors.length];
            var mapper = (point: Api.Models.IGraphPoint, index:number) => {
                return {
                    category: point.Axis,
                    label: point.Label,
                    value: point.Value,
                    color: color(index)
                };
            };
            return {
                legend: {
                    visible: false
                },
                title: {
                    text: title
                },
                chartArea: {
                    background: ""
                },
                seriesDefaults: {
                    labels: {
                        visible: true,
                        background: "transparent",
                        template: "#= category #: #= value#"
                    }
                },
                series: [{
                    overlay: {
                        gradient: "roundedBevel"
                    },
                    type: "pie",
                    startAngle: 150,
                    data: _.map(points, mapper)
                }],
                tooltip: {
                    background: "white",
                    border: {
                        color: "#1c638d",
                        width: 1
                    },
                    visible: true,
                    format: "{0}"
                }
            };
        }

        SetChartTitle(chartOptions: any, title: string): void {
            chartOptions.title = {
                text: title
            };
        }
    }

    export var $dashboardService: Core.NG.INamedDependency<IDashboardService> =
        Core.NG.ReportingDashboardModule.RegisterService("Dashboard", DashboardService);
}