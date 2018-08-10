 module Core {
     export interface ILayoutService {
         SetMobileReady(ready: boolean): void;
         IsMobileReady(): boolean;
     }

     class LayoutService implements ILayoutService {
         private _isMobileReady: boolean = false;
         constructor($rootScope: ng.IRootScopeService) {
             $rootScope.$on('$stateChangeSuccess', () => {
                 this._isMobileReady = false;
             });
         }

         SetMobileReady(ready: boolean) {
             this._isMobileReady = ready;
         }

         IsMobileReady() {
             return this._isMobileReady;
         }
     }

     export var layoutService: NG.INamedDependency<ILayoutService> = NG.CoreModule.RegisterService("LayoutService", LayoutService, NG.$rootScope);
 }