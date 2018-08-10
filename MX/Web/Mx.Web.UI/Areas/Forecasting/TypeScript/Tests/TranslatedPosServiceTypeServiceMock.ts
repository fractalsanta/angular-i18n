module Forecasting.Tests {
    "use strict";

    export class TranslatedPosServiceTypeServiceMock implements Core.Tests.IMock<Api.ITranslatedPosServiceTypeService> {
        private _promiseHelper: PromiseHelper;
        private _records: Core.Api.Models.ITranslatedEnum[];

        constructor(private $q: ng.IQService) {
            this._promiseHelper = new PromiseHelper($q);
            this._records = [];
        }

        public InjectRecordsToReturn(records: Core.Api.Models.ITranslatedEnum[]) {
            this._records = records;
        }

        public Object: Api.ITranslatedPosServiceTypeService = {
            GetPosServiceTypeEnumTranslations: (): ng.IHttpPromise<Core.Api.Models.ITranslatedEnum[]> => {
                return this._promiseHelper.CreateHttpPromise(this._records);
            }
        }
    }
}