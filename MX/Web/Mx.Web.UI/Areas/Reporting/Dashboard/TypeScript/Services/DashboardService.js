var Reporting;
(function (Reporting) {
    var Dashboard;
    (function (Dashboard) {
        var DashboardService = (function () {
            function DashboardService() {
            }
            DashboardService.prototype.GetBarGraphOptions = function (points, title) {
                return this.GetBarOptions(points, title, "bar", false);
            };
            DashboardService.prototype.GetVerticalBarGraphOptions = function (points, title) {
                return this.GetBarOptions(points, title, "column", true);
            };
            DashboardService.prototype.GetLineGraphOptions = function (points, title) {
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
            };
            DashboardService.prototype.GetRotation = function (points) {
                if (points.length) {
                    var max = _.max(points, function (x) { return x.Axis.length; });
                    if (max && max.Axis && max.Axis.length > 4) {
                        return 45;
                    }
                }
                return 0;
            };
            DashboardService.prototype.GetBarOptions = function (points, title, type, isVertical) {
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
            };
            DashboardService.prototype.GetPieChartOptions = function (points, title) {
                var colors = ["#ffb800", "#ff8517", "#e34a00", "#0069a5", "#0098ee", "#7bd2f6"];
                var color = function (index) { return colors[index % colors.length]; };
                var mapper = function (point, index) {
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
            };
            DashboardService.prototype.SetChartTitle = function (chartOptions, title) {
                chartOptions.title = {
                    text: title
                };
            };
            return DashboardService;
        }());
        Dashboard.$dashboardService = Core.NG.ReportingDashboardModule.RegisterService("Dashboard", DashboardService);
    })(Dashboard = Reporting.Dashboard || (Reporting.Dashboard = {}));
})(Reporting || (Reporting = {}));
