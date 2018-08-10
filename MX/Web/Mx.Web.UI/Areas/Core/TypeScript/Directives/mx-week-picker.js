var Core;
(function (Core) {
    var MxWeekPicker = (function () {
        function MxWeekPicker() {
            return {
                restrict: "E",
                scope: {
                    SelectedDate: "=?selectedDate",
                    ChangeDates: "=change",
                    ShowArrows: "=?showArrows"
                },
                templateUrl: "/Areas/Core/Templates/mx-week-picker.html",
                controller: "Core.WeekPickerController"
            };
        }
        return MxWeekPicker;
    }());
    Core.MxWeekPicker = MxWeekPicker;
    Core.NG.CoreModule.RegisterDirective("mxWeekPicker", MxWeekPicker);
})(Core || (Core = {}));
