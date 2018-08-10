var Operations;
(function (Operations) {
    var Reporting;
    (function (Reporting) {
        var cellFormatFilter = [
            "$filter", function ($filter) {
                return function (input, type) {
                    if (input != null && input !== "") {
                        switch (type) {
                            case Reporting.Api.Models.ReportColumnValueType.Currency:
                                return $filter("currency")(input);
                            case Reporting.Api.Models.ReportColumnValueType.Decimal:
                                return $filter("number")(input, 2);
                            case Reporting.Api.Models.ReportColumnValueType.Integer:
                                return $filter("number")(input, 0);
                            case Reporting.Api.Models.ReportColumnValueType.Percentage:
                                return $filter("number")(input, 2) + "%";
                            case Reporting.Api.Models.ReportColumnValueType.Date:
                                return $filter("date")(input, "EEE, d MMM");
                            case Reporting.Api.Models.ReportColumnValueType.String:
                                return input;
                            case Reporting.Api.Models.ReportColumnValueType.Currency4:
                                return $filter("currency")(input, null, 4);
                            default:
                                return input;
                        }
                    }
                    else {
                        return " - ";
                    }
                };
            }
        ];
        Core.NG.OperationsReportingModule.Module().filter("cellFormat", cellFormatFilter);
    })(Reporting = Operations.Reporting || (Operations.Reporting = {}));
})(Operations || (Operations = {}));
