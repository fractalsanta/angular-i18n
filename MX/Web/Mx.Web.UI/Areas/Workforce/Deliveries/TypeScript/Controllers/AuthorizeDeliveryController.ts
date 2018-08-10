module Workforce.Deliveries {

    class AuthorizeDeliveryController {
        constructor(
            private $scope: IAuthorizeDeliveryControllerScope,
            private authService: Core.Auth.IAuthService,
            private deliveriesAuthorizeService: Deliveries.Api.IDeliveriesAuthorizeService,
            private translationService: Core.ITranslationService,
            private $modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private constants: Core.IConstants,
            private extraDelivery: Api.Models.IExtraDeliveryRequest
        ) {

            $scope.Vm = {
                Authorize: {
                    UserName: '',
                    Password: ''
                },
                AuthorizationIsValid: true,
                ValidationErrorMessage: "",
                EmployeeName: this.extraDelivery.User.FirstName + " " + this.extraDelivery.User.LastName
        };

            translationService.GetTranslations().then((l10NData) => {

                $scope.L10N = l10NData.WorkforceDeliveries;

            });

            $scope.Cancel = (): void => {
                $modalInstance.close();
            };

            $scope.Submit = (): void => {
                $scope.Vm.AuthorizationIsValid = true;
                this.deliveriesAuthorizeService.Put(
                    authService.GetUser().BusinessUser.MobileSettings.EntityId,
                    {
                        Id: extraDelivery.Id,
                        Status: Deliveries.Api.Models.Enums.ExtraDeliveryOrderStatus.Approved,
                        DenyReason: null,
                        Authorization: $scope.Vm.Authorize
                    }
                ).then((result) => {
                    if (result.data) {
                        $modalInstance.close();
                    }
                }, (result: ng.IHttpPromiseCallbackArg<Mx.Web.UI.Config.WebApi.IErrorMessage>) => {
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
    }

    Core.NG.WorkforceDeliveriesModule.RegisterNamedController("AuthorizeDeliveryController", AuthorizeDeliveryController,
        Core.NG.$typedScope<IAuthorizeDeliveryControllerScope>(),
        Core.Auth.$authService,
        Api.$deliveriesAuthorizeService,
        Core.$translation,
        Core.NG.$modalInstance,
        Core.Constants,
        Core.NG.$typedCustomResolve<Api.Models.IExtraDeliveryRequest>("extraDeliveryRequest")
    );
}
