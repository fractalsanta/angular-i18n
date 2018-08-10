class Mocks {
    private _helper: PromiseHelper;
    constructor(private $q: ng.IQService) {
        this._helper = new PromiseHelper($q);
    }

    Measures(): Reporting.Dashboard.Api.IMeasuresService {
        return {
            GetMeasures: (entityId: number, typeId: number, groupId: number, selectedDate: string) => {
                var model: Reporting.Dashboard.Api.Models.IEntityMeasure[] = [
                    {
                        "Id": 2,
                        "TypeId": 2,
                        "ParentId": 1,
                        "Name": "Principal",
                        "LastUpdated": "2014-04-07T20:30:54",
                        "Measures": [
                            {
                                "Id": "CfaDiscounts",
                                "Intervals": [
                                    { "Id": 10, "Value": 853.0, "DisplayValue": "$853", "Class": "g" },
                                    { "Id": 20, "Value": 853.0, "DisplayValue": "$853", "Class": "g" },
                                    { "Id": 30, "Value": 853.0, "DisplayValue": "$853", "Class": "g" },
                                    { "Id": 40, "Value": 0.0, "DisplayValue": "$0", "Class": "g" },
                                    { "Id": 50, "Value": 0.0, "DisplayValue": "$0", "Class": "g" }
                                ]
                            }, {
                                "Id": "NetSales",
                                "Intervals": [
                                    { "Id": 10, "Value": 180332.0, "DisplayValue": "$180,332", "Class": "n" },
                                    { "Id": 20, "Value": 180332.0, "DisplayValue": "$180,332", "Class": "n" },
                                    { "Id": 30, "Value": 1939094.0, "DisplayValue": "$1,939,094", "Class": "r" },
                                    { "Id": 40, "Value": 0.0, "DisplayValue": "$0", "Class": "n" },
                                    { "Id": 50, "Value": 89055.0, "DisplayValue": "$89,055", "Class": "n" }
                                ]
                            }, {
                                "Id": "TransactionCount",
                                "Intervals": [
                                    { "Id": 10, "Value": 23215.0, "DisplayValue": "23,215", "Class": "n" },
                                    { "Id": 20, "Value": 23215.0, "DisplayValue": "23,215", "Class": "n" },
                                    { "Id": 30, "Value": 231410.0, "DisplayValue": "231,410", "Class": "n" },
                                    { "Id": 40, "Value": 0.0, "DisplayValue": "0", "Class": "n" },
                                    { "Id": 50, "Value": 11000.0, "DisplayValue": "11,000", "Class": "n" }
                                ]
                            }, {
                                "Id": "TicketAverage",
                                "Intervals": [
                                    { "Id": 10, "Value": 7.77, "DisplayValue": "$7.77", "Class": "n" },
                                    { "Id": 20, "Value": 7.77, "DisplayValue": "$7.77", "Class": "n" },
                                    { "Id": 30, "Value": 8.38, "DisplayValue": "$8.38", "Class": "n" },
                                    { "Id": 40, "Value": 0.0, "DisplayValue": "$0.00", "Class": "n" },
                                    { "Id": 50, "Value": 8.1, "DisplayValue": "$8.10", "Class": "n" }
                                ]
                            }
                        ]
                    },
                    {
                        "Id": 1,
                        "TypeId": 1,
                        "ParentId": 1,
                        "Name": "Corporation",
                        "LastUpdated": "2014-04-07T20:30:54",
                        "Measures": [
                            {
                                "Id": "CfaDiscounts",
                                "Intervals": [
                                    { "Id": 10, "Value": 853.0, "DisplayValue": "$853", "Class": "g" },
                                    { "Id": 20, "Value": 853.0, "DisplayValue": "$853", "Class": "g" },
                                    { "Id": 30, "Value": 853.0, "DisplayValue": "$853", "Class": "g" },
                                    { "Id": 40, "Value": 0.0, "DisplayValue": "$0", "Class": "g" },
                                    { "Id": 50, "Value": 0.0, "DisplayValue": "$0", "Class": "g" }
                                ]
                            }, {
                                "Id": "NetSales",
                                "Intervals": [
                                    { "Id": 10, "Value": 180332.0, "DisplayValue": "$180,332", "Class": "n" },
                                    { "Id": 20, "Value": 180332.0, "DisplayValue": "$180,332", "Class": "n" },
                                    { "Id": 30, "Value": 1950851.0, "DisplayValue": "$1,950,851", "Class": "r" },
                                    { "Id": 40, "Value": 0.0, "DisplayValue": "$0", "Class": "n" },
                                    { "Id": 50, "Value": 89397.0, "DisplayValue": "$89,397", "Class": "n" }
                                ]
                            }, {
                                "Id": "TransactionCount",
                                "Intervals": [
                                    { "Id": 10, "Value": 23215.0, "DisplayValue": "23,215", "Class": "n" },
                                    { "Id": 20, "Value": 23215.0, "DisplayValue": "23,215", "Class": "n" },
                                    { "Id": 30, "Value": 233372.0, "DisplayValue": "233,372", "Class": "n" },
                                    { "Id": 40, "Value": 0.0, "DisplayValue": "0", "Class": "n" },
                                    { "Id": 50, "Value": 11005.0, "DisplayValue": "11,005", "Class": "n" }
                                ]
                            }, {
                                "Id": "TicketAverage",
                                "Intervals": [
                                    { "Id": 10, "Value": 7.77, "DisplayValue": "$7.77", "Class": "n" },
                                    { "Id": 20, "Value": 7.77, "DisplayValue": "$7.77", "Class": "n" },
                                    { "Id": 30, "Value": 8.36, "DisplayValue": "$8.36", "Class": "n" },
                                    { "Id": 40, "Value": 0.0, "DisplayValue": "$0.00", "Class": "n" },
                                    { "Id": 50, "Value": 8.12, "DisplayValue": "$8.12", "Class": "n" }
                                ]
                            }
                        ]
                    }
                ];
                return this._helper.CreateHttpPromise(model);
            },

            GetMeasureDrilldown: (id: number, date: string, measureKey: string)=> {
                var model: Reporting.Dashboard.Api.Models.IDrillDownData = { Points: [] };
                return this._helper.CreateHttpPromise(model);
            }
        };
    }

    Translations(): Core.ITranslationService {
        return {
            GetTranslations: ()=> {
                var model = <Core.Api.Models.ITranslations>{ Dashboard: {} };
                return this._helper.CreatePromise(model);
            }
        };
    }

    ReferenceData(): Reporting.Dashboard.Api.IReferenceDataService {
        return {
            Get: ()=> {
                var model: Reporting.Dashboard.Api.Models.IReferenceData = {
                    "Today": "2014-04-07T00:00:00-04:00",
                    "Groups": [
                        {
                            "Id": 10,
                            "Name": "Sales",
                            "Measures": [
                                { "Id": "NetSales", "Name": null, "Chart": "column", "ChartSubtitle": null },
                                { "Id": "TransactionCount", "Name": null, "Chart": "column", "ChartSubtitle": null },
                                { "Id": "TicketAverage", "Name": null, "Chart": "bar", "ChartSubtitle": null }
                            ]
                        },
                        { "Id": 20, "Name": "Product", "Measures": [] },
                        { "Id": 30, "Name": "Labor", "Measures": [] },
                        { "Id": 40, "Name": "Kpis", "Measures": [] },
                        { "Id": 50, "Name": "Status", "Measures": [] }
                    ],
                    "Intervals": [10, 20, 30, 40, 50]
                };
                return this._helper.CreateHttpPromise(model);
            }
        };
    }


    Graph(): Reporting.Dashboard.IDashboardService {
        var dummy = {};
        return {
            GetBarGraphOptions: (points, title) => dummy,
            GetLineGraphOptions: (points, title) => dummy,
            GetPieChartOptions: (points, title) => dummy,
            GetVerticalBarGraphOptions: (points, title) => dummy,
            SetChartTitle(options, title) {
            }
        };
    }

    Auth(): Core.Auth.IAuthService {
        var businessUser: Core.Api.Models.IBusinessUser = {
            "Id": 1,
            "UserName": "systemadmin",
            "FirstName": "System",
            "LastName": "Administrator",
            "EmployeeId": 1,
            "EmployeeNumber": "8002",
            "Culture": "en-US",
            "PinToken": "",
            "Status": 1,
            "MobileSettings": { "EntityId": 320, "EntityName": "31427 - Saint Petersburg, FL", "EntityNumber": "31427", "FavouriteStores": [] },
            "Permission": {
                "Usage": { "1": 1152921503533105151, "2": 1152912433635917695, "3": 2305843009213693919, "4": 864690991015657471, "5": 184603470089549823, "6": 2305842897544543743, "7": 1044835113549954751, "8": 583229398497365005, "9": 576179032644399874, "10": 54992937064410, "20": 206677700615 },
                "GroupIds": [9, 10, 29, 57, 37, 58],
                "AllowedTasks": [60, 141, 172, 1217, 1218, 1219, 1229, 1230, 1231, 1233, 1234, 1237, 1238, 1239, 1240, 1242, 1243, 1244, 1245, 1253, 1254]
            },
            "AssignedLocations": [4, 9, 25, 29, 80, 82, 116, 117, 118, 121, 134, 135, 154, 166, 173, 188, 196, 269, 296, 304, 308, 309, 310, 316, 318, 320, 330, 339, 345, 348, 350, 408, 411, 415, 419, 428, 438, 448, 458, 478, 531, 534, 535, 555, 579, 591, 593, 599, 615, 619, 622, 630, 639, 640, 641, 642, 644, 645, 646, 647, 648, 649, 650, 651, 652, 655, 656, 840, 841, 849, 863],
            "EntityIdBase": 1,
            "EntityTypeId": 1
        };

        var logonResponse: Core.Auth.Api.Models.ILogonResponse = { AuthToken: "111", User: businessUser, IsSharedCookieUsed: false};
        return  {
            Logon: () => this._helper.CreateHttpPromise(logonResponse),
            LogonWithPin: () => this._helper.CreateHttpPromise(logonResponse),
            LogonWithPinChallenge: () => this._helper.CreateHttpPromise(logonResponse),
            Logout: () => { },
            GetUser: () => {
                return {
                    IsAuthenticated: true,
                    BusinessUser: businessUser
                }
            },
            GetPinUserName: () => {
                return businessUser.UserName;
            },
            CheckPermissionsAllowance: () => true,
            CheckPermissionAllowance: () => true,
            SetPinNumber: () => null,
            ClearPinNumber: () => { },
            GetAuthToken: () => "",
            IsSharedCookieMode: () => false
        };
    }
}
