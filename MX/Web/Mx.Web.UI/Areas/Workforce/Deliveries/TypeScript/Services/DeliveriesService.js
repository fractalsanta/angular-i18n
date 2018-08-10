var Workforce;
(function (Workforce) {
    var Deliveries;
    (function (Deliveries) {
        var DeliveriesService = (function () {
            function DeliveriesService(authService, deliveriesApiService, availableUsersApiService, constants) {
                var _this = this;
                this.authService = authService;
                this.deliveriesApiService = deliveriesApiService;
                this.availableUsersApiService = availableUsersApiService;
                this.constants = constants;
                this.GetDeliveriesData = function (date) {
                    var selectedDate = date ? moment(date).format(_this.constants.InternalDateFormat) : "";
                    return _this.deliveriesApiService.Get(_this.authService.GetUser().BusinessUser.MobileSettings.EntityId, selectedDate);
                };
                this.GetAvailableUsers = function (date) {
                    var selectedDate = date ? moment(date).format(_this.constants.InternalDateFormat) : "";
                    return _this.availableUsersApiService.Get(_this.authService.GetUser().BusinessUser.MobileSettings.EntityId, selectedDate);
                };
                this.AddExtraDelivery = function (request) {
                    return _this.deliveriesApiService.Post(_this.authService.GetUser().BusinessUser.MobileSettings.EntityId, request);
                };
            }
            return DeliveriesService;
        }());
        Deliveries.deliveriesService = Core.NG.WorkforceDeliveriesModule.RegisterService("DeliveriesService", DeliveriesService, Core.Auth.$authService, Deliveries.Api.$deliveriesService, Deliveries.Api.$availableUsersService, Core.Constants);
    })(Deliveries = Workforce.Deliveries || (Workforce.Deliveries = {}));
})(Workforce || (Workforce = {}));
