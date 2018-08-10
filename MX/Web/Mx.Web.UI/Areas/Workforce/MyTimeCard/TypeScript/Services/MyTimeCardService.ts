module Workforce.MyTimeCard {

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

    class MyTimeCardService implements IMyTimeCardService {
        constructor(
            private constants: Core.IConstants,
            private apiService: Api.IMyTimeCardService
            ) {
        }

        GetTimeCards(start: Moment, end: Moment): ng.IPromise<IDayEntry[]> {
            var format = this.constants.InternalDateFormat;
            return this.apiService.GetTimeCards(start.format(format), end.format(format)).then(result => this.GroupShiftsByDays(result.data));
        }

        MapShift(record: Api.Models.ITimeCardEntry, entityNames: string[]): IShift {
            var colorIndex = _.indexOf(entityNames, record.EntityName) % colorCodes.length;
            return {
                StartTime: moment(record.StartTime),
                EndTime: moment(record.EndTime),
                JobName: record.JobName,
                EntityName: record.EntityName,
                ColorCode: colorCodes[colorIndex],
                Breaks: _.map(record.Breaks, b => this.MapBreak(b))
            };
        }

        MapBreak(record: Api.Models.ITimeCardBreak): IBreak {
            return {
                Start: moment(record.Start),
                End: moment(record.End),
                Type: record.Type,
                IsPaid: record.IsPaid
            };
        }

        CalculateHours(shifts: IShift[]): number {
            var result: any = moment.duration(0);
            _.each(shifts, shift => {
                result.add(shift.EndTime.diff(shift.StartTime));
                _.each(shift.Breaks, b => {
                    if (!b.IsPaid) {
                        result.subtract(b.End.diff(b.Start));
                    }
                });
            });
            return result.asHours();
        }

        GroupShiftsByDays(shifts: Api.Models.ITimeCardEntry[]): IDayEntry[] {
            var days = _.groupBy(shifts, shift => moment(shift.StartTime).format(this.constants.InternalDateFormat));
            var entities = _.uniq(_.map(shifts, s => s.EntityName));
            return _.map(days, (records: Api.Models.ITimeCardEntry[], key: string): IDayEntry => {
                var shiftRecords = _.map(records, s => this.MapShift(s, entities));
                var day: IDayEntry = {
                    Date: moment(key),
                    Shifts: shiftRecords,
                    TotalHours: this.CalculateHours(shiftRecords)
                };
                return day;
            });
        }
    }

    myTimeCardService = Core.NG.WorkforceMyTimeCardModule.RegisterService("MyTimeCardService", MyTimeCardService,
        Core.Constants,
        Api.$myTimeCardService);
} 