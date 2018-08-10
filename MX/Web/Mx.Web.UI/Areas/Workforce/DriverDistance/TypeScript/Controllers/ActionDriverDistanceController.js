var Workforce;
(function (Workforce) {
    var DriverDistance;
    (function (DriverDistance) {
        "use strict";
        var DriverDistanceStatus = DriverDistance.Api.Models.Enums.DriverDistanceStatus;
        var ActionDriverDistanceController = (function () {
            function ActionDriverDistanceController($scope, modalInstance, translationService, authService, driverDistanceManagerService, recordToAction, newStatus) {
                this.$scope = $scope;
                this.translationService = translationService;
                this.authService = authService;
                this.recordToAction = recordToAction;
                this.newStatus = newStatus;
                $scope.Vm = {
                    ActionTitle: "",
                    ActionMessage: "",
                    Authorization: { UserName: "", Password: "" },
                    AuthorizationIsValid: true,
                    ValidationErrorMessage: "",
                    SubmitButtonClass: "",
                    SubmitButtonText: ""
                };
                $scope.AreRequiredFieldsSet = function () {
                    return (!!$scope.Vm.Authorization.UserName && !!$scope.Vm.Authorization.Password);
                };
                $scope.Submit = function () {
                    if ($scope.AreRequiredFieldsSet()) {
                        var actionRequest = {
                            DriverDistanceId: recordToAction.Id,
                            Authorization: $scope.Vm.Authorization,
                            Status: newStatus
                        };
                        $scope.Vm.AuthorizationIsValid = true;
                        driverDistanceManagerService.PutActionDriverDistanceRecord(authService.GetUser().BusinessUser.MobileSettings.EntityId, actionRequest)
                            .success(function () {
                            modalInstance.close();
                        }).then(null, function (response) {
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
                $scope.Cancel = function () {
                    modalInstance.dismiss();
                };
                if (newStatus === DriverDistanceStatus.Pending) {
                    $scope.Cancel();
                }
                this.LoadTranslations();
            }
            ActionDriverDistanceController.prototype.LoadTranslations = function () {
                var _this = this;
                this.translationService.GetTranslations().then(function (translations) {
                    _this.$scope.L10N = translations.WorkforceDriverDistance;
                    _this.InitializeViewModelTranslations(_this.$scope.L10N);
                });
            };
            ActionDriverDistanceController.prototype.InitializeViewModelTranslations = function (translations) {
                var actionTitle = "", actionMessage = "", submitButtonClass = "", submitButtonText = "";
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
            };
            ActionDriverDistanceController.ApprovalSubmitButtonClass = "btn-success";
            ActionDriverDistanceController.DenySubmitButtonClass = "btn-danger";
            ActionDriverDistanceController.RecordToActionResolveName = "recordToAction";
            ActionDriverDistanceController.NewStatusResolveName = "newStatus";
            return ActionDriverDistanceController;
        }());
        DriverDistance.ActionDriverDistanceController = ActionDriverDistanceController;
        Core.NG.WorkforceDriverDistanceModule.RegisterNamedController("ActionDriverDistanceController", ActionDriverDistanceController, Core.NG.$typedScope(), Core.NG.$modalInstance, Core.$translation, Core.Auth.$authService, DriverDistance.Api.$driverDistanceManagerService, Core.NG.$typedCustomResolve(ActionDriverDistanceController.RecordToActionResolveName), Core.NG.$typedCustomResolve(ActionDriverDistanceController.NewStatusResolveName));
    })(DriverDistance = Workforce.DriverDistance || (Workforce.DriverDistance = {}));
})(Workforce || (Workforce = {}));
