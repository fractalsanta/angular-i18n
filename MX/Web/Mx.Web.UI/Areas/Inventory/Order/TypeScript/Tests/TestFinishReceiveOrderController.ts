/// <reference path="../../../../Core/Tests/TestFramework.ts" />
/// <reference path="../../../../../Scripts/angular-ui/validate.ts" />
/// <reference path="Mocks.ts" />
/// <reference path="MockReceiveOrderService.ts" />
/// <reference path="../../../../Core/TypeScript/LocalTimeTracker.ts" />
/// <reference path="../Interfaces/IBaseApplyDateControllerScope.d.ts" />
/// <reference path="../Controllers/BaseApplyDateController.ts" />
/// <reference path="../Interfaces/IFinishReceiveOrder.d.ts" />
/// <reference path="../Interfaces/IFinishReceiveOrderScope.d.ts" />
/// <reference path="../Controllers/FinishReceiveOrderController.ts" />

module Inventory.Order {
    describe("FinishReceiveOrderController", () => {
        var q: ng.IQService;
        var mocks: FinishReceiveOrderMocks;
        var rootScope: ng.IRootScopeService;
        var scope: IFinishReceiveOrderScope;
        var controller: FinishReceiveOrderController;
        var authService: Core.Tests.AuthServiceMock;
        var receiveOrderServiceMock: ReceiveOrderServiceMock;
        var constantsMock: ConstantsMock;
        var invoiceNumber: string = "1234";

        beforeEach(() => {
            angular.mock.module(Core.NG.InventoryOrderModule.Module().name);
            inject(($q: ng.IQService, $rootScope: ng.IRootScopeService) => {
                q = $q;
                mocks = new FinishReceiveOrderMocks($q);
                rootScope = $rootScope;
                receiveOrderServiceMock = new ReceiveOrderServiceMock($q);
            });

            scope = <IFinishReceiveOrderScope>rootScope.$new(false);
            authService = new Core.Tests.AuthServiceMock();
            constantsMock = new ConstantsMock();

            controller = new FinishReceiveOrderController(
                scope,
                mocks.ModalService,
                mocks.TranslationService,
                invoiceNumber,
                authService.Object,
                mocks.PeriodCloseService,
                receiveOrderServiceMock.Object,
                constantsMock.Object
            );
        });

        it("gets initialized properly", ()=> {
            expect(scope.Model).toBeDefined();
            expect(scope.Model.PeriodClosed).toEqual(false);
            expect(scope.Cancel).toBeDefined();
            expect(scope.Confirm).toBeDefined();
            expect(scope.IsApplyDateValid).toBeDefined();
            expect(controller.GetCurrentDateTime).toBeDefined();            
        });

        it("receives Translations and Store Time", () => {
            rootScope.$digest(); // invoke the callbacks
            expect(scope.Translations.ReceiveOrderSubmitInProgress).toEqual("TestReceiveOrderSubmitInProgressTranslation");
            expect(moment(scope.Model.ApplyDate).format(constantsMock.Object.InternalDateTimeFormat)).toEqual(receiveOrderServiceMock.GetDateString());
        });

        it("validates Date", ()=> {
            controller.GetCurrentDateTime = () => {
                return moment.utc("2013-03-26 09:30:26");
            };

            // remember that months for Date() start at 0
            expect(scope.IsApplyDateValid(new Date(Date.UTC(2013,2,26,9,30,27)))).toEqual(false);
            expect(scope.IsApplyDateValid(new Date(Date.UTC(2013,2,26,9,30,25)))).toEqual(true);
            expect(scope.IsApplyDateValid(null)).toEqual(false);
            expect(scope.IsApplyDateValid(undefined)).toEqual(false);
            expect(scope.IsApplyDateValid(new Date("try to parse this smarty pants"))).toEqual(false);
        });

        it("cancels correctly", ()=> {
            spyOn(mocks.ModalService, "dismiss");
            scope.Cancel();

            expect(mocks.ModalService.dismiss).toHaveBeenCalled();
        });

        it("submits correctly", () => {
            rootScope.$digest(); // invoke the callbacks
            spyOn(mocks.ModalService, "close");
            
            scope.Confirm();
            expect(mocks.ModalService.close).toHaveBeenCalledWith(<IFinishReceiveOrder> {
                ApplyDate: scope.Model.ApplyDate,
                InvoiceNumber: invoiceNumber
            });
        });
        
        it("period closed when user cannot edit closed periods", () => {
            authService.GrantAllPermissions(false);
            rootScope.$digest();
            expect(scope.Model.PeriodClosed).toEqual(true);
        });        
    });
}