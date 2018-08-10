module Core.Tests {

    export class StateServiceMock implements ng.ui.IStateService {

        private _helper: PromiseHelper;
        public current: ng.ui.IState;

        constructor(private $q: ng.IQService) {
            this._helper = new PromiseHelper($q);
            this.current = {};

            this.current = {
                name: "",
                template: "",
                templateUrl: "",
                controller: "",
                url: "",
                params: []
            }
        }

        go(to: string, params?: {}, options?: ng.ui.IStateOptions) {
            this.current.name = to;
            return this._helper.CreateHttpPromise(null);
        }

        transitionTo(state: string, params?: {}, updateLocation?: boolean) {
            
        }

        includes(state: string, params?: {}) {
            return true;
        }

        is(state: string, params?: {}) {
            return true;
        }

        href(state: ng.ui.IState, params?: {}, options?: ng.ui.IHrefOptions) {
            return "";
        }

        get() {
            return null;
        }

        public params: ng.ui.IStateParamsService;

        reload() {
            
        }
    }
}
 