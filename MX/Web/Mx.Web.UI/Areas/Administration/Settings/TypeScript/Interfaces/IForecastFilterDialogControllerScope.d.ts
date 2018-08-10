declare module Administration.Settings {
    import FApi = Forecasting.Api;

    export interface IForecastFilterDialogControllerScope extends ng.IScope {
        Translations: FApi.Models.ITranslations;

        Cancel(): void;
        SaveFilter(): void;
        HasType(id: number): boolean;
        HasTypes(): boolean;
        ToggleType(id: number): void;
        UsedType(id: number): boolean;

        Vm: {
            EditMode: boolean;
            Filter: FApi.Models.IForecastFilterRecord;
            ServiceTypes: Core.Api.Models.ITranslatedEnum[];
            ServiceTypesUsedMap: {};
            ValidationErrorMessage: string;
        }
    }
}