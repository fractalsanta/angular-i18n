module Core {
    export class MxWeekPicker implements ng.IDirective {
        constructor() {
            return <ng.IDirective>{
                restrict: "E",
                scope: {
                    SelectedDate:"=?selectedDate",
                    ChangeDates: "=change",
                    ShowArrows: "=?showArrows",
                },
                templateUrl: "/Areas/Core/Templates/mx-week-picker.html",
                controller: "Core.WeekPickerController"
            };

        }
    }
    Core.NG.CoreModule.RegisterDirective("mxWeekPicker", MxWeekPicker);
}