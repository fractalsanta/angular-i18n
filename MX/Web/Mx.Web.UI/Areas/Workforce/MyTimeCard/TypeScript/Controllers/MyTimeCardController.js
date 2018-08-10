var Workforce;
(function (Workforce) {
    var MyTimeCard;
    (function (MyTimeCard) {
        var MyTimeCardController = (function () {
            function MyTimeCardController(scope, translationService, timeCardService, popupService, dateService, constants) {
                var _this = this;
                this.scope = scope;
                this.translationService = translationService;
                this.timeCardService = timeCardService;
                this.popupService = popupService;
                this.dateService = dateService;
                this.constants = constants;
                scope.Vm = { Days: [], WeekStart: null, WeekEnd: null, WeekStartString: null, WeekEndString: null };
                this.scope.ChangeDates = function (startDate, endDate) { _this.SetWeek(startDate, endDate); };
                translationService.GetTranslations().then(function (l10NData) {
                    var loc = l10NData.WorkforceMyTimeCard;
                    scope.L10N = loc;
                    scope.GetDescription = function (b) {
                        var type = b.IsPaid ? loc.Paid : loc.Unpaid;
                        type += " " + (b.Type == MyTimeCard.Api.Models.BreakType.Meal ? loc.Meal : loc.Rest);
                        type += " " + loc.Break;
                        return type;
                    };
                    scope.FormatHours = function (day) { return loc.HoursFormat.format(_this.RoundHours(day.TotalHours)); };
                    scope.GetTotalHours = function (days) {
                        var reduced = _.reduce(days, function (m, day) { return m + day.TotalHours; }, 0);
                        return _this.RoundHours(reduced).toString();
                    };
                    popupService.SetPageTitle(loc.MyTimeCard);
                });
                dateService.StartOfWeek(moment()).then(function (day) {
                    _this.SetWeek(day.toDate(), moment(day).add('d', 6).toDate());
                });
            }
            MyTimeCardController.prototype.SetWeek = function (start, end) {
                var _this = this;
                this.timeCardService.GetTimeCards(moment(start), moment(end)).then(function (result) {
                    _this.scope.Vm.Days = result;
                });
            };
            MyTimeCardController.prototype.RoundHours = function (hours) {
                return Math.round(hours * 100) / 100;
            };
            return MyTimeCardController;
        }());
        Core.NG.WorkforceMyTimeCardModule.RegisterRouteController("", "Templates/MyTimeCard.html", MyTimeCardController, Core.NG.$typedScope(), Core.$translation, MyTimeCard.myTimeCardService, Core.$popupMessageService, Core.Date.$dateService, Core.Constants);
    })(MyTimeCard = Workforce.MyTimeCard || (Workforce.MyTimeCard = {}));
})(Workforce || (Workforce = {}));
