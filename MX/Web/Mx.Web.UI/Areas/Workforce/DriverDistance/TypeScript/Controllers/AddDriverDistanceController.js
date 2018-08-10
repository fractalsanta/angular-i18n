var Workforce;
(function (Workforce) {
    var DriverDistance;
    (function (DriverDistance) {
        "use strict";
        var AddDriverDistanceController = (function () {
            function AddDriverDistanceController($scope, authService, translationService, $modalInstance, driverDistanceEmployeeService, driverDistanceManagerService, constants, selectedDate) {
                var _this = this;
                this.$scope = $scope;
                this.authService = authService;
                this.translationService = translationService;
                this.$modalInstance = $modalInstance;
                this.driverDistanceEmployeeService = driverDistanceEmployeeService;
                this.driverDistanceManagerService = driverDistanceManagerService;
                this.constants = constants;
                this.selectedDate = selectedDate;
                translationService.GetTranslations().then(function (l10NData) {
                    _this.$scope.L10N = l10NData.WorkforceDriverDistance;
                });
                $scope.Vm = {
                    AvailableUsers: [],
                    SelectedUserId: null,
                    StartOdomRead: null,
                    EndOdomRead: null,
                    Authorize: {},
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
                        .success(function (results) {
                        $scope.Vm.AvailableUsers = results;
                    });
                }
                else {
                    $scope.Vm.AvailableUsers = [{ Id: user.Id, FirstName: user.FirstName, LastName: user.LastName }];
                    $scope.Vm.SelectedUserId = user.Id;
                }
                $scope.Submit = function () {
                    if (!$scope.IsOdomValid()) {
                        $scope.Vm.ShowOdomError = true;
                        return;
                    }
                    $scope.Vm.AuthorizationIsValid = true;
                    if ($scope.IsOdomValid()) {
                        var createDriverDistanceRequest = {
                            EmployeeUserId: _this.$scope.Vm.SelectedUserId,
                            TripBusinessDay: moment(_this.selectedDate).format(_this.constants.InternalDateFormat),
                            StartDistance: Number(_this.$scope.Vm.StartOdomRead),
                            EndDistance: Number(_this.$scope.Vm.EndOdomRead)
                        };
                        if ($scope.Vm.ShowAuthorization) {
                            _this.CreateAuthorizedEmployeeDriverDistance(createDriverDistanceRequest);
                        }
                        else {
                            _this.CreateEmployeeDriverDistance(createDriverDistanceRequest);
                        }
                    }
                };
                $scope.Cancel = function () {
                    $modalInstance.dismiss();
                };
                $scope.IsOdomValid = function () {
                    if (Number($scope.Vm.EndOdomRead) > Number($scope.Vm.StartOdomRead)) {
                        $scope.Vm.ShowOdomError = false;
                        return true;
                    }
                    return false;
                };
            }
            AddDriverDistanceController.prototype.CreateEmployeeDriverDistance = function (createDriverDistanceRequest) {
                var _this = this;
                this.driverDistanceEmployeeService.Post(this.authService.GetUser().BusinessUser.MobileSettings.EntityId, createDriverDistanceRequest).then(function () {
                    _this.$modalInstance.close();
                });
            };
            AddDriverDistanceController.prototype.CreateAuthorizedEmployeeDriverDistance = function (createDriverDistanceRequest) {
                var _this = this;
                var createAuthorizedDriverDistanceRequest = {
                    CreateDriverDistanceRequest: createDriverDistanceRequest,
                    Authorization: this.$scope.Vm.Authorize
                };
                this.driverDistanceManagerService.Post(this.authService.GetUser().BusinessUser.MobileSettings.EntityId, createAuthorizedDriverDistanceRequest).then(function () {
                    _this.$modalInstance.close();
                }, function (result) {
                    switch (result.status) {
                        case 409:
                            _this.$scope.Vm.Authorize.UserName = "";
                            _this.$scope.Vm.Authorize.Password = "";
                            _this.$scope.Vm.ValidationErrorMessage = result.data.Message;
                            _this.$scope.Vm.AuthorizationIsValid = false;
                            break;
                        default:
                            break;
                    }
                });
            };
            return AddDriverDistanceController;
        }());
        DriverDistance.AddDriverDistanceController = AddDriverDistanceController;
        Core.NG.WorkforceDriverDistanceModule.RegisterNamedController("AddDriverDistanceController", AddDriverDistanceController, Core.NG.$typedScope(), Core.Auth.$authService, Core.$translation, Core.NG.$modalInstance, Workforce.DriverDistance.Api.$driverDistanceEmployeeService, Workforce.DriverDistance.Api.$driverDistanceManagerService, Core.Constants, Core.NG.$typedCustomResolve("selectedDate"));
    })(DriverDistance = Workforce.DriverDistance || (Workforce.DriverDistance = {}));
})(Workforce || (Workforce = {}));
