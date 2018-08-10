module Administration.User {
    "use strict";

    interface IEditUserControllerScope extends ng.IScope {
        Translations: Api.Models.ITranslations;
        FormScope: ng.IFormController;

        Cancel(): void;
        Confirm(isDone: boolean): void;
        SaveAndClose(formScope: ng.IFormController): void;
        Update(formScope: ng.IFormController): void;

        CurrentUser: Services.IUserWithPassword;
        SecurityGroups: Api.Models.ISecurityGroup[];
        UserStatuses: { Name: string; Value: string }[];

        OnRowClick(sg: Api.Models.ISecurityGroup, formScope: ng.IFormController): void;
        GetSuggestedUserName(): void;

        IsUsernameModified: boolean;
        UserNameModified(): void;
        StatusChange(): void;

        IsSecurityGroupModified: boolean;
    }

    class EditUserController {
        constructor(
            private $scope: IEditUserControllerScope,
            private translation: Core.ITranslationService,
            private popup: Core.IPopupMessageService,
            $window: ng.IWindowService,
            $modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            user: Api.Models.IUser,
            confirmationService: Core.IConfirmationService,
            private userService: Services.IUserService
            ) {
            popup.Dismiss();

            this.ResetUserData(user);

            translation.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                $scope.Translations = result.User;
                $scope.UserStatuses = [{ Name: $scope.Translations.Active, Value: Services.UserStatusTypes.Active },
                    { Name: $scope.Translations.Terminated, Value: Services.UserStatusTypes.Terminated }];

            });

            $scope.Confirm = (isDone: boolean): void => {

                userService.UpdateBasicUser($scope.CurrentUser.Id, $scope.CurrentUser.Entity.Id, $scope.CurrentUser.EmployeeNumber, $scope.CurrentUser.FirstName,
                        $scope.CurrentUser.LastName, $scope.CurrentUser.MiddleName, $scope.CurrentUser.UserName, $scope.CurrentUser.Password, $scope.CurrentUser.Status)
                    .then(
                    () => {
                        if ($scope.IsSecurityGroupModified) {
                            userService.UpdateUserSecurityGroups($scope.CurrentUser.Id, $scope.CurrentUser.SecurityGroups)
                            .then(
                                () => {
                                    $scope.FormScope.$setPristine();
                                    $scope.IsSecurityGroupModified = false;
                                    popup.ShowSuccess($scope.Translations.SaveSuccessful);

                                    if (isDone) {
                                        $modalInstance.close($scope.CurrentUser);
                                    }
                                },
                                (response) => {
                                    popup.ShowError($scope.Translations[response.statusText]);
                                });
                        } else {
                            $scope.FormScope.$setPristine();
                            popup.ShowSuccess($scope.Translations.SaveSuccessful);

                            if (isDone) {
                                $modalInstance.close($scope.CurrentUser);
                            }
                        }
                    },
                    (response) => {
                        popup.ShowError($scope.Translations[response.statusText]);
                    });
            };

            $scope.StatusChange = (): void => {
                var updatedStatus = $scope.CurrentUser.Status,
                    originalStatus = user.Status;

                if (originalStatus === Services.UserStatusTypes.Terminated) {
                    return;
                }

                $scope.CurrentUser.Status = user.Status;

                if (updatedStatus !== originalStatus) {
                    confirmationService.Confirm({
                        Title: $scope.Translations.TerminateUser,
                        Message: $scope.Translations.TerminateUserConfirmMsg,
                        ConfirmText: $scope.Translations.TerminateUserTerminate,
                        ConfirmationType: Core.ConfirmationTypeEnum.Danger
                    }).then((result: boolean): void => {
                            if (result) {
                                $scope.CurrentUser.Status = updatedStatus;
                            }
                        }
                        );
                }
            };

            $scope.SaveAndClose = (formScope: ng.IFormController): void => {
                $scope.FormScope = formScope;
                if ($scope.FormScope.$dirty) {
                    if (this.Validate()) {
                        popup.Dismiss();
                        $scope.Confirm(true);
                    }
                } else {
                    $modalInstance.close($scope.CurrentUser);
                }
            };

            $scope.Cancel = (): void => {
                if (!$scope.FormScope || $scope.FormScope.$dirty) {
                    $modalInstance.dismiss();
                } else {
                    $modalInstance.close($scope.CurrentUser);
                }
            };

            $scope.Update = (formScope: ng.IFormController): void => {
                $scope.FormScope = formScope;
                if (this.Validate()) {
                    popup.Dismiss();
                    $scope.Confirm(false);
                }
            };

            $scope.OnRowClick = (sg: Api.Models.ISecurityGroup, formScope: ng.IFormController): void => {
                if (!sg.IsEditable && sg.IsDefault) {
                    return;
                }

                sg.IsDefault = !sg.IsDefault;

                if (sg.IsDefault) {
                    $scope.CurrentUser.SecurityGroups.push(sg.Id);
                } else {
                    $scope.CurrentUser.SecurityGroups.splice($scope.CurrentUser.SecurityGroups.indexOf(sg.Id), 1);
                }

                formScope.$setDirty();
                $scope.IsSecurityGroupModified = true;
            };

            $scope.GetSuggestedUserName = (): void => {
                var fName = $scope.CurrentUser.FirstName,
                    lName = $scope.CurrentUser.LastName;

                if (fName && lName && !$scope.IsUsernameModified && (fName[0] !== user.FirstName[0] || lName !== user.LastName)) {
                    userService.GenerateUserName($scope.CurrentUser.FirstName, $scope.CurrentUser.LastName).success((result: string): void => {
                        if (result) {
                            $scope.CurrentUser.UserName = result.replace(/"/g, "");
                        }
                    });
                }
            };

            $scope.UserNameModified = (): void => {
                if ($scope.CurrentUser.UserName) {
                    $scope.IsUsernameModified = true;
                } else {
                    $scope.IsUsernameModified = false;
                }
            };
        }

        private Validate(): boolean {
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
        }

        private PopulateSecurityGroups(): void {
            var i, j, sgId: number;

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
        }

        private ResetDefaultSecurityGroups(): void {
            var j: number;
            for (j = 0; j < this.$scope.SecurityGroups.length; j += 1) {
                this.$scope.SecurityGroups[j].IsDefault = false;
            }
        }

        private ResetUserData(user: Api.Models.IUser): void {

            this.$scope.SecurityGroups = [];

            this.$scope.CurrentUser = <Services.IUserWithPassword>{
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

            this.userService.GetSecurityGroups().success((groups: Api.Models.ISecurityGroup[]): void => {
                this.$scope.SecurityGroups = groups;
                this.PopulateSecurityGroups();
            });

            this.$scope.IsSecurityGroupModified = false;
        }
    }

    Core.NG.AdministrationUserModule.RegisterNamedController("EditUserController", EditUserController,
        Core.NG.$typedScope<IEditUserControllerScope>(),
        Core.$translation,
        Core.$popupMessageService,
        Core.NG.$window,
        Core.NG.$modalInstance,
        Core.NG.$typedCustomResolve<Api.Models.IUser>("user"),
        Core.$confirmationService,
        Services.$userService
        );
}