declare module Core.NG {

    // A generic interface to describe an Angular dependency
    export interface INamedDependency<T> {
        name: string;
        __dummy?: T; // a fake member to make all instances structurally incompatible to TypeScript
    }

    export interface INamedController {
        name: string;
    }

    export interface IDictionary<T> {
        [key: string]: T;
    }

    export interface INamedControllerTemplate {
        controller: INamedController;
        templateUrl: string;
    }

    // A generic interface to describe our services
    export interface INamedService<TService> extends INamedDependency<TService> {
        ___serviceDummy?: TService; // a new member to prevent backward compatibility with INamedDependency
    }

    export interface IControllerLink<TController> {
        url: string;
        __controllerDummy?: TController; // a fake member to make all instances structurally incompatible to TypeScript
    }

    export interface IRegistry {
        Module(): ng.IModule;

        // Service registration overloads
        RegisterService<TService>(name: string, creator: new () => TService): INamedService<TService>;

        RegisterService<TService, T1>(
            name: string,
            creator: new (t1: T1) => TService,
            d1: INamedDependency<T1>): INamedService<TService>;

        RegisterService<TService, T1, T2>(
            name: string,
            creator: new (t1: T1, t2: T2) => TService,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>): INamedService<TService>;

        RegisterService<TService, T1, T2, T3>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3) => TService,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>): INamedService<TService>;

        RegisterService<TService, T1, T2, T3, T4>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4) => TService,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>): INamedService<TService>;

        RegisterService<TService, T1, T2, T3, T4, T5>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5) => TService,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>): INamedService<TService>;

        RegisterService<TService, T1, T2, T3, T4, T5, T6>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6) => TService,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>): INamedService<TService>;

        RegisterService<TService, T1, T2, T3, T4, T5, T6, T7>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7) => TService,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>): INamedService<TService>;

        RegisterService<TService, T1, T2, T3, T4, T5, T6, T7, T8>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8) => TService,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>): INamedService<TService>;

        RegisterService<TService, T1, T2, T3, T4, T5, T6, T7, T8, T9>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9) => TService,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>,
            d9: INamedDependency<T9>): INamedService<TService>;

        RegisterService<TService, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10) => TService,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>,
            d9: INamedDependency<T9>,
            d10: INamedDependency<T10>): INamedService<TService>;

        RegisterService<TService, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11) => TService,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>,
            d9: INamedDependency<T9>,
            d10: INamedDependency<T10>,
            d11: INamedDependency<T11>): INamedService<TService>;

        RegisterService<TService, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12) => TService,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>,
            d9: INamedDependency<T9>,
            d10: INamedDependency<T10>,
            d11: INamedDependency<T11>,
            d12: INamedDependency<T12>): INamedService<TService>;

        RegisterService<TService, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12, t13: T13) => TService,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>,
            d9: INamedDependency<T9>,
            d10: INamedDependency<T10>,
            d11: INamedDependency<T11>,
            d12: INamedDependency<T12>,
            d13: INamedDependency<T13>): INamedService<TService>;

        RegisterService<TService, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12, t13: T13, t14: T14) => TService,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>,
            d9: INamedDependency<T9>,
            d10: INamedDependency<T10>,
            d11: INamedDependency<T11>,
            d12: INamedDependency<T12>,
            d13: INamedDependency<T13>,
            d14: INamedDependency<T14>): INamedService<TService>;

        RegisterService<TService, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12, t13: T13, t14: T14, t15: T15) => TService,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>,
            d9: INamedDependency<T9>,
            d10: INamedDependency<T10>,
            d11: INamedDependency<T11>,
            d12: INamedDependency<T12>,
            d13: INamedDependency<T13>,
            d14: INamedDependency<T14>,
            d15: INamedDependency<T15>): INamedService<TService>;

        RegisterService<TService, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12, t13: T13, t14: T14, t15: T15, t16: T16) => TService,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>,
            d9: INamedDependency<T9>,
            d10: INamedDependency<T10>,
            d11: INamedDependency<T11>,
            d12: INamedDependency<T12>,
            d13: INamedDependency<T13>,
            d14: INamedDependency<T14>,
            d15: INamedDependency<T15>,
            d16: INamedDependency<T16>): INamedService<TService>;

        RegisterService<TService, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12, t13: T13, t14: T14, t15: T15, t16: T16, t17: T17) => TService,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>,
            d9: INamedDependency<T9>,
            d10: INamedDependency<T10>,
            d11: INamedDependency<T11>,
            d12: INamedDependency<T12>,
            d13: INamedDependency<T13>,
            d14: INamedDependency<T14>,
            d15: INamedDependency<T15>,
            d16: INamedDependency<T16>,
            d17: INamedDependency<T17>): INamedService<TService>;

        RegisterService<TService, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12, t13: T13, t14: T14, t15: T15, t16: T16, t17: T17, t18: T18) => TService,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>,
            d9: INamedDependency<T9>,
            d10: INamedDependency<T10>,
            d11: INamedDependency<T11>,
            d12: INamedDependency<T12>,
            d13: INamedDependency<T13>,
            d14: INamedDependency<T14>,
            d15: INamedDependency<T15>,
            d16: INamedDependency<T16>,
            d17: INamedDependency<T17>,
            d18: INamedDependency<T18>): INamedService<TService>;

        RegisterService<TService, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12, t13: T13, t14: T14, t15: T15, t16: T16, t17: T17, t18: T18, t19: T19) => TService,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>,
            d9: INamedDependency<T9>,
            d10: INamedDependency<T10>,
            d11: INamedDependency<T11>,
            d12: INamedDependency<T12>,
            d13: INamedDependency<T13>,
            d14: INamedDependency<T14>,
            d15: INamedDependency<T15>,
            d16: INamedDependency<T16>,
            d17: INamedDependency<T17>,
            d18: INamedDependency<T18>,
            d19: INamedDependency<T19>): INamedService<TService>;

        RegisterService<TService, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19, T20>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12, t13: T13, t14: T14, t15: T15, t16: T16, t17: T17, t18: T18, t19: T19, t20: T20) => TService,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>,
            d9: INamedDependency<T9>,
            d10: INamedDependency<T10>,
            d11: INamedDependency<T11>,
            d12: INamedDependency<T12>,
            d13: INamedDependency<T13>,
            d14: INamedDependency<T14>,
            d15: INamedDependency<T15>,
            d16: INamedDependency<T16>,
            d17: INamedDependency<T17>,
            d18: INamedDependency<T18>,
            d19: INamedDependency<T19>,
            d20: INamedDependency<T20>): INamedService<TService>;

        // State registration
        RegisterStateTree(stateNode: IStateNode);

        RegisterMasterDetailPage(stateName: string, url: string, layout: INamedControllerTemplate, master: INamedControllerTemplate, detail: INamedControllerTemplate, detailParams?: string[]);
        
        RegisterMasterPublicDetailPage(stateName: string, mainViewUrl: string, detailViewUrl: string, layout: INamedControllerTemplate, master: INamedControllerTemplate, detail: INamedControllerTemplate, mainViewName?: string, detailViewName?: string);

        RegisterMultiViewPage(stateName: string, url: string, layout: INamedControllerTemplate, views: IDictionary<INamedControllerTemplate>);

        // Controllers registration overload
        RegisterRouteController<TController>(url: string, templateUrl: string, creator: new () => TController): IControllerLink<TController>;

        RegisterRouteController<TController, T1>(
            url: string,
            templateUrl: string,
            creator: new (t1: T1) => TController,
            d1: INamedDependency<T1>): IControllerLink<TController>;

        RegisterRouteController<TController, T1, T2>(
            url: string,
            templateUrl: string,
            creator: new (t1: T1, t2: T2) => TController,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>): IControllerLink<TController>;

        RegisterRouteController<TController, T1, T2, T3>(
            url: string,
            templateUrl: string,
            creator: new (t1: T1, t2: T2, t3: T3) => TController,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>): IControllerLink<TController>;

        RegisterRouteController<TController, T1, T2, T3, T4>(
            url: string,
            templateUrl: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4) => TController,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>): IControllerLink<TController>;

        RegisterRouteController<TController, T1, T2, T3, T4, T5>(
            url: string,
            templateUrl: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5) => TController,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>): IControllerLink<TController>;

        RegisterRouteController<TController, T1, T2, T3, T4, T5, T6>(
            url: string,
            templateUrl: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6) => TController,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>): IControllerLink<TController>;

        RegisterRouteController<TController, T1, T2, T3, T4, T5, T6, T7>(
            url: string,
            templateUrl: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7) => TController,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>): IControllerLink<TController>;

        RegisterRouteController<TController, T1, T2, T3, T4, T5, T6, T7, T8>(
            url: string,
            templateUrl: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8) => TController,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>): IControllerLink<TController>;

        RegisterRouteController<TController, T1, T2, T3, T4, T5, T6, T7, T8, T9>(
            url: string,
            templateUrl: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9) => TController,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>,
            d9: INamedDependency<T9>): IControllerLink<TController>;

        RegisterRouteController<TController, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
            url: string,
            templateUrl: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10) => TController,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>,
            d9: INamedDependency<T9>,
            d10: INamedDependency<T10>): IControllerLink<TController>;

        RegisterRouteController<TController, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>(
            url: string,
            templateUrl: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11) => TController,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>,
            d9: INamedDependency<T9>,
            d10: INamedDependency<T10>,
            d11: INamedDependency<T11>): IControllerLink<TController>;

        RegisterRouteController<TController, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12>(
            url: string,
            templateUrl: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12) => TController,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>,
            d9: INamedDependency<T9>,
            d10: INamedDependency<T10>,
            d11: INamedDependency<T11>,
            d12: INamedDependency<T12>): IControllerLink<TController>;

        RegisterRouteController<TController, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13>(
            url: string,
            templateUrl: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12, T13) => TController,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>,
            d9: INamedDependency<T9>,
            d10: INamedDependency<T10>,
            d11: INamedDependency<T11>,
            d12: INamedDependency<T12>,
            d13: INamedDependency<T13>): IControllerLink<TController>;

        RegisterRouteController<TController, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14>(
            url: string,
            templateUrl: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12, t13: T13, t14: T14) => TController,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>,
            d9: INamedDependency<T9>,
            d10: INamedDependency<T10>,
            d11: INamedDependency<T11>,
            d12: INamedDependency<T12>,
            d13: INamedDependency<T13>,
            d14: INamedDependency<T14>): IControllerLink<TController>;

        RegisterRouteController<TController, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15>(
            url: string,
            templateUrl: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12, t13: T13, t14: T14, t15: T15) => TController,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>,
            d9: INamedDependency<T9>,
            d10: INamedDependency<T10>,
            d11: INamedDependency<T11>,
            d12: INamedDependency<T12>,
            d13: INamedDependency<T13>,
            d14: INamedDependency<T14>,
            d15: INamedDependency<T15>): IControllerLink<TController>;

        RegisterRouteController<TController, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16>(
            url: string,
            templateUrl: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12, t13: T13, t14: T14, t15: T15, t16: T16) => TController,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>,
            d9: INamedDependency<T9>,
            d10: INamedDependency<T10>,
            d11: INamedDependency<T11>,
            d12: INamedDependency<T12>,
            d13: INamedDependency<T13>,
            d14: INamedDependency<T14>,
            d15: INamedDependency<T15>,
            d16: INamedDependency<T16>): IControllerLink<TController>;

        RegisterRouteController<TController, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17>(
            url: string,
            templateUrl: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12, t13: T13, t14: T14, t15: T15, t16: T16, t17: T17) => TController,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>,
            d9: INamedDependency<T9>,
            d10: INamedDependency<T10>,
            d11: INamedDependency<T11>,
            d12: INamedDependency<T12>,
            d13: INamedDependency<T13>,
            d14: INamedDependency<T14>,
            d15: INamedDependency<T15>,
            d16: INamedDependency<T16>,
            d17: INamedDependency<T17>): IControllerLink<TController>;

        // Named controller registration overloads
        RegisterNamedController<TController>(name: string, creator: new () => TController): INamedController;

        RegisterNamedController<TController, T1>(
            name: string,
            creator: new (t1: T1) => TController,
            d1: INamedDependency<T1>): INamedController;

        RegisterNamedController<TController, T1, T2>(
            name: string,
            creator: new (t1: T1, t2: T2) => TController,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>): INamedController;

        RegisterNamedController<TController, T1, T2, T3>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3) => TController,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>): INamedController;

        RegisterNamedController<TController, T1, T2, T3, T4>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4) => TController,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>): INamedController;

        RegisterNamedController<TController, T1, T2, T3, T4, T5>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5) => TController,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>): INamedController;

        RegisterNamedController<TController, T1, T2, T3, T4, T5, T6>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6) => TController,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>): INamedController;

        RegisterNamedController<TController, T1, T2, T3, T4, T5, T6, T7>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7) => TController,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>): INamedController;

        RegisterNamedController<TController, T1, T2, T3, T4, T5, T6, T7, T8>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8) => TController,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>): INamedController;

        RegisterNamedController<TController, T1, T2, T3, T4, T5, T6, T7, T8, T9>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9) => TController,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>,
            d9: INamedDependency<T9>): INamedController;

        RegisterNamedController<TController, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10) => TController,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>,
            d9: INamedDependency<T9>,
            d10: INamedDependency<T10>): INamedController;

        RegisterNamedController<TController, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11) => TController,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>,
            d9: INamedDependency<T9>,
            d10: INamedDependency<T10>,
            d11: INamedDependency<T11>):INamedController;

        RegisterNamedController<TController, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12) => TController,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>,
            d9: INamedDependency<T9>,
            d10: INamedDependency<T10>,
            d11: INamedDependency<T11>,
            d12: INamedDependency<T12>): INamedController;

        RegisterNamedController<TController, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12, t13: T13) => TController,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>,
            d9: INamedDependency<T9>,
            d10: INamedDependency<T10>,
            d11: INamedDependency<T11>,
            d12: INamedDependency<T12>,
            d13: INamedDependency<T13>): INamedController;

        RegisterNamedController<TController, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12, t13: T13, t14: T14) => TController,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>,
            d9: INamedDependency<T9>,
            d10: INamedDependency<T10>,
            d11: INamedDependency<T11>,
            d12: INamedDependency<T12>,
            d13: INamedDependency<T13>,
            d14: INamedDependency<T14>): INamedController;

        // Directives registration overloads
        RegisterDirective<TDirective extends ng.IDirective>(name: string, creator: new () => TDirective): void;

        RegisterDirective<TDirective extends ng.IDirective, T1>(
            name: string,
            creator: new (t1: T1) => TDirective,
            d1: INamedDependency<T1>): void;

        RegisterDirective<TDirective extends ng.IDirective, T1, T2>(
            name: string,
            creator: new (t1: T1, t2: T2) => TDirective,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>): void;

        RegisterDirective<TDirective extends ng.IDirective, T1, T2, T3>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3) => TDirective,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>): void;

        RegisterDirective<TDirective extends ng.IDirective, T1, T2, T3, T4>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4) => TDirective,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>): void;

        RegisterDirective<TDirective extends ng.IDirective, T1, T2, T3, T4, T5>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5) => TDirective,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>): void;

        RegisterDirective<TDirective extends ng.IDirective, T1, T2, T3, T4, T5, T6>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6) => TDirective,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>): void;

        RegisterDirective<TDirective extends ng.IDirective, T1, T2, T3, T4, T5, T6, T7>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7) => TDirective,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>): void;

        RegisterDirective<TDirective extends ng.IDirective, T1, T2, T3, T4, T5, T6, T7, T8>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8) => TDirective,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>): void;

        RegisterDirective<TDirective extends ng.IDirective, T1, T2, T3, T4, T5, T6, T7, T8, T9>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9) => TDirective,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>,
            d9: INamedDependency<T9>): void;

        RegisterDirective<TDirective extends ng.IDirective, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10) => TDirective,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>,
            d9: INamedDependency<T9>,
            d10: INamedDependency<T10>): void;

        RegisterDirective<TDirective extends ng.IDirective, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11) => TDirective,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>,
            d9: INamedDependency<T9>,
            d10: INamedDependency<T10>,
            d11: INamedDependency<T11>): void;

        RegisterDirective<TDirective extends ng.IDirective, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12) => TDirective,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>,
            d9: INamedDependency<T9>,
            d10: INamedDependency<T10>,
            d11: INamedDependency<T11>,
            d12: INamedDependency<T12>): void;

        RegisterDirective<TDirective extends ng.IDirective, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12, t13: T13) => TDirective,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>,
            d9: INamedDependency<T9>,
            d10: INamedDependency<T10>,
            d11: INamedDependency<T11>,
            d12: INamedDependency<T12>,
            d13: INamedDependency<T13>): void;

        RegisterDirective<TDirective extends ng.IDirective, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14>(
            name: string,
            creator: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9, t10: T10, t11: T11, t12: T12, t13: T13, t14: T14) => TDirective,
            d1: INamedDependency<T1>,
            d2: INamedDependency<T2>,
            d3: INamedDependency<T3>,
            d4: INamedDependency<T4>,
            d5: INamedDependency<T5>,
            d6: INamedDependency<T6>,
            d7: INamedDependency<T7>,
            d8: INamedDependency<T8>,
            d9: INamedDependency<T9>,
            d10: INamedDependency<T10>,
            d11: INamedDependency<T11>,
            d12: INamedDependency<T12>,
            d13: INamedDependency<T13>,
            d14: INamedDependency<T14>): void;
    }
}