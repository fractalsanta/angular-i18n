module Inventory.Transfer {

    export interface IModalServiceMock extends ng.ui.bootstrap.IModalService {
        SetAddNewItems(data: Api.Models.ITransferableItem[]): IModalServiceMock;
    }

    export class ModalServiceInstanceMock implements ng.ui.bootstrap.IModalServiceInstance {

        private _data: any;
        private _helper: PromiseHelper;

        constructor(private $q: ng.IQService, data: any) {
            this._data = data;
            this._helper = new PromiseHelper($q);
            this.result = this._helper.CreatePromise(this._data);
        }

        close(reason?: any) {
            return reason;
        }
        dismiss(reason?: any) {
        }

        result: ng.IPromise<any>;
        opened: ng.IPromise<any>;
        rendered: ng.IPromise<any>;
    }

    export class ModalServiceMock implements ng.ui.bootstrap.IModalService {

        private _data: any;
        private _helper: PromiseHelper;
        private _instance: ng.ui.bootstrap.IModalServiceInstance;

        constructor(private $q: ng.IQService) {
            this._helper = new PromiseHelper($q);
        }

        SetAddNewItems(items: Api.Models.ITransferableItem[]) {
            this._data = items;
            return this;
        }

        open(options: ng.ui.bootstrap.IModalSettings) {
            this._instance = new ModalServiceInstanceMock(this.$q, this._data);
            return this._instance;
        }
    }
}