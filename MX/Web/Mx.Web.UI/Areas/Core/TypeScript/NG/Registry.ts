module Core.NG {
    "use strict";

    export class Registry implements IRegistry {
        private _module: ng.IModule;
        private _baseUrl: string;
        private _states: IStateNode[] = [];
        private _isStatesCallbackCreated: boolean = false;

        constructor(private moduleName: string, dependencies: string[]) {
            this._module = angular.module(moduleName, dependencies);
            this._baseUrl = "/" + moduleName.replace(/\./g, "/");
        }

        Module = (): ng.IModule => this._module;

        RegisterService<TService, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19, T20>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12, t13: T13, t14: T14, t15: T15, t16: T16, t17: T17, t18: T18, t19: T19, t20: T20) => TService,
            d1?: INamedDependency<T1>,
            d2?: INamedDependency<T2>,
            d3?: INamedDependency<T3>,
            d4?: INamedDependency<T4>,
            d5?: INamedDependency<T5>,
            d6?: INamedDependency<T6>,
            d7?: INamedDependency<T7>,
            d8?: INamedDependency<T8>,
            d9?: INamedDependency<T9>,
            d10?: INamedDependency<T10>,
            d11?: INamedDependency<T11>,
            d12?: INamedDependency<T12>,
            d13?: INamedDependency<T13>,
            d14?: INamedDependency<T14>,
            d15?: INamedDependency<T15>,
            d16?: INamedDependency<T16>,
            d17?: INamedDependency<T17>,
            d18?: INamedDependency<T18>,
            d19?: INamedDependency<T19>,
            d20?: INamedDependency<T20>): INamedService<TService> {
            var injector = makeDependencyArray(d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17, d18, d19, d20);
            injector.push(creator);
            var serviceName = this.moduleName + ".Services." + name;
            this._module.service(serviceName, injector);
            return { name: serviceName };
        }

        // This is a "hacky" way to generate unique state names by adding an incremented suffix to a predefined string.
        // Hopefully, we will work out a new API that would require passing meaningful state names to the registry.
        private static Suffix = 0;
        private MakeStateName(): string {
            return "state" + (Registry.Suffix++);
        }

        RegisterRouteController<TController, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17>(
            url: string,
            templateUrl: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12, t13: T13, t14: T14, t15: T15, t16: T16, t17: T17) => TController,
            d1?: INamedDependency<T1>,
            d2?: INamedDependency<T2>,
            d3?: INamedDependency<T3>,
            d4?: INamedDependency<T4>,
            d5?: INamedDependency<T5>,
            d6?: INamedDependency<T6>,
            d7?: INamedDependency<T7>,
            d8?: INamedDependency<T8>,
            d9?: INamedDependency<T9>,
            d10?: INamedDependency<T10>,
            d11?: INamedDependency<T11>,
            d12?: INamedDependency<T12>,
            d13?: INamedDependency<T13>,
            d14?: INamedDependency<T14>,
            d15?: INamedDependency<T15>,
            d16?: INamedDependency<T16>,
            d17?: INamedDependency<T17>): IControllerLink<TController> {
            creator.$inject = makeDependencyArray(d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17);
            var path = this.MakeUrlPath(url);
            var templatePath = "/Areas" + this._baseUrl + "/" + templateUrl.replace(/^\//, "");
            var state: ng.ui.IState = { controller: creator, templateUrl: templatePath, url: path };
            var registrationCallback = (provider: ng.ui.IStateProvider): void => {
                var name = this.MakeStateName();
                provider.state(name, state);
            };
            this._module.config([$stateProvider.name, registrationCallback]);
            return { url: path };
        }

        RegisterStateTree(stateNode: IStateNode) {
            stateNode.SetTopLevelUrl(this._baseUrl);
            this._states.push(stateNode);

            if (!this._isStatesCallbackCreated) {

                this._isStatesCallbackCreated = true;

                this._module.config([
                    $stateProvider.name, ($stateProvider) => {
                        
                        var allStates: ng.ui.IState[] = [];
                        
                        // flatten the states
                        _.each(this._states, (item)=> {
                            var states = item.ToUiRouterStates(this._baseUrl);
                            allStates.push.apply(allStates, states);
                        });                        
			            // register states in ui-router
                        _.each(allStates, (item)=> {
                            $stateProvider.state(item.name, item);
                        });
                    }
                ]);   
            }
        }

        RegisterMasterDetailPage(stateName: string, url: string, layout:INamedControllerTemplate, master:INamedControllerTemplate, detail:INamedControllerTemplate, detailParams?: string[]) {

            // TODO: check that there is no state with 'stateName' that already exists

            var parent = new StateNode(stateName, null, layout.templateUrl, layout.controller, null, true);
            parent.AddChild(
                new StateNode("main", url, master.templateUrl, master.controller)
                    .AddChild(
                        new StateNode("detail", null, null, null, detailParams)
                            .AddView("detail@"+stateName, detail.templateUrl, detail.controller)
                    )
            );

            this.RegisterStateTree(parent);
        }

        RegisterMasterPublicDetailPage(stateName: string, mainViewUrl: string, detailViewUrl: string
            , layout: INamedControllerTemplate, master: INamedControllerTemplate, detail: INamedControllerTemplate
            , mainViewName?: string, detailViewName?: string) {

            var parent = new StateNode(stateName, null, layout.templateUrl, layout.controller, null, true);
            var mainName = mainViewName == null ? "main" : mainViewName;
            var detailName = detailViewName == null ? "detail" : detailViewName;

            parent.AddChild(
                new StateNode(mainName, mainViewUrl, master.templateUrl, master.controller)
                    .AddChild(
                    new StateNode(detailName, detailViewUrl, null, null)
                        .AddView(detailName + "@" + stateName, detail.templateUrl, detail.controller)
                    )
                );

            this.RegisterStateTree(parent);
        }

        RegisterMultiViewPage(stateName: string, url: string, layout: INamedControllerTemplate, views: IDictionary<INamedControllerTemplate>) {
            
            // TODO: check that there is no state with 'stateName' that already exists

            var parent = new StateNode(stateName, null, layout.templateUrl, layout.controller, null, true);
            var main = new StateNode("main", url, null, null);

            _.each(views, (val, name)=> {
                main.AddView(name+"@"+stateName, val.templateUrl, val.controller);
            });

            parent.AddChild(main);

            this.RegisterStateTree(parent);
        }

        private MakeUrlPath(url: string): string {
            if (url === "$") {
                return "/";
            }
            var path = this._baseUrl;
            if (url !== "") {
                path += "/" + url;
            }
            return path;
        }

        RegisterNamedController<TController, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12, t13: T13, t14: T14, t15: T15, t16: T16, t17: T17) => TController,
            d1?: INamedDependency<T1>,
            d2?: INamedDependency<T2>,
            d3?: INamedDependency<T3>,
            d4?: INamedDependency<T4>,
            d5?: INamedDependency<T5>,
            d6?: INamedDependency<T6>,
            d7?: INamedDependency<T7>,
            d8?: INamedDependency<T8>,
            d9?: INamedDependency<T9>,
            d10?: INamedDependency<T10>,
            d11?: INamedDependency<T11>,
            d12?: INamedDependency<T12>,
            d13?: INamedDependency<T13>,
            d14?: INamedDependency<T14>,
            d15?: INamedDependency<T15>,
            d16?: INamedDependency<T16>,
            d17?: INamedDependency<T17>): INamedController {
            var injector = makeDependencyArray(d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17);
            injector.push(creator);
            creator.$inject = injector.slice(0, -1);
            var controllerName = this.moduleName + "." + name;
            this._module.controller(controllerName, injector);
            return { name: controllerName };
        }      

        RegisterDirective<TDirective extends ng.IDirective, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12, t13: T13, t14: T14, t15: T15, t16: T16, t17: T17) => TDirective,
            d1?: INamedDependency<T1>,
            d2?: INamedDependency<T2>,
            d3?: INamedDependency<T3>,
            d4?: INamedDependency<T4>,
            d5?: INamedDependency<T5>,
            d6?: INamedDependency<T6>,
            d7?: INamedDependency<T7>,
            d8?: INamedDependency<T8>,
            d9?: INamedDependency<T9>,
            d10?: INamedDependency<T10>,
            d11?: INamedDependency<T11>,
            d12?: INamedDependency<T12>,
            d13?: INamedDependency<T13>,
            d14?: INamedDependency<T14>,
            d15?: INamedDependency<T15>,
            d16?: INamedDependency<T16>,
            d17?: INamedDependency<T17>): void {
            creator.$inject = makeDependencyArray(d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17);
            this._module.directive(name, <any>creator);
        }
    }

    function makeDependencyArray(...args: INamedDependency<any>[]): any[];
    function makeDependencyArray(): any[] {
        var result: any[] = [],
            length = arguments.length,
            current, i;

        for (i = 0; i < length; i += 1) {
            current = <INamedDependency<any>>arguments[i];

            if (current) {
                result.push(current.name);
            }
        }

        return result;
    }
}