var Core;
(function (Core) {
    var Tests;
    (function (Tests) {
        "use strict";
        var TranslationServiceMock = (function () {
            function TranslationServiceMock($q) {
                var _this = this;
                this.$q = $q;
                this.Object = {
                    GetTranslations: function () {
                        return _this._helper.CreatePromise(_this._translations);
                    }
                };
                this._helper = new PromiseHelper($q);
                this._translations = {
                    Core: {
                        Cancel: "Cancel"
                    },
                    ChangeStore: {},
                    MyAccount: {},
                    Settings: { Save: "Save" },
                    Authentication: {},
                    InventoryCount: {
                        Receive: "TestReceiveTranslation",
                        Order: "TestOrderTranslation"
                    },
                    InventoryOrder: {
                        Pending: "TestPendingTranslation",
                        PageSummary: "TestPageSummaryTranslation",
                        Last: "TestLastTranslation",
                        Days: "TestDaysTranslation",
                        TheOrderHasBeenPushedToTomorrow: "TheOrderHasBeenPushedToTomorrow"
                    },
                    InventoryTransfer: {
                        AltUnit1: "Alt Unit 1",
                        AltUnit2: "Alt Unit 2",
                        AltUnit3: "Alt Unit 3",
                        BaseUnit: "Base Unit"
                    },
                    InventoryWaste: {},
                    Dashboard: {},
                    Forecasting: {},
                    ForecastingPromotions: {
                        PromotionDeleted: "PromotionDeleted",
                        PromotionUpdated: "PromotionUpdated"
                    },
                    DataLoad: {},
                    Hierarchy: {},
                    User: {},
                    Notifications: {},
                    WorkforceMySchedule: {},
                    WorkforceMyAvailability: {},
                    WorkforceMyTimeCard: {},
                    WorkforceMyTimeOff: {},
                    WorkforceMyDetails: {},
                    PartnerRedirect: {},
                    WorkforceDeliveries: {},
                    WorkforceDriverDistance: {},
                    OperationsReporting: {},
                    OperationsReportingStoreSummary: {},
                    OperationsReportingAreaSummary: {},
                    OperationsReportingInventoryMovement: {},
                    OperationsReportingProductMix: {},
                    InventoryProduction: {}
                };
            }
            TranslationServiceMock.prototype.InjectTranslations = function (translations) {
                this._translations = translations;
            };
            return TranslationServiceMock;
        }());
        Tests.TranslationServiceMock = TranslationServiceMock;
    })(Tests = Core.Tests || (Core.Tests = {}));
})(Core || (Core = {}));
