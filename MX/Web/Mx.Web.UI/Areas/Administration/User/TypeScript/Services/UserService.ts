module Administration.User.Services {
    "use strict";

    export interface IUserService {
        GetUsers(entityId: number, includeDescendents: boolean, includeTerminated: boolean): ng.IHttpPromise<Api.Models.IUser[]>;
        GetSecurityGroups(): ng.IHttpPromise<Api.Models.ISecurityGroup[]>;
        CreateNewUser(entityId: number, employeeNumber: string, firstName: string, lastName: string, middleName: string,
            userName: string, password: string, securityGroups: number[]): ng.IHttpPromise<number>;
        GenerateUserName(firstName: string, lastName: string): ng.IHttpPromise<string>;
        UpdateBasicUser(id: number, entityId: number, employeeNumber: string, firstName: string, lastName: string,
            middleName: string, userName: string, password: string, status: string): ng.IHttpPromise<{}>;
        UpdateUserSecurityGroups(userId: number, securityGroups: number[]): ng.IHttpPromise<{}>;
        Validate(currentUser: IUserWithPassword): number;
    }

    export interface IUserWithPassword extends Api.Models.IUser {
        Password: string;
        ConfirmPassword: string;
    }

    export class UserStatusTypes {
        static Active = "Active";
        static Terminated = "Terminated";
    }

    export class UserService implements IUserService {

        constructor(private $q: ng.IQService, private userService: Api.IUserService, private $timeout: ng.ITimeoutService) {
        }

        public GetUsers(entityId: number, includeDescendents: boolean, includeTerminated: boolean): ng.IHttpPromise<Api.Models.IUser[]> {
            return this.userService.GetUsers(entityId, includeDescendents, includeTerminated);
        }

        public CreateNewUser(entityId: number, employeeNumber: string, firstName: string, lastName: string, middleName: string,
            userName: string, password: string, securityGroups: number[]): ng.IHttpPromise<number> {
            return this.userService.PostCreateNewUser(entityId, employeeNumber, firstName, lastName, middleName, userName, password, securityGroups);
        }

        public UpdateBasicUser(id: number, entityId: number, employeeNumber: string, firstName: string, lastName: string,
            middleName: string, userName: string, password: string, status: string): ng.IHttpPromise<{}> {
            return this.userService.PutUpdateBasicUser(id, entityId, employeeNumber, firstName,
                lastName, middleName, userName, password, status);
        }

        public GenerateUserName(firstname: string, lastName: string): ng.IHttpPromise<string> {
            return this.userService.GetUserNameFromFirstNameAndLastName(firstname, lastName);
        }

        public UpdateUserSecurityGroups(userId: number, securityGroups: number[]): ng.IHttpPromise<{}> {
            return this.userService.PutUpdateUserSecurityGroups(userId, securityGroups);
        }

        public GetSecurityGroups(): ng.IHttpPromise<Administration.User.Api.Models.ISecurityGroup[]> {
            return this.userService.GetSecurityGroups();
        }

        public Validate(currentUser: IUserWithPassword): number {
            var psw1 = currentUser.Password,
                psw2 = currentUser.ConfirmPassword;
            if (psw1 || psw2) {
                if (psw1.length < 6 || psw1.length > 16) {
                    return 1;
                }
                if (psw1 !== psw2) {
                    return 2;
                }
            }

            var empNumber = currentUser.EmployeeNumber,
                regexp = new RegExp("^[\\w\\s-]+$"),
                noSpecialChar = regexp.test(empNumber);

            if (!noSpecialChar) {
                return 3;
            }

            return 0;
        }
    }

    export var $userService: Core.NG.INamedService<IUserService> = Core.NG.AdministrationHierarchyModule.RegisterService("UserService", UserService,
        Core.NG.$q,
        Api.$userService,
        Core.NG.$timeout
        );
} 