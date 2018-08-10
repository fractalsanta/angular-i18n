var Core;
(function (Core) {
    var NG;
    (function (NG) {
        var StateNode = (function () {
            function StateNode(name, url, templateUrl, controller, params, isAbstract) {
                if (name == null) {
                    throw { message: "The state must have a name." };
                }
                this.name = name;
                this.url = url;
                this.templateUrl = templateUrl;
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
            StateNode.prototype.AddChild = function () {
                var _this = this;
                var children = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    children[_i - 0] = arguments[_i];
                }
                this.children = this.children || [];
                _.each(children, function (item) {
                    _this.children.push(item);
                    item.parent = _this;
                });
                return this;
            };
            StateNode.prototype.AddView = function (name, templateUrl, controller) {
                this.views = this.views || {};
                this.views[name] = { templateUrl: templateUrl, controller: controller != null ? controller.name : null };
                return this;
            };
            StateNode.prototype.ToUiRouterStates = function (baseUrl, parent) {
                var retStates = [];
                var currentState = this.CreateUiRouterState();
                if (parent != null) {
                    currentState.parent = parent;
                    currentState.name = parent.name + "." + currentState.name;
                }
                if (baseUrl != null && currentState.templateUrl != null) {
                    currentState.templateUrl = "/Areas" + baseUrl + "/" + currentState.templateUrl.replace(/^\//, "");
                }
                if (baseUrl != null && currentState.views != null) {
                    for (var viewName in currentState.views) {
                        currentState.views[viewName].templateUrl = "/Areas" + baseUrl + "/" + currentState.views[viewName].templateUrl.replace(/^\//, "");
                    }
                }
                retStates.push(currentState);
                _.each(this.children || [], function (item) {
                    var childStates = item.ToUiRouterStates(baseUrl, currentState);
                    retStates.push.apply(retStates, childStates);
                });
                return retStates;
            };
            StateNode.prototype.CreateUiRouterState = function () {
                var state = { name: this.name };
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
            };
            StateNode.prototype.SetTopLevelUrl = function (baseUrl) {
                if (this.url != null) {
                    this.url = baseUrl + this.url;
                    if (this.url[this.url.length - 1] == "/") {
                        this.url = this.url.slice(0, -1);
                    }
                    if (this.url[0] != "/") {
                        this.url = "/" + this.url;
                    }
                }
                else {
                    _.each(this.children || [], function (child) { return child.SetTopLevelUrl(baseUrl); });
                }
            };
            return StateNode;
        }());
        NG.StateNode = StateNode;
    })(NG = Core.NG || (Core.NG = {}));
})(Core || (Core = {}));
