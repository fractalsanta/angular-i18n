module Core {
    export class MxDateRangePicker implements ng.IDirective {
        constructor() {
            return <ng.IDirective>{
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
    }
    Core.NG.CoreModule.RegisterDirective("mxDateRangePicker", MxDateRangePicker);
}