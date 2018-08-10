module Core.Tests {

    export interface IModalServiceInstanceMock extends ng.ui.bootstrap.IModalServiceInstance {
        SetResult(T): void;
    }

    export class ModalServiceInstanceMock implements IMock<IModalServiceInstanceMock> {

        private _helper: PromiseHelper;
        private _opened: ng.IPromise<any>;
        private _result: ng.IPromise<any>;
        private _rendered: ng.IPromise<any>;

        SetResult(result: any) {
            this._result = this._helper.CreatePromise(result);
        }

        constructor(private $q: ng.IQService) {
            this._helper = new PromiseHelper($q);
        }

        Object: IModalServiceInstanceMock = {
            close: () => {},
            dismiss: () => {},
            result: this._result,
            opened: this._opened,
            rendered: this._rendered,
            SetResult: (result: any) => { this.SetResult(result); }
        };
    }
}  