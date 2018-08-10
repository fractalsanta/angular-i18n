var Administration;
(function (Administration) {
    var User;
    (function (User) {
        "use strict";
        var EditUserController = (function () {
            function EditUserController($scope, translation, popup, $window, $modalInstance, user, confirmationService, userService) {
                var _this = this;
                this.$scope = $scope;
                this.translation = translation;
                this.popup = popup;
                this.userService = userService;
                popup.Dismiss();
                this.ResetUserData(user);
                translation.GetTranslations().then(function (result) {
                    $scope.Translations = result.User;
                    $scope.UserStatuses = [{ Name: $scope.Translations.Active, Value: User.Services.UserStatusTypes.Active },
                        { Name: $scope.Translations.Terminated, Value: User.Services.UserStatusTypes.Terminated }];
                });
                $scope.Confirm = function (isDone) {
                    userService.UpdateBasicUser($scope.CurrentUser.Id, $scope.CurrentUser.Entity.Id, $scope.CurrentUser.EmployeeNumber, $scope.CurrentUser.FirstName, $scope.CurrentUser.LastName, $scope.CurrentUser.MiddleName, $scope.CurrentUser.UserName, $scope.CurrentUser.Password, $scope.CurrentUser.Status)
                        .then(function () {
                        if ($scope.IsSecurityGroupModified) {
                            userService.UpdateUserSecurityGroups($scope.CurrentUser.Id, $scope.CurrentUser.SecurityGroups)
                                .then(function () {
                                $scope.FormScope.$setPristine();
                                $scope.IsSecurityGroupModified = false;
                                popup.ShowSuccess($scope.Translations.SaveSuccessful);
                                if (isDone) {
                                    $modalInstance.close($scope.CurrentUser);
                                }
                            }, function (response) {
                                popup.ShowError($scope.Translations[response.statusText]);
                            });
                        }
                        else {
                            $scope.FormScope.$setPristine();
                            popup.ShowSuccess($scope.Translations.SaveSuccessful);
                            if (isDone) {
                                $modalInstance.close($scope.CurrentUser);
                            }
                        }
                    }, function (response) {
                        popup.ShowError($scope.Translations[response.statusText]);
                    });
                };
                $scope.StatusChange = function () {
                    var updatedStatus = $scope.CurrentUser.Status, originalStatus = user.Status;
                    if (originalStatus === User.Services.UserStatusTypes.Terminated) {
                        return;
                    }
                    $scope.CurrentUser.Status = user.Status;
                    if (updatedStatus !== originalStatus) {
                        confirmationService.Confirm({
                            Title: $scope.Translations.TerminateUser,
                            Message: $scope.Translations.TerminateUserConfirmMsg,
                            ConfirmText: $scope.Translations.TerminateUserTerminate,
                            ConfirmationType: Core.ConfirmationTypeEnum.Danger
                        }).then(function (result) {
                            if (result) {
                                $scope.CurrentUser.Status = updatedStatus;
                            }
                        });
                    }
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
                        $modalInstance.close($scope.CurrentUser);
                    }
                };
                $scope.Cancel = function () {
                    if (!$scope.FormScope || $scope.FormScope.$dirty) {
                        $modalInstance.dismiss();
                    }
                    else {
                        $modalInstance.close($scope.CurrentUser);
                    }
                };
                $scope.Update = function (formScope) {
                    $scope.FormScope = formScope;
                    if (_this.Validate()) {
                        popup.Dismiss();
                        $scope.Confirm(false);
                    }
                };
                $scope.OnRowClick = function (sg, formScope) {
                    if (!sg.IsEditable && sg.IsDefault) {
                        return;
                    }
                    sg.IsDefault = !sg.IsDefault;
                    if (sg.IsDefault) {
                        $scope.CurrentUser.SecurityGroups.push(sg.Id);
                    }
                    else {
                        $scope.CurrentUser.SecurityGroups.splice($scope.CurrentUser.SecurityGroups.indexOf(sg.Id), 1);
                    }
                    formScope.$setDirty();
                    $scope.IsSecurityGroupModified = true;
                };
                $scope.GetSuggestedUserName = function () {
                    var fName = $scope.CurrentUser.FirstName, lName = $scope.CurrentUser.LastName;
                    if (fName && lName && !$scope.IsUsernameModified && (fName[0] !== user.FirstName[0] || lName !== user.LastName)) {
                        userService.GenerateUserName($scope.CurrentUser.FirstName, $scope.CurrentUser.LastName).success(function (result) {
                            if (result) {
                                $scope.CurrentUser.UserName = result.replace(/"/g, "");
                            }
                        });
                    }
                };
                $scope.UserNameModified = function () {
                    if ($scope.CurrentUser.UserName) {
                        $scope.IsUsernameModified = true;
                    }
                    else {
                        $scope.IsUsernameModified = false;
                    }
                };
            }
            EditUserController.prototype.Validate = function () {
                var result = this.userService.Validate(this.$scope.CurrentUser);
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
            EditUserController.prototype.PopulateSecurityGroups = function () {
                var i, j, sgId;
                this.ResetDefaultSecurityGroups();
                for (i = 0; i < this.$scope.CurrentUser.SecurityGroups.length; i += 1) {
                    sgId = this.$scope.CurrentUser.SecurityGroups[i];
                    for (j = 0; j < this.$scope.SecurityGroups.length; j += 1) {
                        var sg = this.$scope.SecurityGroups[j];
                        if (sgId === sg.Id) {
                            sg.IsDefault = true;
                            continue;
                        }
                    }
                }
            };
            EditUserController.prototype.ResetDefaultSecurityGroups = function () {
                var j;
                for (j = 0; j < this.$scope.SecurityGroups.length; j += 1) {
                    this.$scope.SecurityGroups[j].IsDefault = false;
                }
            };
            EditUserController.prototype.ResetUserData = function (user) {
                var _this = this;
                this.$scope.SecurityGroups = [];
                this.$scope.CurrentUser = {
                    Id: user.Id,
                    Password: "",
                    ConfirmPassword: "",
                    UserName: user.UserName,
                    EmployeeNumber: user.EmployeeNumber,
                    FirstName: user.FirstName,
                    MiddleName: user.MiddleName ? user.MiddleName : "",
                    LastName: user.LastName,
                    SecurityGroups: [],
                    Entity: user.Entity ? user.Entity : null,
                    Status: user.Status
                };
                for (var i = 0; i < user.SecurityGroups.length; i += 1) {
                    this.$scope.CurrentUser.SecurityGroups.push(user.SecurityGroups[i]);
                }
                this.userService.GetSecurityGroups().success(function (groups) {
                    _this.$scope.SecurityGroups = groups;
                    _this.PopulateSecurityGroups();
                });
                this.$scope.IsSecurityGroupModified = false;
            };
            return EditUserController;
        }());
        Core.NG.AdministrationUserModule.RegisterNamedController("EditUserController", EditUserController, Core.NG.$typedScope(), Core.$translation, Core.$popupMessageService, Core.NG.$window, Core.NG.$modalInstance, Core.NG.$typedCustomResolve("user"), Core.$confirmationService, User.Services.$userService);
    })(User = Administration.User || (Administration.User = {}));
})(Administration || (Administration = {}));
