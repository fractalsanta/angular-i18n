module Core.Tests {
    export class ModalServiceMock implements IMock<ng.ui.bootstrap.IModalService> {

        private _helper: PromiseHelper;
        private _instance: ng.ui.bootstrap.IModalServiceInstance;
        private _data;

        constructor(private $q: ng.IQService, result: any) {
            this._helper = new PromiseHelper($q);
            this._data = result;
        }

        Object: ng.ui.bootstrap.IModalService = {
            open: (options: ng.ui.bootstrap.IModalSettings) => {
                var instance = new ModalServiceInstanceMock(this.$q);
                instance.SetResult(this._data);

                this._instance = instance.Object;                                
                return this._instance;
            }
        };
    }
}   