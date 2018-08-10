declare module Core {
    export interface ISystemSettingsService {
        GetCurrencySymbol(): string;
        GetLoginPageColorScheme(): number;
        UpdateLoginPageColorScheme(index: number): void;
    }

    export var $systemSettingsService: NG.INamedDependency<ISystemSettingsService>;
} 