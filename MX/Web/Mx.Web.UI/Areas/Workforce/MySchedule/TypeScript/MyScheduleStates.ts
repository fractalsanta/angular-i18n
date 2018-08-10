module Workforce.MySchedule {

    Core.NG.WorkforceMyScheduleModule.RegisterMasterDetailPage("MySchedule", "",
        { controller: myScheduleController, templateUrl: "Templates/MySchedule.html" },
        { controller: myScheduleWeekController, templateUrl: "Templates/MyScheduleWeek.html" },
        { controller: myScheduleDetailController, templateUrl: "Templates/MyScheduleDetail.html" });
} 