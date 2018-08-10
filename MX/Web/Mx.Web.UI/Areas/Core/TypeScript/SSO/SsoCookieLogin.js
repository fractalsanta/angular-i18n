var Core;
(function (Core) {
    Core.NG.CoreModule.Module().run([
        Core.Auth.$authService.name, function (authService) {
            authService.SsoCookieLogin();
        }]);
})(Core || (Core = {}));
//# sourceMappingURL=SsoCookieLogin.js.map
