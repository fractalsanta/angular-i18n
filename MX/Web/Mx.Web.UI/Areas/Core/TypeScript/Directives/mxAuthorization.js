var Core;
(function (Core) {
    var MxAuthorization = (function () {
        function MxAuthorization() {
            return {
                scope: {
                    Authorize: '=user',
                    IsOptional: '=isOptional',
                    IsValid: '=isValid'
                },
                templateUrl: "/Areas/Core/Templates/mx-authorization-directive.html",
                controller: "Core.MxAuthorizeController"
            };
        }
        return MxAuthorization;
    }());
    Core.MxAuthorization = MxAuthorization;
    Core.NG.CoreModule.RegisterDirective("mxAuthorization", MxAuthorization);
})(Core || (Core = {}));
