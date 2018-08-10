/// <reference path="../../../../Core/Tests/TestFramework.ts" />
/// <reference path="../../../../../Scripts/angular-ui/validate.ts" />
/// <reference path="Mocks.ts" />
/// <reference path="MockReceiveOrderService.ts" />
/// <reference path="../../../../Core/TypeScript/LocalTimeTracker.ts" />
/// <reference path="../Interfaces/IBaseApplyDateControllerScope.d.ts" />
/// <reference path="../Controllers/BaseApplyDateController.ts" />
/// <reference path="../Interfaces/IChangeApplyDateControllerScope.d.ts" />
/// <reference path="../Controllers/ChangeApplyDateController.ts" />

module Inventory.Order {
    import Auth = Core.Auth;
    describe("@ts ChangeApplyDateController", () => {
        var q: ng.IQService;
        var mocks: ChangeApplyDateMocks;      
        var rootScope: ng.IRootScopeService;
        var scope: IChangeApplyDateControllerScope;
        var controller: ChangeApplyDateController;
        var authServiceMock: Core.Tests.AuthServiceMock;        
        var receiveOrderServiceMock: ReceiveOrderServiceMock;
        var constantsMock: ConstantsMock;

        beforeEach(() => {
            angular.mock.module(Core.NG.InventoryOrderModule.Module().name);
            inject(($q: ng.IQService, $rootScope: ng.IRootScopeService) => {
                q = $q;
                mocks = new ChangeApplyDateMocks($q);
                rootScope = $rootScope;
                authServiceMock = new Core.Tests.AuthServiceMock();
                authServiceMock.GrantAllPermissions(false);
                receiveOrderServiceMock = new ReceiveOrderServiceMock($q);
            });

            scope = <IChangeApplyDateControllerScope>rootScope.$new(false);
            constantsMock = new ConstantsMock();

            controller = new ChangeApplyDateController(
                scope,
                mocks.ModalService,
                mocks.TranslationService,
                mocks.PeriodCloseService,
                authServiceMock.Object,
                receiveOrderServiceMock.Object,
                constantsMock.Object
                );
        });

        it("gets initialized properly", () => {
            expect(scope.Model).toBeDefined();
            expect(scope.Cancel).toBeDefined();
            expect(scope.Confirm).toBeDefined();
            expect(scope.Model.ShowApplyDate).toBeDefined();
            expect(scope.Model.ShowApplyDate).toEqual(false);
            expect(scope.OpenApplyDate).toBeDefined();
            expect(scope.IsApplyDateValid).toBeDefined();
            expect(controller.GetCurrentDateTime).toBeDefined();
        });

        it("receives Translations and Store Time", () => {
            rootScope.$digest(); // invoke the callbacks
            expect(scope.Translations).toBeDefined();
            expect(scope.Translations.ChangeApplyDateMessage).toEqual("<APPLY DATE MESSAGE>");
            expect(scope.Translations.ChangeApplyDateSuccessful).toEqual("Apply date and time updated.");
            expect(moment(scope.Model.ApplyDate).format(constantsMock.Object.InternalDateTimeFormat)).toEqual(receiveOrderServiceMock.GetDateString());
            expect(scope.Model.ApplyDate).toEqual(scope.Model.MaxDate);
        });

        it("ensures apply date validation accepts now or dates in the past and rejects invalid dates and future dates", () => {
            controller.GetCurrentDateTime = () => {
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

        it("cancels correctly", () => {
            spyOn(mocks.ModalService, "dismiss");
            scope.Cancel();

            expect(mocks.ModalService.dismiss).toHaveBeenCalled();
        });

        it("confirms correctly", () => {
            rootScope.$digest(); // invoke the callbacks
            spyOn(mocks.ModalService, "close");

            scope.Confirm();
            expect(mocks.ModalService.close).toHaveBeenCalled();
        });
    });
}