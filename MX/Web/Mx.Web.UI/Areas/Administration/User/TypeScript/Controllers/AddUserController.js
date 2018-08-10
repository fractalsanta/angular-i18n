var Administration;
(function (Administration) {
    var User;
    (function (User) {
        "use strict";
        var AddUserController = (function () {
            function AddUserController($scope, translation, popup, $window, $modalInstance, location, userService) {
                var _this = this;
                this.$scope = $scope;
                this.translation = translation;
                this.popup = popup;
                this.userService = userService;
                $scope.SecurityGroups = [];
                $scope.CurrentLocation = location;
                $scope.IsUsernameModified = false;
                $scope.NewUsers = [];
                this.ResetUserData();
                translation.GetTranslations().then(function (result) {
                    $scope.Translations = result.User;
                });
                popup.Dismiss();
                $scope.Confirm = function (isDone) {
                    _this.PopulateSecurityGroups();
                    userService.CreateNewUser($scope.CurrentLocation.Id, $scope.NewUser.EmployeeNumber, $scope.NewUser.FirstName, $scope.NewUser.LastName, $scope.NewUser.MiddleName, $scope.NewUser.UserName, $scope.NewUser.Password, $scope.NewUser.SecurityGroups)
                        .then(function (response) {
                        $scope.NewUser.Entity = $scope.CurrentLocation;
                        var createdUser = {
                            Id: response.data,
                            Password: $scope.NewUser.Password,
                            UserName: $scope.NewUser.UserName,
                            EmployeeNumber: $scope.NewUser.EmployeeNumber,
                            FirstName: $scope.NewUser.FirstName,
                            MiddleName: $scope.NewUser.MiddleName,
                            LastName: $scope.NewUser.LastName,
                            SecurityGroups: $scope.NewUser.SecurityGroups,
                            Entity: $scope.NewUser.Entity,
                            Status: $scope.NewUser.Status
                        };
                        $scope.NewUsers.push(createdUser);
                        _this.$scope.FormScope.$setPristine();
                        _this.ResetUserData();
                        popup.ShowSuccess(createdUser.FirstName + " " + createdUser.LastName + " " + $scope.Translations.SuccessfullyAdded);
                        if (isDone === true) {
                            $modalInstance.close($scope.NewUsers);
                        }
                    }, function (response) {
                        popup.ShowError($scope.Translations[response.statusText]);
                    });
                };
                $scope.AddAnother = function (formScope) {
                    $scope.FormScope = formScope;
                    if (_this.Validate()) {
                        popup.Dismiss();
                        $scope.Confirm(false);
                    }
                    $window.scrollTo(0, 0);
                };
                $scope.SaveAndClose = function (formScope) {
                    $scope.FormScope = formScope;
                    if ($scope.FormScope.$dirty) {
                        if (_this.Validate()) {
                            popup.Dismiss();
                            $scope.Confirm(true);
                        }
                    }
                    else {
                        $modalInstance.close($scope.NewUsers);
                    }
                };
                $scope.Cancel = function () {
                    if ((!$scope.FormScope || $scope.FormScope.$dirty) && $scope.NewUsers.length < 1) {
                        popup.Dismiss();
                        $modalInstance.dismiss();
                    }
                    else {
                        $modalInstance.close($scope.NewUsers);
                    }
                };
                $scope.OnRowClick = function (sg, formScope) {
                    if (!sg.IsEditable && sg.IsDefault) {
                        return;
                    }
                    formScope.$setDirty();
                    sg.IsDefault = !sg.IsDefault;
                };
                $scope.GetSuggestedUserName = function () {
                    var fName = $scope.NewUser.FirstName, lName = $scope.NewUser.LastName;
                    if (fName && lName && !$scope.IsUsernameModified) {
                        userService.GenerateUserName($scope.NewUser.FirstName, $scope.NewUser.LastName).success(function (result) {
                            if (result) {
                                $scope.NewUser.UserName = result.replace(/"/g, "");
                            }
                        });
                    }
                };
                $scope.UserNameModified = function () {
                    if ($scope.NewUser.UserName) {
                        $scope.IsUsernameModified = true;
                    }
                    else {
                        $scope.IsUsernameModified = false;
                    }
                };
            }
            AddUserController.prototype.Validate = function () {
                var result = this.userService.Validate(this.$scope.NewUser);
                if (result === 0) {
                    return true;
                }
                if (result === 1) {
                    this.popup.ShowError(this.$scope.Translations.PswdLengthMustBeSixAndSixteen);
                }
                if (result === 2) {
                    this.popup.ShowError(this.$scope.Translations.PswdDoNotMatch);
                }
                if (result === 3) {
                    this.popup.ShowError(this.$scope.Translations.NoSpecialCharacterForEmployeeNumber);
                }
                return false;
            };
            AddUserController.prototype.PopulateSecurityGroups = function () {
                this.$scope.NewUser.SecurityGroups = [];
                var i, sg;
                for (i = 0; i < this.$scope.SecurityGroups.length; i += 1) {
                    sg = this.$scope.SecurityGroups[i];
                    var newUserSgIdIndex = this.$scope.NewUser.SecurityGroups.indexOf(sg.Id);
                    if (sg.IsDefault === true && (newUserSgIdIndex < 0)) {
                        this.$scope.NewUser.SecurityGroups.push(sg.Id);
                    }
                }
            };
            AddUserController.prototype.ResetUserData = function () {
                var _this = this;
                this.$scope.NewUser = {
                    Id: null,
                    Password: "",
                    ConfirmPassword: "",
                    UserName: "",
                    EmployeeNumber: "",
                    FirstName: "",
                    MiddleName: "",
                    LastName: "",
                    SecurityGroups: [],
                    Entity: null,
                    Status: User.Services.UserStatusTypes.Active
                };
                this.userService.GetSecurityGroups().success(function (groups) {
                    _this.$scope.SecurityGroups = groups;
                });
                this.$scope.IsUsernameModified = false;
            };
            return AddUserController;
        }());
        Core.NG.AdministrationUserModule.RegisterNamedController("AddUserController", AddUserController, Core.NG.$typedScope(), Core.$translation, Core.$popupMessageService, Core.NG.$window, Core.NG.$modalInstance, Core.NG.$typedCustomResolve("location"), User.Services.$userService);
    })(User = Administration.User || (Administration.User = {}));
})(Administration || (Administration = {}));
