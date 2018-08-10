/// <reference path="../TestFramework.ts" />
/// <reference path="../Mocks/TranslationServiceMock.ts"/>
/// <reference path="../Mocks/ModalServiceInstanceMock.ts"/>
/// <reference path="../mocks/ModalServiceMock.ts" />

/// <reference path="../../typescript/interfaces/IConfirmationService.d.ts" />
/// <reference path="../../TypeScript/Services/ConfirmationService.ts"/>
/// <reference path="../../TypeScript/Controllers/ConfirmationController.ts" />

module Core.Tests {
    describe("@ts Confirmation Controller", (): void => {

        var rootScope: any;
        var q: ng.IQService;
        var parms: Core.IConfirmation;
        var modal: ng.ui.bootstrap.IModalServiceInstance;

        var tran: TranslationServiceMock;
        

        beforeEach(() => {
            inject(($rootScope: ng.IScope, $q: ng.IQService): void => {
                rootScope = $rootScope;
                q = $q;
                tran =  new TranslationServiceMock(q);

                parms = {
                    ConfirmText: 'xConfirm',
                    ConfirmationType: Core.ConfirmationTypeEnum.Positive,
                    Title: 'XTitle',
                    Message: 'XMessage'
                };
                var prom = <ng.IPromise < any >>{};
                modal = {
                    close: () => {},
                    dismiss: () => {},
                    opened: prom,
                    result: prom,
                    rendered: prom
                };

                spyOn(modal, 'close');
                spyOn(modal, 'dismiss');

            });
        });

        it("should Set up parameters to modal properly.", (): void => {
            var sut = new Core.ConfirmationController(rootScope, modal, tran.Object, parms);
            rootScope.$digest();
            expect(rootScope.Model.CancelText).toBe('Cancel');
        });

        it("should close dialog when Close called.", (): void => {

            var sut = new Core.ConfirmationController(rootScope, modal, tran.Object, parms);

            rootScope.Close();
            rootScope.$digest();

            expect(modal.close).toHaveBeenCalled();
        });

        it("should dismiss dialog when Cancel called.", (): void => {

            var sut = new Core.ConfirmationController(rootScope, modal, tran.Object, parms);

            rootScope.Cancel();
            rootScope.$digest();

            expect(modal.dismiss).toHaveBeenCalled();
        });

        it("should Set positive button class correctly.", (): void => {

            parms.ConfirmationType = Core.ConfirmationTypeEnum.Positive;
            var sut = new Core.ConfirmationController(rootScope, modal, tran.Object, parms);


            expect(rootScope.ButtonClass).toBe('btn-success');
        });

        it("should Set danger button class correctly.", (): void => {

            parms.ConfirmationType = Core.ConfirmationTypeEnum.Danger;
            var sut = new Core.ConfirmationController(rootScope, modal, tran.Object, parms);

            expect(rootScope.ButtonClass).toBe('btn-danger');
        });
    });
}