module Core.Tests {

    export class SettingServiceMock implements IMock<Administration.Settings.Api.ISettingsService> {
        
        private _settings: any;
        private _helper: PromiseHelper;

        constructor(private $q: ng.IQService) {
            this._helper = new PromiseHelper($q);

            this._settings = {

                data: {
                    System_Operations_HotSchedulesSamlSsoUrl: "HotSchedules"
                }
            };
        }

        public Object: Administration.Settings.Api.ISettingsService = {
            GetMeasures: (type: Administration.Settings.Api.Models.SettingEnums, entityId: number): ng.IHttpPromise<Administration.Settings.Api.Models.ISettingGroup[]> => {
                return null;
            },

            POSTReportMeasureConfig: (measure: Administration.Settings.Api.Models.ISettingMeasure, action: string): ng.IHttpPromise<{}> => {
                return null;
            },

            GetConfigurationSettings: (settings: Core.Api.Models.ConfigurationSetting[]): ng.IHttpPromise<any> => {
                return this._helper.CreateHttpPromise(this._settings);
            }
        };
    }
}
