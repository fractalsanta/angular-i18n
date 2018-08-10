module Core {
    "use strict";

    export interface IVirtualKeyboardService {
        SetCurrentControl(ctrl: ng.IAugmentedJQuery): void;
        GetCurrentControl(): ng.IAugmentedJQuery;

        Pressed: Core.Events.IEvent<string>;
        ControlChanging: Core.Events.IEvent<ng.IAugmentedJQuery>;
        ControlChanged: Core.Events.IEvent<ng.IAugmentedJQuery>;
    }

    class VirtualKeyboardService implements IVirtualKeyboardService {

        private _currentControl: ng.IAugmentedJQuery = null;
        public Pressed = new Core.Events.Event<string>();
        public ControlChanging = new Core.Events.Event<ng.IAugmentedJQuery>();
        public ControlChanged = new Core.Events.Event<ng.IAugmentedJQuery>();

        SetCurrentControl(ctrl: ng.IAugmentedJQuery) {
            if (this._currentControl != ctrl) {
                this.ControlChanging.Fire(this._currentControl);
                this._currentControl = ctrl;
                this.ControlChanged.Fire(ctrl);
            }
        }

        GetCurrentControl() {
            return this._currentControl;
        }
    }

    export var $virtualKeyboardService: NG.INamedDependency<IVirtualKeyboardService> =
        NG.CoreModule.RegisterService("VirtualKeyboardService", VirtualKeyboardService);
}
 