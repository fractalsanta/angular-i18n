module Operations.Reporting {

    import ReportColumnValueType = Api.Models.ReportColumnValueType;

    var cellFormatFilter = [
        "$filter", ($filter: Function): Function => {
            return (input: any, type: ReportColumnValueType): string => {
                if (input != null && input !== "") {
                    switch (type) {
                    case Api.Models.ReportColumnValueType.Currency:
                        return $filter("currency")(input);
                    case Api.Models.ReportColumnValueType.Decimal:
                        return $filter("number")(input, 2);
                    case Api.Models.ReportColumnValueType.Integer:
                        return $filter("number")(input, 0);
                    case Api.Models.ReportColumnValueType.Percentage:
                        return $filter("number")(input, 2) + "%";
                    case Api.Models.ReportColumnValueType.Date:
                        return $filter("date")(input, "EEE, d MMM");
                    case Api.Models.ReportColumnValueType.String:
                        return input;
                    case Api.Models.ReportColumnValueType.Currency4:
                        return $filter("currency")(input,null,4);
                    default:
                        return input;
                    }
                } else {
                    return " - ";
                }
            };
        }
    ];

    Core.NG.OperationsReportingModule.Module().filter("cellFormat", cellFormatFilter);
}