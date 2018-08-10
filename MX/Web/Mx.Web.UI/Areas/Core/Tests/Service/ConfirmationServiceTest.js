var Core;
(function (Core) {
    var Tests;
    (function (Tests) {
        describe("@ts Confirmation Service", function () {
            it("should Set up parameters to modal properly.", function () {
                var result;
                var modal = {
                    open: function (options) {
                        return {
                            result: result
                        };
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
    })(Tests = Core.Tests || (Core.Tests = {}));
})(Core || (Core = {}));
