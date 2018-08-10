var Core;
(function (Core) {
    var NG;
    (function (NG) {
        "use strict";
        var Registry = (function () {
            function Registry(moduleName, dependencies) {
                var _this = this;
                this.moduleName = moduleName;
                this._states = [];
                this._isStatesCallbackCreated = false;
                this.Module = function () { return _this._module; };
                this._module = angular.module(moduleName, dependencies);
                this._baseUrl = "/" + moduleName.replace(/\./g, "/");
            }
            Registry.prototype.RegisterService = function (name, creator, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17, d18, d19, d20) {
                var injector = makeDependencyArray(d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17, d18, d19, d20);
                injector.push(creator);
                var serviceName = this.moduleName + ".Services." + name;
                this._module.service(serviceName, injector);
                return { name: serviceName };
            };
            Registry.prototype.MakeStateName = function () {
                return "state" + (Registry.Suffix++);
            };
            Registry.prototype.RegisterRouteController = function (url, templateUrl, creator, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17) {
                var _this = this;
                creator.$inject = makeDependencyArray(d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17);
                var path = this.MakeUrlPath(url);
                var templatePath = "/Areas" + this._baseUrl + "/" + templateUrl.replace(/^\//, "");
                var state = { controller: creator, templateUrl: templatePath, url: path };
                var registrationCallback = function (provider) {
                    var name = _this.MakeStateName();
                    provider.state(name, state);
                };
                this._module.config([NG.$stateProvider.name, registrationCallback]);
                return { url: path };
            };
            Registry.prototype.RegisterStateTree = function (stateNode) {
                var _this = this;
                stateNode.SetTopLevelUrl(this._baseUrl);
                this._states.push(stateNode);
                if (!this._isStatesCallbackCreated) {
                    this._isStatesCallbackCreated = true;
                    this._module.config([
                        NG.$stateProvider.name, function ($stateProvider) {
                            var allStates = [];
                            _.each(_this._states, function (item) {
                                var states = item.ToUiRouterStates(_this._baseUrl);
                                allStates.push.apply(allStates, states);
                            });
                            _.each(allStates, function (item) {
                                $stateProvider.state(item.name, item);
                            });
                        }
                    ]);
                }
            };
            Registry.prototype.RegisterMasterDetailPage = function (stateName, url, layout, master, detail, detailParams) {
                var parent = new NG.StateNode(stateName, null, layout.templateUrl, layout.controller, null, true);
                parent.AddChild(new NG.StateNode("main", url, master.templateUrl, master.controller)
                    .AddChild(new NG.StateNode("detail", null, null, null, detailParams)
                    .AddView("detail@" + stateName, detail.templateUrl, detail.controller)));
                this.RegisterStateTree(parent);
            };
            Registry.prototype.RegisterMasterPublicDetailPage = function (stateName, mainViewUrl, detailViewUrl, layout, master, detail, mainViewName, detailViewName) {
                var parent = new NG.StateNode(stateName, null, layout.templateUrl, layout.controller, null, true);
                var mainName = mainViewName == null ? "main" : mainViewName;
                var detailName = detailViewName == null ? "detail" : detailViewName;
                parent.AddChild(new NG.StateNode(mainName, mainViewUrl, master.templateUrl, master.controller)
                    .AddChild(new NG.StateNode(detailName, detailViewUrl, null, null)
                    .AddView(detailName + "@" + stateName, detail.templateUrl, detail.controller)));
                this.RegisterStateTree(parent);
            };
            Registry.prototype.RegisterMultiViewPage = function (stateName, url, layout, views) {
                var parent = new NG.StateNode(stateName, null, layout.templateUrl, layout.controller, null, true);
                var main = new NG.StateNode("main", url, null, null);
                _.each(views, function (val, name) {
                    main.AddView(name + "@" + stateName, val.templateUrl, val.controller);
                });
                parent.AddChild(main);
                this.RegisterStateTree(parent);
            };
            Registry.prototype.MakeUrlPath = function (url) {
                if (url === "$") {
                    return "/";
                }
                var path = this._baseUrl;
                if (url !== "") {
                    path += "/" + url;
                }
                return path;
            };
            Registry.prototype.RegisterNamedController = function (name, creator, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17) {
                var injector = makeDependencyArray(d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17);
                injector.push(creator);
                creator.$inject = injector.slice(0, -1);
                var controllerName = this.moduleName + "." + name;
                this._module.controller(controllerName, injector);
                return { name: controllerName };
            };
            Registry.prototype.RegisterDirective = function (name, creator, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17) {
                creator.$inject = makeDependencyArray(d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17);
                this._module.directive(name, creator);
            };
            Registry.Suffix = 0;
            return Registry;
        }());
        NG.Registry = Registry;
        function makeDependencyArray() {
            var result = [], length = arguments.length, current, i;
            for (i = 0; i < length; i += 1) {
                current = arguments[i];
                if (current) {
                    result.push(current.name);
                }
            }
            return result;
        }
    })(NG = Core.NG || (Core.NG = {}));
})(Core || (Core = {}));
