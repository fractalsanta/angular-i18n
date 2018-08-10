var Inventory;
(function (Inventory) {
    var Order;
    (function (Order) {
        describe("@ts ChangeApplyDateController", function () {
            var q;
            var mocks;
            var rootScope;
            var scope;
            var controller;
            var authServiceMock;
            var receiveOrderServiceMock;
            var constantsMock;
            beforeEach(function () {
                angular.mock.module(Core.NG.InventoryOrderModule.Module().name);
                inject(function ($q, $rootScope) {
                    q = $q;
                    mocks = new ChangeApplyDateMocks($q);
                    rootScope = $rootScope;
                    authServiceMock = new Core.Tests.AuthServiceMock();
                    authServiceMock.GrantAllPermissions(false);
                    receiveOrderServiceMock = new Order.ReceiveOrderServiceMock($q);
                });
                scope = rootScope.$new(false);
                constantsMock = new ConstantsMock();
                controller = new Order.ChangeApplyDateController(scope, mocks.ModalService, mocks.TranslationService, mocks.PeriodCloseService, authServiceMock.Object, receiveOrderServiceMock.Object, constantsMock.Object);
            });
            it("gets initialized properly", function () {
                expect(scope.Model).toBeDefined();
                expect(scope.Cancel).toBeDefined();
                expect(scope.Confirm).toBeDefined();
                expect(scope.Model.ShowApplyDate).toBeDefined();
                expect(scope.Model.ShowApplyDate).toEqual(false);
                expect(scope.OpenApplyDate).toBeDefined();
                expect(scope.IsApplyDateValid).toBeDefined();
                expect(controller.GetCurrentDateTime).toBeDefined();
            });
            it("receives Translations and Store Time", function () {
                rootScope.$digest();
                expect(scope.Translations).toBeDefined();
                expect(scope.Translations.ChangeApplyDateMessage).toEqual("<APPLY DATE MESSAGE>");
                expect(scope.Translations.ChangeApplyDateSuccessful).toEqual("Apply date and time updated.");
                expect(moment(scope.Model.ApplyDate).format(constantsMock.Object.InternalDateTimeFormat)).toEqual(receiveOrderServiceMock.GetDateString());
                expect(scope.Model.ApplyDate).toEqual(scope.Model.MaxDate);
            });
            it("ensures apply date validation accepts now or dates in the past and rejects invalid dates and future dates", function () {
                controller.GetCurrentDateTime = function () {
                    return moment.utc("2013-12-31 23:59:59");
                };
                expect(scope.IsApplyDateValid(null)).toEqual(false);
                expect(scope.IsApplyDateValid(new Date("try to parse this smarty pants"))).toEqual(false);
                expect(scope.IsApplyDateValid(controller.GetCurrentDateTime().subtract('M', 2).toDate())).toEqual(true);
                expect(scope.IsApplyDateValid(controller.GetCurrentDateTime().subtract('s', 1).toDate())).toEqual(true);
                expect(scope.IsApplyDateValid(controller.GetCurrentDateTime().toDate())).toEqual(true);
                expect(scope.IsApplyDateValid(controller.GetCurrentDateTime().add('s', 1).toDate())).toEqual(false);
                expect(scope.IsApplyDateValid(controller.GetCurrentDateTime().add('d', 6).toDate())).toEqual(false);
            });
            it("cancels correctly", function () {
                spyOn(mocks.ModalService, "dismiss");
                scope.Cancel();
                expect(mocks.ModalService.dismiss).toHaveBeenCalled();
            });
            it("confirms correctly", function () {
                rootScope.$digest();
                spyOn(mocks.ModalService, "close");
                scope.Confirm();
                expect(mocks.ModalService.close).toHaveBeenCalled();
            });
        });
    })(Order = Inventory.Order || (Inventory.Order = {}));
})(Inventory || (Inventory = {}));
