 module Core.Events {
     export interface IEvent<T> {
         Subscribe(callback: ICallback<T>);
         Fire(arg: T);
         Unsubscribe(callback: ICallback<T>);
         SubscribeController(scope: ng.IScope, callback: ICallback<T>);
     }

     export interface ICallback<T> {
         (arg: T): void;
     }

     export class Event<T> implements IEvent<T> {
                         
         private _callbacks: ICallback<T>[] = [];
         
         Subscribe(callback: ICallback<T>) {
             this._callbacks.push(callback);
         }

         Fire(arg: T) {
             var copy = this._callbacks.slice();
             _.each(copy, (c)=> c(arg));
         }

         Unsubscribe(callback: ICallback<T>) {
             var found = this._callbacks.indexOf(callback);
             if (found > -1) {
                 this._callbacks.splice(found, 1);
             }
         }

         SubscribeController(scope: ng.IScope, callback: ICallback<T>) {
             this.Subscribe(callback);
             scope.$on("$destroy", () => this.Unsubscribe(callback));
         }
     }
 }