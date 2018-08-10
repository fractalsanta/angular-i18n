module Core {
    export class MxAuthorization implements ng.IDirective {
        constructor() {
            return <ng.IDirective>{
                scope : {
                    Authorize: '=user',
                    IsOptional: '=isOptional',
                    IsValid: '=isValid'
                },
                templateUrl: "/Areas/Core/Templates/mx-authorization-directive.html",
                controller: "Core.MxAuthorizeController"
            };
        }
    }

    Core.NG.CoreModule.RegisterDirective("mxAuthorization", MxAuthorization);
}