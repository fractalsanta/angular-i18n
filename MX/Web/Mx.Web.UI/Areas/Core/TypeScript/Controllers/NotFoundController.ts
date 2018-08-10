module Core {
    class NotFoundController {
        constructor() {}
    }

    NG.CoreModule.RegisterRouteController("404", "404.html", NotFoundController);
}
