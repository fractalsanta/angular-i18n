module Workforce.Deliveries {

    class AddExtraDeliveryController {
        constructor(
            private $scope: IAddExtraDeliveryControllerScope,
            private authService: Core.Auth.IAuthService,
            private translationService: Core.ITranslationService,
            private popupMessageService: Core.IPopupMessageService,
            private $modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private deliveriesService: IDeliveriesService,
            private constants: Core.IConstants,
            private selectedDate: Date
        ) {

            translationService.GetTranslations().then((l10NData) => {
                $scope.L10N = l10NData.WorkforceDeliveries;
            });

            $scope.Vm = {
                AvailableUsers: [],
                SelectedUserId: null,
                OrderNumber: "",
                Comment: "",
                Authorize: <Core.Api.Models.ISupervisorAuthorization>{},
                ShowAuthorization: false,
                AuthorizationIsValid: true,
                ValidationErrorMessage: "",
                ShowSelectUserPrompt: false
            };

            deliveriesService.GetAvailableUsers(selectedDate).then((result) => {
                
                var users = result.data;
                $scope.Vm.AvailableUsers = users;
                $scope.Vm.ShowAuthorization = authService.CheckPermissionAllowance(Core.Api.Models.Task.Labor_EmployeePortal_ExtraDeliveries_CanAuthorise);
                $scope.Vm.ShowSelectUserPrompt = authService.CheckPermissionAllowance(Core.Api.Models.Task.Labor_EmployeePortal_Deliveries_CanViewOthersEntries);
                if (!$scope.Vm.ShowSelectUserPrompt && users && users.length) {
                    $scope.Vm.SelectedUserId = users[0].Id;
                }
            });

            $scope.Submit = (): void => {
                $scope.Vm.AuthorizationIsValid = true;
                var extraDelivery: Api.Models.IExtraDeliveryRequest = {
                    Id: 0,
                    BusinessDay: moment(selectedDate).format(constants.InternalDateFormat),
                    Authorization: $scope.Vm.Authorize,
                    Comment: $scope.Vm.Comment,
                    DenyReason: "",
                    OrderNumber: $scope.Vm.OrderNumber,
                    Status: Api.Models.Enums.ExtraDeliveryOrderStatus.Pending,
                    AuthorisedByUserName: "",
                    AuthorisedByUserId: 0,
                    EntityId: authService.GetUser().BusinessUser.MobileSettings.EntityId,
                    DeliveryDuration: null,
                    DeliveryLocation: "",
                    DeliveryType: 1,
                    EmployeeId: _.find($scope.Vm.AvailableUsers, user => user.Id === $scope.Vm.SelectedUserId).EmployeeId,
                    User: <Api.Models.IClockedOnUser>{
                        Id: $scope.Vm.SelectedUserId,
                        EmployeeId: _.find($scope.Vm.AvailableUsers, user => user.Id === $scope.Vm.SelectedUserId).EmployeeId
                    }
                };

                deliveriesService.AddExtraDelivery(extraDelivery).then(() => {
                    $modalInstance.close();
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

            $scope.Cancel = (): void => {
                $modalInstance.close();
            };
        }
    }

    Core.NG.WorkforceDeliveriesModule.RegisterNamedController("AddExtraDeliveryController", AddExtraDeliveryController,
        Core.NG.$typedScope<IAddExtraDeliveryControllerScope>(),
        Core.Auth.$authService,
        Core.$translation,
        Core.$popupMessageService,
        Core.NG.$modalInstance,
        deliveriesService,
        Core.Constants,
        Core.NG.$typedCustomResolve<Date>("selectedDate")
    );
}
