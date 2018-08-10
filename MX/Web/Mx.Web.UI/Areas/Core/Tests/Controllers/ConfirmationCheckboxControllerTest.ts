/// <reference path="../TestFramework.ts" />
/// <reference path="../Mocks/TranslationServiceMock.ts"/>
/// <reference path="../../TypeScript/Models/IConfirmationCheckbox.ts" />
/// <reference path="../../TypeScript/Services/ConfirmationService.ts"/>
/// <reference path="../../TypeScript/Controllers/ConfirmationCheckboxController.ts" />

module Core.Tests {
    describe("@ts ConfirmationCheckboxController", (): void => {

        var rootScope: any;
        var q: ng.IQService;
        var parms: IConfirmationCheckbox;
        var modal: ng.ui.bootstrap.IModalServiceInstance;
        var tran: TranslationServiceMock;

        beforeEach(() => {
            inject(($rootScope: ng.IScope, $q: ng.IQService): void => {
                rootScope = $rootScope;
                q = $q;
                tran = new TranslationServiceMock(q);

                parms = {
                    ConfirmText: 'xConfirm',
                    ConfirmationType: ConfirmationTypeEnum.Positive,
                    Title: 'XTitle',
                    Message: 'XMessage',
                    CheckboxText: "xCheck"
                };
                var prom = <ng.IPromise<any>>{};
                modal = {
                    close: () => { },
                    dismiss: () => { },
                    opened: prom,
                    result: prom,
                    rendered: prom
                };
            });
        });

        it("initializes Model.Checked to false when not set explicitly", (): void => {
            var sut = new ConfirmationCheckboxController(rootScope, modal, tran.Object, parms);
            rootScope.$digest();

            expect(rootScope.Model.Checked).toBeDefined();
            expect(rootScope.Model.Checked).toEqual(false);
        });

        it("submitting resolves dialog to false when not checked", (): void => {
            var sut = new ConfirmationCheckboxController(rootScope, modal, tran.Object, parms);
            spyOn(modal, 'close');
            rootScope.Close();
            rootScope.$digest();

            expect(modal.close).toHaveBeenCalledWith(false);
        });

        it("submitting resolves dialog to true when checked", (): void => {
            parms.Checked = true;
            var sut = new ConfirmationCheckboxController(rootScope, modal, tran.Object, parms);
            spyOn(modal, 'close');
            rootScope.Close();
            rootScope.$digest();

            expect(modal.close).toHaveBeenCalledWith(true);
        });
    });
} 