module Core.NG {

    interface IStateEx extends ng.ui.IState {
        parent?: ng.ui.IState;
    }

    export class StateNode implements IStateNode {

        name: string;
        templateUrl: string;
        controller: INamedController;
        url: string;
        views: {};
        params: string[];
        isAbstract: boolean;
        children: IStateNode[];
        parent: IStateNode;

        constructor(name: string,
            url: string,
            templateUrl: string,
            controller: INamedController,
            params?: string[],
            isAbstract?: boolean) {

            if (name == null) {
                throw { message: "The state must have a name." };
            }
            this.name = name;
            this.url = url;
            this.templateUrl = templateUrl;

            // ensure we have a leading '/'
            if (this.url != null && this.url[0] != "/") {
                this.url = "/" + this.url;
            }

            if (controller != null && controller.name != null) {
                this.controller = controller;
            }

            if (params != null) {
                this.params = params;
            }

            if (isAbstract != null) {
                this.isAbstract = true;
            }
        }

        // Add children states to the current state
        AddChild(...children: IStateNode[]) {

            this.children = this.children || [];
            
            _.each(children, (item)=> {
                this.children.push(item);
                item.parent = this;
            });

            return this;
        }

        // Add a view to the current state
        AddView(name: string, templateUrl: string, controller: INamedController) : IStateNode {

            this.views = this.views || {};

            // TODO: check that a view with the given name does not already exist and throw exception

            this.views[name] = { templateUrl: templateUrl, controller: controller != null ? controller.name : null };

            return this;
        }

        ToUiRouterStates(baseUrl: string, parent?: ng.ui.IState): ng.ui.IState[] {

            var retStates: ng.ui.IState[] = [];
            var currentState = this.CreateUiRouterState();

            if (parent != null) {
                currentState.parent = parent;
                currentState.name = parent.name + "." + currentState.name;
            }

            // fix up the templateUrl 
            if (baseUrl != null && currentState.templateUrl != null) {
                currentState.templateUrl = "/Areas" + baseUrl + "/" + currentState.templateUrl.replace(/^\//, "");
            }

            // fix up the templateUrl for any views that we might have
            if (baseUrl != null && currentState.views != null) {
                for (var viewName in currentState.views) {
                    currentState.views[viewName].templateUrl = "/Areas" + baseUrl + "/" + currentState.views[viewName].templateUrl.replace(/^\//, "");
                }
            }

            retStates.push(currentState);

            // get ui-router states from all children
            _.each(this.children || [], item=> {
                var childStates = item.ToUiRouterStates(baseUrl, currentState);
                retStates.push.apply(retStates, childStates);
            });

            return retStates;
        }

        private CreateUiRouterState(): IStateEx {
            var state: ng.ui.IState = { name: this.name };
            if (this.url != null) {
                state.url = this.url;
            }

            if (this.templateUrl != null) {
                state.templateUrl = this.templateUrl;
            }

            if (this.controller != null) {
                state.controller = this.controller.name;
            }

            if (this.isAbstract === true) {
                state.abstract = true;
            }

            if (this.params != null && this.params.length > 0) {
                state.params = this.params;
            }

            if (this.views != null) {
                state.views = this.views;
            }

            return state;
        }

        // Set the top level URL for the root state node
        SetTopLevelUrl(baseUrl: string) {
            // set the top level URL only on the root state node
            if (this.url != null) {
                this.url = baseUrl + this.url;

                // remove the trailing '/'
                if (this.url[this.url.length - 1] == "/") {
                    this.url = this.url.slice(0, -1);
                }

                // ensure we have a leading '/'
                if (this.url[0] != "/") {
                    this.url = "/" + this.url;
                }
            } else {
                // if the root state node does not have a URL, set the top level URL
                // for its children instead
                _.each(this.children || [], (child)=> child.SetTopLevelUrl(baseUrl));
            }
        }
    }
}