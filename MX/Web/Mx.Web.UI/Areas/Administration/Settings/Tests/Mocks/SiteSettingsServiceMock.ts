module Administration.Settings.Tests {

    export class SiteSettingsServiceMock implements Administration.Settings.Api.ISiteSettingsService {

        private _helper: PromiseHelper;
        private _data: Administration.Settings.Api.Models.ISiteSettings;

        constructor(private $q: ng.IQService) {
            this._helper = new PromiseHelper($q);
        }

        GetSiteSettings = () => {
            return this._helper.CreateHttpPromise(this._data);
        };

        PostSiteSettings = (settings: Administration.Settings.Api.Models.ISiteSettings) => {
            this._data = settings;
            return this._helper.CreateHttpPromise(null);
        };

        /* methods added for tests */
        SetSiteSettingsTest = (settings: Administration.Settings.Api.Models.ISiteSettings) => {
            this._data = settings;
        }

        GetSiteSettingsTest = (): Administration.Settings.Api.Models.ISiteSettings => {
            return this._data;
        }
    }
}