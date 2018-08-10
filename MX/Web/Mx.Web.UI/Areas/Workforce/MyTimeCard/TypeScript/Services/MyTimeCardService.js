var Workforce;
(function (Workforce) {
    var MyTimeCard;
    (function (MyTimeCard) {
        var colorCodes = [
            "Blue",
            "Purple",
            "Red",
            "Green",
            "Yellow",
            "Brown",
            "Pink",
            "Gray",
            "DarkRed",
            "Silver",
            "PowderBlue",
            "Coral"
        ];
        var MyTimeCardService = (function () {
            function MyTimeCardService(constants, apiService) {
                this.constants = constants;
                this.apiService = apiService;
            }
            MyTimeCardService.prototype.GetTimeCards = function (start, end) {
                var _this = this;
                var format = this.constants.InternalDateFormat;
                return this.apiService.GetTimeCards(start.format(format), end.format(format)).then(function (result) { return _this.GroupShiftsByDays(result.data); });
            };
            MyTimeCardService.prototype.MapShift = function (record, entityNames) {
                var _this = this;
                var colorIndex = _.indexOf(entityNames, record.EntityName) % colorCodes.length;
                return {
                    StartTime: moment(record.StartTime),
                    EndTime: moment(record.EndTime),
                    JobName: record.JobName,
                    EntityName: record.EntityName,
                    ColorCode: colorCodes[colorIndex],
                    Breaks: _.map(record.Breaks, function (b) { return _this.MapBreak(b); })
                };
            };
            MyTimeCardService.prototype.MapBreak = function (record) {
                return {
                    Start: moment(record.Start),
                    End: moment(record.End),
                    Type: record.Type,
                    IsPaid: record.IsPaid
                };
            };
            MyTimeCardService.prototype.CalculateHours = function (shifts) {
                var result = moment.duration(0);
                _.each(shifts, function (shift) {
                    result.add(shift.EndTime.diff(shift.StartTime));
                    _.each(shift.Breaks, function (b) {
                        if (!b.IsPaid) {
                            result.subtract(b.End.diff(b.Start));
                        }
                    });
                });
                return result.asHours();
            };
            MyTimeCardService.prototype.GroupShiftsByDays = function (shifts) {
                var _this = this;
                var days = _.groupBy(shifts, function (shift) { return moment(shift.StartTime).format(_this.constants.InternalDateFormat); });
                var entities = _.uniq(_.map(shifts, function (s) { return s.EntityName; }));
                return _.map(days, function (records, key) {
                    var shiftRecords = _.map(records, function (s) { return _this.MapShift(s, entities); });
                    var day = {
                        Date: moment(key),
                        Shifts: shiftRecords,
                        TotalHours: _this.CalculateHours(shiftRecords)
                    };
                    return day;
                });
            };
            return MyTimeCardService;
        }());
        MyTimeCard.myTimeCardService = Core.NG.WorkforceMyTimeCardModule.RegisterService("MyTimeCardService", MyTimeCardService, Core.Constants, MyTimeCard.Api.$myTimeCardService);
    })(MyTimeCard = Workforce.MyTimeCard || (Workforce.MyTimeCard = {}));
})(Workforce || (Workforce = {}));
