var Workforce;
(function (Workforce) {
    var Deliveries;
    (function (Deliveries) {
        var DeliveriesController = (function () {
            function DeliveriesController($scope, translationService, popupMessageService, authService, deliveriesService, $modal) {
                var _this = this;
                this.$scope = $scope;
                this.translationService = translationService;
                this.popupMessageService = popupMessageService;
                this.authService = authService;
                this.deliveriesService = deliveriesService;
                this.$modal = $modal;
                this.GetDeliveryData = function (date) {
                    _this.deliveriesService.GetDeliveriesData(date).then(function (result) {
                        _this._deliveryData = result.data;
                        _this.$scope.Vm = {
                            DatePickerOptions: {
                                Date: moment(_this._deliveryData.SelectedDate).toDate(),
                                DayOffset: 1,
                                MonthOffset: 0,
                                Max: moment(_this._deliveryData.MaxDate).toDate()
                            },
                            SelectedDate: moment(_this._deliveryData.SelectedDate),
                            ShowDeliveriesGrid: _this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Labor_EmployeePortal_Deliveries_CanViewOthersEntries),
                            CanAuthoriseExtraDeliveries: _this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Labor_EmployeePortal_ExtraDeliveries_CanAuthorise),
                            DeliveriesQty: _this._deliveryData.DeliveriesQty,
                            TotalDeliveriesQty: _this._deliveryData.TotalDeliveriesQty,
                            ExtraDeliveriesQty: _this._deliveryData.ExtraDeliveriesQty,
                            ExtraDeliveries: _this._deliveryData.ExtraDeliveryRequests
                        };
                    });
                };
                this.AddNewExtraDelivery = function () {
                    _this.$modal.open({
                        templateUrl: "Areas/Workforce/Deliveries/Templates/AddExtraDeliveryDialog.html",
                        controller: "Workforce.Deliveries.AddExtraDeliveryController",
                        resolve: {
                            selectedDate: function () {
                                return moment(_this._deliveryData.SelectedDate).toDate();
                            }
                        }
                    }).result.then(function () {
                        _this.GetDeliveryData(moment(_this._deliveryData.SelectedDate).toDate());
                    });
                };
                $scope.Vm = {
                    DatePickerOptions: {
                        Date: moment().toDate(),
                        DayOffset: 1,
                        MonthOffset: 0,
                        Max: moment().toDate()
                    },
                    SelectedDate: null,
                    ShowDeliveriesGrid: this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Labor_EmployeePortal_Deliveries_CanViewOthersEntries),
                    CanAuthoriseExtraDeliveries: this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Labor_EmployeePortal_ExtraDeliveries_CanAuthorise),
                    DeliveriesQty: 0,
                    TotalDeliveriesQty: 0,
                    ExtraDeliveriesQty: 0,
                    ExtraDeliveries: []
                };
                translationService.GetTranslations().then(function (l10NData) {
                    $scope.L10N = l10NData.WorkforceDeliveries;
                    popupMessageService.SetPageTitle($scope.L10N.Deliveries);
                });
                $scope.OnDatePickerChange = function (date) {
                    _this.GetDeliveryData(date);
                };
                $scope.GetStatusById = function (id) {
                    var result = { Status: "", Icon: "" };
                    switch (id) {
                        case Deliveries.Api.Models.Enums.ExtraDeliveryOrderStatus.Pending:
                            result.Status = $scope.L10N.PendingApproval;
                            result.Icon = "mx-col-info fa fa-spinner";
                            break;
                        case Deliveries.Api.Models.Enums.ExtraDeliveryOrderStatus.Approved:
                            result.Status = $scope.L10N.Approved;
                            result.Icon = "mx-col-success fa fa-check";
                            break;
                        case Deliveries.Api.Models.Enums.ExtraDeliveryOrderStatus.Denied:
                            result.Status = $scope.L10N.Denied;
                            result.Icon = "mx-col-warning fa fa-minus";
                            break;
                    }
                    return result;
                };
                $scope.AddExtraDelivery = function () { return _this.AddNewExtraDelivery(); };
                $scope.AuthoriseExtraDelivery = function (ed) {
                    _this.$modal.open({
                        templateUrl: "Areas/WorkForce/Deliveries/Templates/AuthorizeDeliveryDialog.html",
                        controller: "Workforce.Deliveries.AuthorizeDeliveryController",
                        resolve: {
                            extraDeliveryRequest: function () {
                                return ed;
                            }
                        }
                    }).result.then(function () {
                        _this.GetDeliveryData(moment(_this._deliveryData.SelectedDate).toDate());
                    });
                };
                $scope.DenyExtraDelivery = function (ed) {
                    _this.$modal.open({
                        templateUrl: "Areas/WorkForce/Deliveries/Templates/DenyDeliveryDialog.html",
                        controller: "Workforce.Deliveries.DenyDeliveryController",
                        resolve: {
                            extraDeliveryRequest: function () {
                                return ed;
                            }
                        }
                    }).result.then(function () {
                        _this.GetDeliveryData(moment(_this._deliveryData.SelectedDate).toDate());
                    });
                };
                this.GetDeliveryData(null);
            }
            return DeliveriesController;
        }());
        Core.NG.WorkforceDeliveriesModule.RegisterRouteController("", "Templates/Deliveries.html", DeliveriesController, Core.NG.$typedScope(), Core.$translation, Core.$popupMessageService, Core.Auth.$authService, Deliveries.deliveriesService, Core.NG.$modal);
    })(Deliveries = Workforce.Deliveries || (Workforce.Deliveries = {}));
})(Workforce || (Workforce = {}));
