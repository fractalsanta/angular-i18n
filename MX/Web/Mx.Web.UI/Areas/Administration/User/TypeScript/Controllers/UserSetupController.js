var Administration;
(function (Administration) {
    var User;
    (function (User) {
        "use strict";
        var UserController = (function () {
            function UserController($scope, translation, notify, auth, locationService, $modal, $window, userService) {
                var _this = this;
                this.$scope = $scope;
                this.userService = userService;
                this.User = auth.GetUser();
                $scope.SelectedLocation = {
                    Id: this.User.BusinessUser.MobileSettings.EntityId,
                    Name: this.User.BusinessUser.MobileSettings.EntityName,
                    Number: this.User.BusinessUser.MobileSettings.EntityNumber
                };
                locationService.SetDisplayName($scope.SelectedLocation);
                $scope.IncludeDescendents = false;
                $scope.IncludeTerminated = false;
                translation.GetTranslations().then(function (result) {
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
                $scope.SortColumn = function (property) {
                    var sortPath = property.split("."), length = sortPath.length, i;
                    $scope.Ascending = !$scope.Ascending;
                    if ($scope.SortProperty !== property) {
                        $scope.Ascending = true;
                    }
                    $scope.SortProperty = property;
                    $scope.Users = _.sortBy($scope.Users, function (user) {
                        var value = user;
                        for (i = 0; i < length; i += 1) {
                            value = value[sortPath[i]];
                        }
                        return value.toLowerCase();
                    });
                    if (!$scope.Ascending) {
                        $scope.Users = $scope.Users.reverse();
                    }
                };
                $scope.ToggleDescendents = function (flag) {
                    if ($scope.IncludeDescendents !== flag) {
                        $scope.IncludeDescendents = flag;
                        _this.GetUsers();
                    }
                };
                $scope.ToggleTerminated = function (flag) {
                    if ($scope.IncludeTerminated !== flag) {
                        $scope.IncludeTerminated = flag;
                        _this.GetUsers();
                    }
                };
                $scope.AddUser = function () {
                    var modal = $modal.open({
                        templateUrl: "/Areas/Administration/User/Templates/NewUser.html",
                        controller: "Administration.User.AddUserController",
                        windowClass: "smaller",
                        resolve: {
                            location: function () {
                                return $scope.SelectedLocation;
                            }
                        }
                    });
                    modal.result.then(function (result) {
                        if (result) {
                            var length = result.length, message, i;
                            if (length === 0) {
                                return;
                            }
                            if (length === 1) {
                                message = result[0].FirstName + " " + result[0].LastName + " " + $scope.Translations.SuccessfullyAdded;
                            }
                            else {
                                message = length + " " + $scope.Translations.UsersSuccessfullyAdded;
                            }
                            for (i = 0; i < result.length; i += 1) {
                                $scope.Users.push(result[i]);
                            }
                            $scope.Ascending = !_this.$scope.Ascending;
                            $scope.SortColumn(_this.$scope.SortProperty);
                            notify.ShowSuccess(message);
                            $window.scrollTo(0, 0);
                        }
                    });
                };
                $scope.EditUser = function (index) {
                    var modal = $modal.open({
                        templateUrl: "/Areas/Administration/User/Templates/EditUser.html",
                        controller: "Administration.User.EditUserController",
                        windowClass: "smaller",
                        resolve: {
                            user: function () {
                                return $scope.Users[index];
                            }
                        }
                    });
                    modal.result.then(function (result) {
                        if (!$scope.IncludeTerminated && result.Status === User.Services.UserStatusTypes.Terminated) {
                            $scope.Users.splice(index, 1);
                        }
                        else {
                            $scope.Users[index] = result;
                            $scope.Ascending = !_this.$scope.Ascending;
                            $scope.SortColumn(_this.$scope.SortProperty);
                        }
                        notify.ShowSuccess($scope.Translations.ChangesMadeTo + result.FirstName + " " + result.LastName + $scope.Translations.SuccessfullySaved);
                        $window.scrollTo(0, 0);
                    });
                };
                $scope.LocationSearchOptions = {
                    OnSelect: function (location) {
                        $scope.SelectedLocation = location;
                        $scope.IncludeDescendents = false;
                        _this.GetUsers();
                    }
                };
                this.GetUsers();
            }
            UserController.prototype.GetUsers = function () {
                var _this = this;
                this.userService.GetUsers(this.$scope.SelectedLocation.Id, this.$scope.IncludeDescendents, this.$scope.IncludeTerminated)
                    .success(function (result) {
                    _this.$scope.Users = result;
                    _this.$scope.Ascending = !_this.$scope.Ascending;
                    _this.$scope.SortColumn(_this.$scope.SortProperty || "LastName");
                });
            };
            return UserController;
        }());
        Core.NG.AdministrationUserModule.RegisterRouteController("", "Templates/User.html", UserController, Core.NG.$typedScope(), Core.$translation, Core.$popupMessageService, Core.Auth.$authService, Administration.Hierarchy.Services.$locationService, Core.NG.$modal, Core.NG.$window, User.Services.$userService);
    })(User = Administration.User || (Administration.User = {}));
})(Administration || (Administration = {}));
