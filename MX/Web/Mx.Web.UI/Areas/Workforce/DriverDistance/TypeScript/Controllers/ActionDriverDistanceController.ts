module Workforce.DriverDistance {
    "use strict";

    import DriverDistanceStatus = Api.Models.Enums.DriverDistanceStatus;

    export class ActionDriverDistanceController {
        public static ApprovalSubmitButtonClass: string = "btn-success";
        public static DenySubmitButtonClass: string = "btn-danger";

        public static RecordToActionResolveName: string = "recordToAction";
        public static NewStatusResolveName: string = "newStatus";

        constructor(
            private $scope: IActionDriverDistanceControllerScope,
            modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private translationService: Core.ITranslationService,
            private authService: Core.Auth.IAuthService,
            driverDistanceManagerService: Api.IDriverDistanceManagerService,
            private recordToAction: Api.Models.IDriverDistanceRecord,
            private newStatus: DriverDistanceStatus
            ) {

            $scope.Vm = {
                ActionTitle: "",
                ActionMessage: "",
                Authorization: { UserName: "", Password: "" },
                AuthorizationIsValid: true,
                ValidationErrorMessage: "",
                SubmitButtonClass: "",
                SubmitButtonText: ""
            };

            $scope.AreRequiredFieldsSet = (): boolean => {
                return (!!$scope.Vm.Authorization.UserName && !!$scope.Vm.Authorization.Password);
            };

            $scope.Submit = (): void => {
                if ($scope.AreRequiredFieldsSet()) {
                    var actionRequest: Api.Models.IActionDriverDistanceRequest = {
                        DriverDistanceId: recordToAction.Id,
                        Authorization: $scope.Vm.Authorization,
                        Status: newStatus
                    };

                    $scope.Vm.AuthorizationIsValid = true;

                    driverDistanceManagerService.PutActionDriverDistanceRecord(authService.GetUser().BusinessUser.MobileSettings.EntityId,actionRequest)
                        .success((): void => {
                            modalInstance.close();
                        }).then(null, (response: ng.IHttpPromiseCallbackArg<Mx.Web.UI.Config.WebApi.IErrorMessage>): void => {
                            switch (response.status) {
                                case 409:
                                    $scope.Vm.Authorization.UserName = "";
                                    $scope.Vm.Authorization.Password = "";
                                    $scope.Vm.AuthorizationIsValid = false;
                                    $scope.Vm.ValidationErrorMessage = response.data.Message;
                                    break;
                                default:
                                    break;
                            }
                        });
                }
            };

            $scope.Cancel = (): void => {
                modalInstance.dismiss();
            };

            if (newStatus === DriverDistanceStatus.Pending) {
                $scope.Cancel();
            }

            this.LoadTranslations();
        }

        public LoadTranslations(): void {
            this.translationService.GetTranslations().then((translations: Core.Api.Models.ITranslations): void => {
                this.$scope.L10N = translations.WorkforceDriverDistance;
                this.InitializeViewModelTranslations(this.$scope.L10N);
            });
        }

        public InitializeViewModelTranslations(translations: Api.Models.IL10N): void {
            var actionTitle = "",
                actionMessage = "",
                submitButtonClass = "",
                submitButtonText = "";

            switch (this.newStatus) {
                case DriverDistanceStatus.Approved:
                    actionTitle = translations.ApproveTitle;
                    actionMessage = translations.ApproveMessage;
                    submitButtonText = translations.Submit;
                    submitButtonClass = ActionDriverDistanceController.ApprovalSubmitButtonClass;
                    break;
                case DriverDistanceStatus.Denied:
                    actionTitle = translations.DenyTitle;
                    actionMessage = translations.DenyMessage;
                    submitButtonText = translations.Deny;
                    submitButtonClass = ActionDriverDistanceController.DenySubmitButtonClass;
                default:
                    break;
            }

            this.$scope.Vm.ActionTitle = actionTitle;
            this.$scope.Vm.ActionMessage = actionMessage + " " + this.recordToAction.EmployeeName + "?";
            this.$scope.Vm.SubmitButtonText = submitButtonText;
            this.$scope.Vm.SubmitButtonClass = submitButtonClass;
        }
    }

    Core.NG.WorkforceDriverDistanceModule.RegisterNamedController("ActionDriverDistanceController", ActionDriverDistanceController,
        Core.NG.$typedScope<IActionDriverDistanceControllerScope>(),
        Core.NG.$modalInstance,
        Core.$translation,
        Core.Auth.$authService,
        Api.$driverDistanceManagerService,
        Core.NG.$typedCustomResolve<Api.Models.IDriverDistanceRecord>(ActionDriverDistanceController.RecordToActionResolveName),
        Core.NG.$typedCustomResolve<DriverDistanceStatus>(ActionDriverDistanceController.NewStatusResolveName));
}