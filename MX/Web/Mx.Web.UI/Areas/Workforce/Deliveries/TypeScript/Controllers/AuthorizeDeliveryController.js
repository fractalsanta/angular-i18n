var Workforce;
(function (Workforce) {
    var Deliveries;
    (function (Deliveries) {
        var AuthorizeDeliveryController = (function () {
            function AuthorizeDeliveryController($scope, authService, deliveriesAuthorizeService, translationService, $modalInstance, constants, extraDelivery) {
                var _this = this;
                this.$scope = $scope;
                this.authService = authService;
                this.deliveriesAuthorizeService = deliveriesAuthorizeService;
                this.translationService = translationService;
                this.$modalInstance = $modalInstance;
                this.constants = constants;
                this.extraDelivery = extraDelivery;
                $scope.Vm = {
                    Authorize: {
                        UserName: '',
                        Password: ''
                    },
                    AuthorizationIsValid: true,
                    ValidationErrorMessage: "",
                    EmployeeName: this.extraDelivery.User.FirstName + " " + this.extraDelivery.User.LastName
                };
                translationService.GetTranslations().then(function (l10NData) {
                    $scope.L10N = l10NData.WorkforceDeliveries;
                });
                $scope.Cancel = function () {
                    $modalInstance.close();
                };
                $scope.Submit = function () {
                    $scope.Vm.AuthorizationIsValid = true;
                    _this.deliveriesAuthorizeService.Put(authService.GetUser().BusinessUser.MobileSettings.EntityId, {
                        Id: extraDelivery.Id,
                        Status: Deliveries.Api.Models.Enums.ExtraDeliveryOrderStatus.Approved,
                        DenyReason: null,
                        Authorization: $scope.Vm.Authorize
                    }).then(function (result) {
                        if (result.data) {
                            $modalInstance.close();
                        }
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
            }
            return AuthorizeDeliveryController;
        }());
        Core.NG.WorkforceDeliveriesModule.RegisterNamedController("AuthorizeDeliveryController", AuthorizeDeliveryController, Core.NG.$typedScope(), Core.Auth.$authService, Deliveries.Api.$deliveriesAuthorizeService, Core.$translation, Core.NG.$modalInstance, Core.Constants, Core.NG.$typedCustomResolve("extraDeliveryRequest"));
    })(Deliveries = Workforce.Deliveries || (Workforce.Deliveries = {}));
})(Workforce || (Workforce = {}));
