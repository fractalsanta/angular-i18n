module Administration.User {
    "use strict";

    interface IUserControllerScope extends ng.IScope {
        Translations: Api.Models.ITranslations;

        SelectedLocation: Hierarchy.Services.ILocation;

        IncludeDescendents: boolean;
        IncludeTerminated: boolean;
        Ascending: boolean;
        SortProperty: string;

        GridDefinitions: { Title: string; Field: string; }[];
        Users: Api.Models.IUser[];

        AddUser(): void;
        EditUser(index: number): void;
        SortColumn(property: string): void;
        ToggleDescendents(flag: boolean): void;
        ToggleTerminated(flag: boolean): void;

        LocationSearchOptions: Core.Directives.IMxEntitySearchOptions;
    }

    class UserController {
        private User: Core.Auth.IUser;

        constructor(
            private $scope: IUserControllerScope,
            translation: Core.ITranslationService,
            notify: Core.IPopupMessageService,
            auth: Core.Auth.IAuthService,
            locationService: Hierarchy.Services.ILocationService,
            $modal: ng.ui.bootstrap.IModalService,
            $window: ng.IWindowService,
            private userService: Services.IUserService) {

            this.User = auth.GetUser();

            $scope.SelectedLocation = <Hierarchy.Services.ILocation>{
                Id: this.User.BusinessUser.MobileSettings.EntityId,
                Name: this.User.BusinessUser.MobileSettings.EntityName,
                Number: this.User.BusinessUser.MobileSettings.EntityNumber
            };

            locationService.SetDisplayName($scope.SelectedLocation);

            $scope.IncludeDescendents = false;
            $scope.IncludeTerminated = false;

            translation.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                notify.SetPageTitle(result.User.UserSetup);
                $scope.Translations = result.User;

                $scope.GridDefinitions = [
                    { Title: $scope.Translations.LocationNumber, Field: "Entity.Number" },
                    { Title: $scope.Translations.LocationName, Field: "Entity.Name" },
                    { Title: $scope.Translations.FirstName, Field: "FirstName" },
                    { Title: $scope.Translations.LastName, Field: "LastName" },
                    { Title: $scope.Translations.EmployeeNumber, Field: "EmployeeNumber" },
                    { Title: $scope.Translations.Username, Field: "UserName" }
                ];
            });

            $scope.SortColumn = (property: string): void => {
                var sortPath = property.split("."),
                    length = sortPath.length,
                    i;

                $scope.Ascending = !$scope.Ascending;

                if ($scope.SortProperty !== property) {
                    $scope.Ascending = true;
                }

                $scope.SortProperty = property;

                $scope.Users = _.sortBy($scope.Users, (user: Api.Models.IUser): any => {
                    var value = <any>user;

                    for (i = 0; i < length; i += 1) {
                        value = value[sortPath[i]];
                    }

                    return (<string>value).toLowerCase();
                });

                if (!$scope.Ascending) {
                    $scope.Users = $scope.Users.reverse();
                }
            };

            $scope.ToggleDescendents = (flag: boolean): void => {
                if ($scope.IncludeDescendents !== flag) {
                    $scope.IncludeDescendents = flag;
                    this.GetUsers();
                }
            };

            $scope.ToggleTerminated = (flag: boolean): void => {
                if ($scope.IncludeTerminated !== flag) {
                    $scope.IncludeTerminated = flag;
                    this.GetUsers();
                }
            };

            $scope.AddUser = (): void => {
                var modal = $modal.open(<ng.ui.bootstrap.IModalSettings>{
                    templateUrl: "/Areas/Administration/User/Templates/NewUser.html",
                    controller: "Administration.User.AddUserController",
                    windowClass: "smaller",
                    resolve: {
                        location: (): Hierarchy.Services.ILocation => {
                            return $scope.SelectedLocation;
                        }
                    }
                });
                modal.result.then((result: Api.Models.IUser[]): void => {
                    if (result) {
                        var length = result.length,
                            message: string,
                            i: number;

                        if (length === 0) {
                            return;
                        }

                        if (length === 1) {
                            message = result[0].FirstName + " " + result[0].LastName + " " + $scope.Translations.SuccessfullyAdded;
                        } else {
                            message = length + " " + $scope.Translations.UsersSuccessfullyAdded;
                        }

                        for (i = 0; i < result.length; i += 1) {
                            $scope.Users.push(result[i]);
                        }

                        $scope.Ascending = !this.$scope.Ascending;
                        $scope.SortColumn(this.$scope.SortProperty);

                        notify.ShowSuccess(message);

                        $window.scrollTo(0, 0);
                    }
                });
            };

            $scope.EditUser = (index: number): void => {
                var modal = $modal.open(<ng.ui.bootstrap.IModalSettings>{
                    templateUrl: "/Areas/Administration/User/Templates/EditUser.html",
                    controller: "Administration.User.EditUserController",
                    windowClass: "smaller",
                    resolve: {
                        user: (): Api.Models.IUser => {
                            return $scope.Users[index];
                        }
                    }
                });
                modal.result.then((result: Api.Models.IUser): void => {
                    if (!$scope.IncludeTerminated && result.Status === Services.UserStatusTypes.Terminated) {
                        $scope.Users.splice(index, 1);
                    } else {
                        $scope.Users[index] = result;
                        $scope.Ascending = !this.$scope.Ascending;
                        $scope.SortColumn(this.$scope.SortProperty);
                    }
                    notify.ShowSuccess($scope.Translations.ChangesMadeTo + result.FirstName + " " + result.LastName + $scope.Translations.SuccessfullySaved);
                    $window.scrollTo(0, 0);
                });
            };

            $scope.LocationSearchOptions = <Core.Directives.IMxEntitySearchOptions>{
                OnSelect: (location: Hierarchy.Services.ILocation): void => {
                    $scope.SelectedLocation = location;
                    $scope.IncludeDescendents = false;
                    this.GetUsers();
                }
            };

            this.GetUsers();
        }

        private GetUsers(): void {
            this.userService.GetUsers(this.$scope.SelectedLocation.Id, this.$scope.IncludeDescendents, this.$scope.IncludeTerminated)
                .success((result: Api.Models.IUser[]): void => {
                    this.$scope.Users = result;

                    // Must flip sort direction since SortColumn flips the sort direction.
                    // This will keep the sort direction when reloading users.
                    this.$scope.Ascending = !this.$scope.Ascending;
                    this.$scope.SortColumn(this.$scope.SortProperty || "LastName");
                });
        }
    }

    Core.NG.AdministrationUserModule.RegisterRouteController("", "Templates/User.html", UserController,
        Core.NG.$typedScope<IUserControllerScope>(),
        Core.$translation,
        Core.$popupMessageService,
        Core.Auth.$authService,
        Hierarchy.Services.$locationService,
        Core.NG.$modal,
        Core.NG.$window,
        Services.$userService
        );
}