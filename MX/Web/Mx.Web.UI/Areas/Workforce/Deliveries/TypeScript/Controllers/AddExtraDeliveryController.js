var Workforce;
(function (Workforce) {
    var Deliveries;
    (function (Deliveries) {
        var AddExtraDeliveryController = (function () {
            function AddExtraDeliveryController($scope, authService, translationService, popupMessageService, $modalInstance, deliveriesService, constants, selectedDate) {
                this.$scope = $scope;
                this.authService = authService;
                this.translationService = translationService;
                this.popupMessageService = popupMessageService;
                this.$modalInstance = $modalInstance;
                this.deliveriesService = deliveriesService;
                this.constants = constants;
                this.selectedDate = selectedDate;
                translationService.GetTranslations().then(function (l10NData) {
                    $scope.L10N = l10NData.WorkforceDeliveries;
                });
                $scope.Vm = {
                    AvailableUsers: [],
                    SelectedUserId: null,
                    OrderNumber: "",
                    Comment: "",
                    Authorize: {},
                    ShowAuthorization: false,
                    AuthorizationIsValid: true,
                    ValidationErrorMessage: "",
                    ShowSelectUserPrompt: false
                };
                deliveriesService.GetAvailableUsers(selectedDate).then(function (result) {
                    var users = result.data;
                    $scope.Vm.AvailableUsers = users;
                    $scope.Vm.ShowAuthorization = authService.CheckPermissionAllowance(Core.Api.Models.Task.Labor_EmployeePortal_ExtraDeliveries_CanAuthorise);
                    $scope.Vm.ShowSelectUserPrompt = authService.CheckPermissionAllowance(Core.Api.Models.Task.Labor_EmployeePortal_Deliveries_CanViewOthersEntries);
                    if (!$scope.Vm.ShowSelectUserPrompt && users && users.length) {
                        $scope.Vm.SelectedUserId = users[0].Id;
                    }
                });
                $scope.Submit = function () {
                    $scope.Vm.AuthorizationIsValid = true;
                    var extraDelivery = {
                        Id: 0,
                        BusinessDay: moment(selectedDate).format(constants.InternalDateFormat),
                        Authorization: $scope.Vm.Authorize,
                        Comment: $scope.Vm.Comment,
                        DenyReason: "",
                        OrderNumber: $scope.Vm.OrderNumber,
                        Status: Deliveries.Api.Models.Enums.ExtraDeliveryOrderStatus.Pending,
                        AuthorisedByUserName: "",
                        AuthorisedByUserId: 0,
                        EntityId: authService.GetUser().BusinessUser.MobileSettings.EntityId,
                        DeliveryDuration: null,
                        DeliveryLocation: "",
                        DeliveryType: 1,
                        EmployeeId: _.find($scope.Vm.AvailableUsers, function (user) { return user.Id === $scope.Vm.SelectedUserId; }).EmployeeId,
                        User: {
                            Id: $scope.Vm.SelectedUserId,
                            EmployeeId: _.find($scope.Vm.AvailableUsers, function (user) { return user.Id === $scope.Vm.SelectedUserId; }).EmployeeId
                        }
                    };
                    deliveriesService.AddExtraDelivery(extraDelivery).then(function () {
                        $modalInstance.close();
                    }, function (result) {
                        switch (result.status) {
                            case 409:
                                $scope.Vm.Authorize.UserName = "";
                                $scope.Vm.Authorize.Password = "";
                                $scope.Vm.ValidationErrorMessage = $scope.L10N[result.data.Message];
                                $scope.Vm.AuthorizationIsValid = false;
                                break;
                            default:
                                break;
                        }
                    });
                };
                $scope.Cancel = function () {
                    $modalInstance.close();
                };
            }
            return AddExtraDeliveryController;
        }());
        Core.NG.WorkforceDeliveriesModule.RegisterNamedController("AddExtraDeliveryController", AddExtraDeliveryController, Core.NG.$typedScope(), Core.Auth.$authService, Core.$translation, Core.$popupMessageService, Core.NG.$modalInstance, Deliveries.deliveriesService, Core.Constants, Core.NG.$typedCustomResolve("selectedDate"));
    })(Deliveries = Workforce.Deliveries || (Workforce.Deliveries = {}));
})(Workforce || (Workforce = {}));
