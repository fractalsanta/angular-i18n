module Core.Tests {
    "use strict";

    export class TranslationServiceMock implements IMock<Core.ITranslationService> {

        private _translations: Api.Models.ITranslations;
        private _helper: PromiseHelper;

        constructor(private $q: ng.IQService) {
            this._helper = new PromiseHelper($q);

            this._translations = {
                Core: <Core.Api.Models.IL10N>{
                    Cancel: "Cancel"
                },
                ChangeStore: <Administration.ChangeStore.Api.Models.IL10N>{},
                MyAccount: <Administration.MyAccount.Api.Models.IL10N>{},
                Settings: <Administration.Settings.Api.Models.IL10N>{ Save: "Save" },
                Authentication: <Core.Auth.Api.Models.IL10N>{},
                InventoryCount: <Inventory.Count.Api.Models.IL10N>{
                    Receive: "TestReceiveTranslation",
                    Order: "TestOrderTranslation"
                },
                InventoryOrder: <Inventory.Order.Api.Models.IL10N>{
                    Pending: "TestPendingTranslation",
                    PageSummary: "TestPageSummaryTranslation",
                    Last: "TestLastTranslation",
                    Days: "TestDaysTranslation",
                    TheOrderHasBeenPushedToTomorrow: "TheOrderHasBeenPushedToTomorrow"
                },
                InventoryTransfer: <Inventory.Transfer.Api.Models.IL10N>{
                    AltUnit1: "Alt Unit 1",
                    AltUnit2: "Alt Unit 2",
                    AltUnit3: "Alt Unit 3",
                    BaseUnit: "Base Unit"
                },
                InventoryWaste: <Inventory.Waste.Api.Models.IL10N>{},
                Dashboard: <Reporting.Dashboard.Api.Models.IL10N>{},
                Forecasting: <Forecasting.Api.Models.ITranslations>{},
                ForecastingPromotions: <Forecasting.Api.Models.IPromotionTranslations>{
                    PromotionDeleted: "PromotionDeleted",
                    PromotionUpdated: "PromotionUpdated"
                },
                DataLoad: <Administration.DataLoad.Api.Models.IL10N>{},
                Hierarchy: <Administration.Hierarchy.Api.Models.ITranslations>{},
                User: <Administration.User.Api.Models.ITranslations>{},
                Notifications: <Core.Api.Models.Notifications.IL10N>{},
                WorkforceMySchedule: <Workforce.MySchedule.Api.Models.IL10N>{},
                WorkforceMyAvailability: <Workforce.MyAvailability.Api.Models.IL10N>{},
                WorkforceMyTimeCard: <Workforce.MyTimeCard.Api.Models.IL10N>{},
                WorkforceMyTimeOff: <Workforce.MyTimeOff.Api.Models.IL10N>{},
                WorkforceMyDetails: <Workforce.MyDetails.Api.Models.IL10N>{},
                PartnerRedirect: <Core.PartnerRedirect.Api.Models.IL10N>{},
                WorkforceDeliveries: <Workforce.Deliveries.Api.Models.IL10N>{},
                WorkforceDriverDistance: <Workforce.DriverDistance.Api.Models.IL10N>{},
                OperationsReporting: <Operations.Reporting.Api.Models.IL10N>{},
                OperationsReportingStoreSummary: <Operations.Reporting.StoreSummary.Api.Models.IL10N>{},
                OperationsReportingAreaSummary: <Operations.Reporting.AreaSummary.Api.Models.IL10N>{},
                OperationsReportingInventoryMovement: <Operations.Reporting.InventoryMovement.Api.Models.IL10N>{},
                OperationsReportingProductMix: <Operations.Reporting.ProductMix.Api.Models.IL10N>{},
                InventoryProduction: <Inventory.Production.Api.Models.IL10N>{}
            };
        }

        public InjectTranslations(translations: Core.Api.Models.ITranslations): void {
            this._translations = translations;
        }

        public Object: Core.ITranslationService = {
            GetTranslations: () => {
                return this._helper.CreatePromise(this._translations);
            }
        }

    }
}