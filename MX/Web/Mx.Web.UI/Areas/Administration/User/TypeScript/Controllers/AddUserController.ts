module Administration.User {
    "use strict";

    interface IAddUserControllerScope extends ng.IScope {
        Translations: Api.Models.ITranslations;
        NewUser: Services.IUserWithPassword;
        NewUsers: Services.IUserWithPassword[];
        FormScope: ng.IFormController;

        Cancel(): void;
        AddAnother(formScope: ng.IFormController): void;
        Confirm(isDone: boolean): void;
        SaveAndClose(formScope: ng.IFormController): void;
        GetSuggestedUserName(): void;

        CurrentLocation: Hierarchy.Services.ILocation;
        SecurityGroups: Api.Models.ISecurityGroup[];

        OnRowClick(sg: Api.Models.ISecurityGroup, formScope: ng.IFormController): void;
        UserNameModified(): void;

        IsUsernameModified: boolean;
    }

    class AddUserController {
        constructor(
            private $scope: IAddUserControllerScope,
            private translation: Core.ITranslationService,
            private popup: Core.IPopupMessageService,
            $window: ng.IWindowService,
            $modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            location: Hierarchy.Services.ILocation,
            private userService: Services.IUserService
            ) {
            $scope.SecurityGroups = [];

            $scope.CurrentLocation = location;
            $scope.IsUsernameModified = false;
            $scope.NewUsers = [];

            this.ResetUserData();

            translation.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                $scope.Translations = result.User;
            });

            popup.Dismiss();

            $scope.Confirm = (isDone: boolean): void => {

                this.PopulateSecurityGroups();

                userService.CreateNewUser($scope.CurrentLocation.Id, $scope.NewUser.EmployeeNumber, $scope.NewUser.FirstName, $scope.NewUser.LastName, $scope.NewUser.MiddleName,
                        $scope.NewUser.UserName, $scope.NewUser.Password, $scope.NewUser.SecurityGroups)
                    .then(
                    (response) => {
                        $scope.NewUser.Entity = $scope.CurrentLocation;

                        var createdUser = <Services.IUserWithPassword>{
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

                        this.$scope.FormScope.$setPristine();
                        this.ResetUserData();

                        popup.ShowSuccess(createdUser.FirstName + " " + createdUser.LastName + " " + $scope.Translations.SuccessfullyAdded);

                        if (isDone === true) {
                            $modalInstance.close($scope.NewUsers);
                        }
                    },
                    (response) => {
                        popup.ShowError($scope.Translations[response.statusText]);
                    });
            };

            $scope.AddAnother = (formScope: ng.IFormController): void => {
                $scope.FormScope = formScope;
                if (this.Validate()) {
                    popup.Dismiss();
                    $scope.Confirm(false);
                }
                $window.scrollTo(0, 0);
            };

            $scope.SaveAndClose = (formScope: ng.IFormController): void => {
                $scope.FormScope = formScope;
                if ($scope.FormScope.$dirty) {
                    if (this.Validate()) {
                        popup.Dismiss();
                        $scope.Confirm(true);
                    }
                } else {
                    $modalInstance.close($scope.NewUsers);
                }
            };

            $scope.Cancel = (): void => {
                if ((!$scope.FormScope || $scope.FormScope.$dirty) && $scope.NewUsers.length < 1) {
                    popup.Dismiss();
                    $modalInstance.dismiss();
                } else {
                    $modalInstance.close($scope.NewUsers);
                }
            };

            $scope.OnRowClick = (sg: Api.Models.ISecurityGroup, formScope: ng.IFormController): void => {
                if (!sg.IsEditable && sg.IsDefault) {
                    return;
                }

                formScope.$setDirty();
                sg.IsDefault = !sg.IsDefault;
            };

            $scope.GetSuggestedUserName = (): void => {
                var fName = $scope.NewUser.FirstName,
                    lName = $scope.NewUser.LastName;

                if (fName && lName && !$scope.IsUsernameModified) {
                    userService.GenerateUserName($scope.NewUser.FirstName, $scope.NewUser.LastName).success((result: string): void => {
                        if (result) {
                            $scope.NewUser.UserName = result.replace(/"/g, "");
                        }
                    });
                }
            };

            $scope.UserNameModified = (): void => {
                if ($scope.NewUser.UserName) {
                    $scope.IsUsernameModified = true;
                } else {
                    $scope.IsUsernameModified = false;
                }
            };
        }

        private Validate(): boolean {
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
        }

        private PopulateSecurityGroups(): void {
            this.$scope.NewUser.SecurityGroups = [];
            var i: number, sg: Api.Models.ISecurityGroup;
            for (i = 0; i < this.$scope.SecurityGroups.length; i += 1) {
                sg = this.$scope.SecurityGroups[i];
                var newUserSgIdIndex = this.$scope.NewUser.SecurityGroups.indexOf(sg.Id);
                if (sg.IsDefault === true && (newUserSgIdIndex < 0)) {
                    this.$scope.NewUser.SecurityGroups.push(sg.Id);
                }
            }
        }

        private ResetUserData(): void {

            this.$scope.NewUser = <Services.IUserWithPassword>{
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
                Status: Services.UserStatusTypes.Active
            };

            this.userService.GetSecurityGroups().success((groups: Api.Models.ISecurityGroup[]): void => {
                this.$scope.SecurityGroups = groups;
            });

            this.$scope.IsUsernameModified = false;
        }
    }

    Core.NG.AdministrationUserModule.RegisterNamedController("AddUserController", AddUserController,
        Core.NG.$typedScope<IAddUserControllerScope>(),
        Core.$translation,
        Core.$popupMessageService,
        Core.NG.$window,
        Core.NG.$modalInstance,
        Core.NG.$typedCustomResolve<Hierarchy.Services.ILocation>("location"),
        Services.$userService
        );
}