var Core;
(function (Core) {
    "use strict";
    var FormatterService = (function () {
        function FormatterService() {
        }
        FormatterService.prototype.CreateLocationDisplayName = function (location) {
            var displayName = "";
            if (location != null && location.Name && location.Number) {
                var name = location.Name;
                var num = location.Number;
                displayName = (name.indexOf(num) > -1) ? name : num + " - " + name;
            }
            return displayName;
        };
        return FormatterService;
    }());
    Core.FormatterService = FormatterService;
    Core.$formatterService = Core.NG.CoreModule.RegisterService("FormatterService", FormatterService);
})(Core || (Core = {}));
