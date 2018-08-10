module Workforce.DriverDistance {
    "use strict";

    export class AddDriverDistanceController {
        constructor(
            private $scope: IAddDriverDistanceControllerScope,
            private authService: Core.Auth.IAuthService,
            private translationService: Core.ITranslationService,
            private $modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private driverDistanceEmployeeService: Api.IDriverDistanceEmployeeService,
            private driverDistanceManagerService: Api.IDriverDistanceManagerService,
            private constants: Core.IConstants,
            private selectedDate: Date
            )
        {
            translationService.GetTranslations().then((l10NData: Core.Api.Models.ITranslations) : void => {
                this.$scope.L10N = l10NData.WorkforceDriverDistance;
            });

            $scope.Vm = {
                AvailableUsers: [],
                SelectedUserId: null,
                StartOdomRead: null,
                EndOdomRead: null,
                Authorize: <Core.Api.Models.ISupervisorAuthorization>{},
                ShowAuthorization: false,
                AuthorizationIsValid: true,
                ValidationErrorMessage: "",
                ShowSelectUserPrompt: false,
                ShowOdomError: false
            };

            $scope.Vm.ShowAuthorization = authService.CheckPermissionAllowance(Core.Api.Models.Task.Labor_EmployeePortal_DriverDistance_CanAuthorise);
            $scope.Vm.ShowSelectUserPrompt = authService.CheckPermissionAllowance(Core.Api.Models.Task.Labor_EmployeePortal_DriverDistance_CanViewOthersEntries);
            var user = authService.GetUser().BusinessUser;

            if ($scope.Vm.ShowSelectUserPrompt) {
                driverDistanceManagerService.GetActiveUsersByAssignedEntity(user.MobileSettings.EntityId)
                    .success((results: Administration.User.Api.Models.IUser[]): void  => {
                        $scope.Vm.AvailableUsers = results;
                    });
            } else {
                $scope.Vm.AvailableUsers = [<Administration.User.Api.Models.IUser>{ Id: user.Id, FirstName: user.FirstName, LastName: user.LastName }];
                $scope.Vm.SelectedUserId = user.Id;
            }

            $scope.Submit = (): void => {
                if (! $scope.IsOdomValid()) {
                    $scope.Vm.ShowOdomError = true;
                    return;
                }
                $scope.Vm.AuthorizationIsValid = true;
                if ($scope.IsOdomValid()) {
                    var createDriverDistanceRequest: Api.Models.ICreateDriverDistanceRequest = {
                        EmployeeUserId: this.$scope.Vm.SelectedUserId,
                        TripBusinessDay: moment(this.selectedDate).format(this.constants.InternalDateFormat),
                        StartDistance: Number(this.$scope.Vm.StartOdomRead),
                        EndDistance: Number(this.$scope.Vm.EndOdomRead)
                    };

                    if ($scope.Vm.ShowAuthorization) {
                        this.CreateAuthorizedEmployeeDriverDistance(createDriverDistanceRequest);
                    } else {
                        this.CreateEmployeeDriverDistance(createDriverDistanceRequest);
                    }
                }
            };

            $scope.Cancel = (): void => {
                $modalInstance.dismiss();
            };

            $scope.IsOdomValid = (): boolean => {
                if (Number($scope.Vm.EndOdomRead) > Number($scope.Vm.StartOdomRead)) {
                    $scope.Vm.ShowOdomError = false;
                    return true;
                }
                return false;
            };
        }

        private CreateEmployeeDriverDistance(createDriverDistanceRequest: Api.Models.ICreateDriverDistanceRequest): void {
            this.driverDistanceEmployeeService.Post(this.authService.GetUser().BusinessUser.MobileSettings.EntityId,createDriverDistanceRequest).then(() => {
                this.$modalInstance.close();
            });
        }

        private CreateAuthorizedEmployeeDriverDistance(createDriverDistanceRequest: Api.Models.ICreateDriverDistanceRequest): void {

            var createAuthorizedDriverDistanceRequest: Api.Models.ICreateAuthorizedDriverDistanceRequest = {
                CreateDriverDistanceRequest: createDriverDistanceRequest,
                Authorization: this.$scope.Vm.Authorize
            };

            this.driverDistanceManagerService.Post(this.authService.GetUser().BusinessUser.MobileSettings.EntityId,createAuthorizedDriverDistanceRequest).then(() => {
                this.$modalInstance.close();
                }, (result: ng.IHttpPromiseCallbackArg<Mx.Web.UI.Config.WebApi.IErrorMessage>) => {
                    switch (result.status) {
                        case 409:
                            this.$scope.Vm.Authorize.UserName = "";
                            this.$scope.Vm.Authorize.Password = "";
                            this.$scope.Vm.ValidationErrorMessage = result.data.Message;
                            this.$scope.Vm.AuthorizationIsValid = false;
                            break;
                        default:

                            break;
                    }
                });
        }
    }

    Core.NG.WorkforceDriverDistanceModule.RegisterNamedController("AddDriverDistanceController", AddDriverDistanceController,
        Core.NG.$typedScope<IAddDriverDistanceControllerScope>(),
        Core.Auth.$authService,
        Core.$translation,
        Core.NG.$modalInstance,
        Workforce.DriverDistance.Api.$driverDistanceEmployeeService,
        Workforce.DriverDistance.Api.$driverDistanceManagerService,
        Core.Constants,
        Core.NG.$typedCustomResolve<Date>("selectedDate")
        );
}
