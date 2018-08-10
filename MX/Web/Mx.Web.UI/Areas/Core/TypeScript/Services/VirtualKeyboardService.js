var Core;
(function (Core) {
    "use strict";
    var VirtualKeyboardService = (function () {
        function VirtualKeyboardService() {
            this._currentControl = null;
            this.Pressed = new Core.Events.Event();
            this.ControlChanging = new Core.Events.Event();
            this.ControlChanged = new Core.Events.Event();
        }
        VirtualKeyboardService.prototype.SetCurrentControl = function (ctrl) {
            if (this._currentControl != ctrl) {
                this.ControlChanging.Fire(this._currentControl);
                this._currentControl = ctrl;
                this.ControlChanged.Fire(ctrl);
            }
        };
        VirtualKeyboardService.prototype.GetCurrentControl = function () {
            return this._currentControl;
        };
        return VirtualKeyboardService;
    }());
    Core.$virtualKeyboardService = Core.NG.CoreModule.RegisterService("VirtualKeyboardService", VirtualKeyboardService);
})(Core || (Core = {}));
