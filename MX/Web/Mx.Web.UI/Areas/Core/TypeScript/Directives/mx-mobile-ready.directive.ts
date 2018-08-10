module Core {
    class MxMobileReady implements ng.IDirective {
        constructor(layoutService: ILayoutService) {
            return <ng.IDirective>{
                restrict: "A",
                link: () => layoutService.SetMobileReady(true)
            };
        }
    }

    NG.CoreModule.RegisterDirective("mxMobileReady", MxMobileReady, layoutService);
}