var Core;
(function (Core) {
    var Tests;
    (function (Tests) {
        describe("@ts Confirmation Controller", function () {
            var rootScope;
            var q;
            var parms;
            var modal;
            var tran;
            beforeEach(function () {
                inject(function ($rootScope, $q) {
                    rootScope = $rootScope;
                    q = $q;
                    tran = new Tests.TranslationServiceMock(q);
                    parms = {
                        ConfirmText: 'xConfirm',
                        ConfirmationType: Core.ConfirmationTypeEnum.Positive,
                        Title: 'XTitle',
                        Message: 'XMessage'
                    };
                    var prom = {};
                    modal = {
                        close: function () { },
                        dismiss: function () { },
                        opened: prom,
                        result: prom,
                        rendered: prom
                    };
                    spyOn(modal, 'close');
                    spyOn(modal, 'dismiss');
                });
            });
            it("should Set up parameters to modal properly.", function () {
                var sut = new Core.ConfirmationController(rootScope, modal, tran.Object, parms);
                rootScope.$digest();
                expect(rootScope.Model.CancelText).toBe('Cancel');
            });
            it("should close dialog when Close called.", function () {
                var sut = new Core.ConfirmationController(rootScope, modal, tran.Object, parms);
                rootScope.Close();
                rootScope.$digest();
                expect(modal.close).toHaveBeenCalled();
            });
            it("should dismiss dialog when Cancel called.", function () {
                var sut = new Core.ConfirmationController(rootScope, modal, tran.Object, parms);
                rootScope.Cancel();
                rootScope.$digest();
                expect(modal.dismiss).toHaveBeenCalled();
            });
            it("should Set positive button class correctly.", function () {
                parms.ConfirmationType = Core.ConfirmationTypeEnum.Positive;
                var sut = new Core.ConfirmationController(rootScope, modal, tran.Object, parms);
                expect(rootScope.ButtonClass).toBe('btn-success');
            });
            it("should Set danger button class correctly.", function () {
                parms.ConfirmationType = Core.ConfirmationTypeEnum.Danger;
                var sut = new Core.ConfirmationController(rootScope, modal, tran.Object, parms);
                expect(rootScope.ButtonClass).toBe('btn-danger');
            });
        });
    })(Tests = Core.Tests || (Core.Tests = {}));
})(Core || (Core = {}));
