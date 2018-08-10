var Workforce;
(function (Workforce) {
    var MySchedule;
    (function (MySchedule) {
        Core.NG.WorkforceMyScheduleModule.RegisterMasterDetailPage("MySchedule", "", { controller: MySchedule.myScheduleController, templateUrl: "Templates/MySchedule.html" }, { controller: MySchedule.myScheduleWeekController, templateUrl: "Templates/MyScheduleWeek.html" }, { controller: MySchedule.myScheduleDetailController, templateUrl: "Templates/MyScheduleDetail.html" });
    })(MySchedule = Workforce.MySchedule || (Workforce.MySchedule = {}));
})(Workforce || (Workforce = {}));
