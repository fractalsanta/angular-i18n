var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        describe("FinishReceiveOrderController", function () {
            var q;
            var mocks;
            var rootScope;
            var scope;
            var controller;
            var authService;
            var receiveOrderServiceMock;
            var constantsMock;
            var invoiceNumber = "1234";
            beforeEach(function () {
                angular.mock.module(Core.NG.InventoryOrderModule.Module().name);
                inject(function ($q, $rootScope) {
                    q = $q;
                    mocks = new FinishReceiveOrderMocks($q);
                    rootScope = $rootScope;
                    receiveOrderServiceMock = new Order.ReceiveOrderServiceMock($q);
                });
                scope = rootScope.$new(false);
                authService = new Core.Tests.AuthServiceMock();
                constantsMock = new ConstantsMock();
                controller = new Order.FinishReceiveOrderController(scope, mocks.ModalService, mocks.TranslationService, invoiceNumber, authService.Object, mocks.PeriodCloseService, receiveOrderServiceMock.Object, constantsMock.Object);
            });
            it("gets initialized properly", function () {
                expect(scope.Model).toBeDefined();
                expect(scope.Model.PeriodClosed).toEqual(false);
                expect(scope.Cancel).toBeDefined();
                expect(scope.Confirm).toBeDefined();
                expect(scope.IsApplyDateValid).toBeDefined();
                expect(controller.GetCurrentDateTime).toBeDefined();
            });
            it("receives Translations and Store Time", function () {
                rootScope.$digest();
                expect(scope.Translations.ReceiveOrderSubmitInProgress).toEqual("TestReceiveOrderSubmitInProgressTranslation");
                expect(moment(scope.Model.ApplyDate).format(constantsMock.Object.InternalDateTimeFormat)).toEqual(receiveOrderServiceMock.GetDateString());
            });
            it("validates Date", function () {
                controller.GetCurrentDateTime = function () {
                    return moment.utc("2013-03-26 09:30:26");
                };
                expect(scope.IsApplyDateValid(new Date(Date.UTC(2013, 2, 26, 9, 30, 27)))).toEqual(false);
                expect(scope.IsApplyDateValid(new Date(Date.UTC(2013, 2, 26, 9, 30, 25)))).toEqual(true);
                expect(scope.IsApplyDateValid(null)).toEqual(false);
                expect(scope.IsApplyDateValid(undefined)).toEqual(false);
                expect(scope.IsApplyDateValid(new Date("try to parse this smarty pants"))).toEqual(false);
            });
            it("cancels correctly", function () {
                spyOn(mocks.ModalService, "dismiss");
                scope.Cancel();
                expect(mocks.ModalService.dismiss).toHaveBeenCalled();
            });
            it("submits correctly", function () {
                rootScope.$digest();
                spyOn(mocks.ModalService, "close");
                scope.Confirm();
                expect(mocks.ModalService.close).toHaveBeenCalledWith({
                    ApplyDate: scope.Model.ApplyDate,
                    InvoiceNumber: invoiceNumber
                });
            });
            it("period closed when user cannot edit closed periods", function () {
                authService.GrantAllPermissions(false);
                rootScope.$digest();
                expect(scope.Model.PeriodClosed).toEqual(true);
            });
        });
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
