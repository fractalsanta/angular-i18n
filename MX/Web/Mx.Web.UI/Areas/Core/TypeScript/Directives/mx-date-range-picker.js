var Core;
(function (Core) {
    var MxDateRangePicker = (function () {
        function MxDateRangePicker() {
            return {
                restrict: "E",
                scope: {
                    DateRange: "=ngModel",
                    Title: "@title",
                    ChangeRange: "&changeDates",
                    State: "=state"
                },
                templateUrl: "/Areas/Core/Templates/mx-date-range-picker.html",
                controller: "Core.DateRangePickerController"
            };
        }
        return MxDateRangePicker;
    }());
    Core.MxDateRangePicker = MxDateRangePicker;
    Core.NG.CoreModule.RegisterDirective("mxDateRangePicker", MxDateRangePicker);
})(Core || (Core = {}));
