declare module Administration.Settings {
    export interface IForecastFilterControllerScope extends ng.IScope {
        Translations: Administration.Settings.Api.Models.IL10N;

        Vm: {
            Functions: Forecasting.Api.Models.IForecastFilterAssignRecord[];
            FunctionsMap: any;
            ForecastFilters: Forecasting.Api.Models.IForecastFilterRecord[];
        };

        DoRecordsExist(): boolean;
        CanEditForecastViaFilter(record: Forecasting.Api.Models.IForecastFilterRecord): boolean;

        AddForecastFilter(): void;
        ViewForecastFilter(record: Forecasting.Api.Models.IForecastFilterRecord): void;

        UsedByForecastFilter(record: Forecasting.Api.Models.IForecastFilterRecord): string;
        InUseForecastFilter(record: Forecasting.Api.Models.IForecastFilterRecord): boolean;
        DeleteForecastFilter(record: Forecasting.Api.Models.IForecastFilterRecord): void;
    }
}