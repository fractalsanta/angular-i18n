var Administration;
(function (Administration) {
    var User;
    (function (User) {
        var Services;
        (function (Services) {
            "use strict";
            var UserStatusTypes = (function () {
                function UserStatusTypes() {
                }
                UserStatusTypes.Active = "Active";
                UserStatusTypes.Terminated = "Terminated";
                return UserStatusTypes;
            }());
            Services.UserStatusTypes = UserStatusTypes;
            var UserService = (function () {
                function UserService($q, userService, $timeout) {
                    this.$q = $q;
                    this.userService = userService;
                    this.$timeout = $timeout;
                }
                UserService.prototype.GetUsers = function (entityId, includeDescendents, includeTerminated) {
                    return this.userService.GetUsers(entityId, includeDescendents, includeTerminated);
                };
                UserService.prototype.CreateNewUser = function (entityId, employeeNumber, firstName, lastName, middleName, userName, password, securityGroups) {
                    return this.userService.PostCreateNewUser(entityId, employeeNumber, firstName, lastName, middleName, userName, password, securityGroups);
                };
                UserService.prototype.UpdateBasicUser = function (id, entityId, employeeNumber, firstName, lastName, middleName, userName, password, status) {
                    return this.userService.PutUpdateBasicUser(id, entityId, employeeNumber, firstName, lastName, middleName, userName, password, status);
                };
                UserService.prototype.GenerateUserName = function (firstname, lastName) {
                    return this.userService.GetUserNameFromFirstNameAndLastName(firstname, lastName);
                };
                UserService.prototype.UpdateUserSecurityGroups = function (userId, securityGroups) {
                    return this.userService.PutUpdateUserSecurityGroups(userId, securityGroups);
                };
                UserService.prototype.GetSecurityGroups = function () {
                    return this.userService.GetSecurityGroups();
                };
                UserService.prototype.Validate = function (currentUser) {
                    var psw1 = currentUser.Password, psw2 = currentUser.ConfirmPassword;
                    if (psw1 || psw2) {
                        if (psw1.length < 6 || psw1.length > 16) {
                            return 1;
                        }
                        if (psw1 !== psw2) {
                            return 2;
                        }
                    }
                    var empNumber = currentUser.EmployeeNumber, regexp = new RegExp("^[\\w\\s-]+$"), noSpecialChar = regexp.test(empNumber);
                    if (!noSpecialChar) {
                        return 3;
                    }
                    return 0;
                };
                return UserService;
            }());
            Services.UserService = UserService;
            Services.$userService = Core.NG.AdministrationHierarchyModule.RegisterService("UserService", UserService, Core.NG.$q, User.Api.$userService, Core.NG.$timeout);
        })(Services = User.Services || (User.Services = {}));
    })(User = Administration.User || (Administration.User = {}));
})(Administration || (Administration = {}));
