/// <reference path="../TestFramework.ts" />
/// <reference path="../Mocks/TranslationServiceMock.ts"/>
/// <reference path="../Mocks/ModalServiceInstanceMock.ts"/>
/// <reference path="../mocks/ModalServiceMock.ts" />

/// <reference path="../../typescript/interfaces/IConfirmationService.d.ts" />
/// <reference path="../../TypeScript/Services/ConfirmationService.ts"/>

module Core.Tests {
    describe("@ts Confirmation Service", (): void => {

            it("should Set up parameters to modal properly.", (): void => {
                var result: ng.IPromise<any>;
                var modal = <ng.ui.bootstrap.IModalService> {
                    open: (options: ng.ui.bootstrap.IModalSettings) => {
                        return <ng.ui.bootstrap.IModalServiceInstance> {
                            result: result
                        }
                    }
                };
                spyOn(modal, 'open').and.callThrough();

                var ts = new Core.ConfirmationService(modal);

                var parms = {
                    ConfirmText: 'x',
                    ConfirmationType: Core.ConfirmationTypeEnum.Positive,
                    Title: '',
                    Message: ''
                };

                ts.Confirm(parms);

                expect(modal.open).toHaveBeenCalled();
                expect(modal.open).toHaveBeenCalledWith({
                    templateUrl: '/Areas/Core/Templates/mx-confirmation.html',
                    controller: 'Core.ConfirmationController',
                    resolve: {
                        confirm: jasmine.any(Function)
                    }
                });
            });
        });
}