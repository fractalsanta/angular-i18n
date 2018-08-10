var Workforce;
(function (Workforce) {
    var MySchedule;
    (function (MySchedule) {
        var Calendar = (function () {
            function Calendar(events) {
                if (events && events.length) {
                    this.Events = events;
                }
                else {
                    this.Events = new Array();
                }
            }
            return Calendar;
        }());
        MySchedule.Calendar = Calendar;
        var Event = (function () {
            function Event(name, description, startTime, endTime) {
                this.Name = name;
                this.Description = description;
                this.StartTime = startTime;
                this.EndTime = endTime;
            }
            return Event;
        }());
        MySchedule.Event = Event;
    })(MySchedule = Workforce.MySchedule || (Workforce.MySchedule = {}));
})(Workforce || (Workforce = {}));
