var Core;
(function (Core) {
    var Tests;
    (function (Tests) {
        describe("@ts ConfirmationCheckboxController", function () {
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
                        Message: 'XMessage',
                        CheckboxText: "xCheck"
                    };
                    var prom = {};
                    modal = {
                        close: function () { },
                        dismiss: function () { },
                        opened: prom,
                        result: prom,
                        rendered: prom
                    };
                });
            });
            it("initializes Model.Checked to false when not set explicitly", function () {
                var sut = new Core.ConfirmationCheckboxController(rootScope, modal, tran.Object, parms);
                rootScope.$digest();
                expect(rootScope.Model.Checked).toBeDefined();
                expect(rootScope.Model.Checked).toEqual(false);
            });
            it("submitting resolves dialog to false when not checked", function () {
                var sut = new Core.ConfirmationCheckboxController(rootScope, modal, tran.Object, parms);
                spyOn(modal, 'close');
                rootScope.Close();
                rootScope.$digest();
                expect(modal.close).toHaveBeenCalledWith(false);
            });
            it("submitting resolves dialog to true when checked", function () {
                parms.Checked = true;
                var sut = new Core.ConfirmationCheckboxController(rootScope, modal, tran.Object, parms);
                spyOn(modal, 'close');
                rootScope.Close();
                rootScope.$digest();
                expect(modal.close).toHaveBeenCalledWith(true);
            });
        });
    })(Tests = Core.Tests || (Core.Tests = {}));
})(Core || (Core = {}));
