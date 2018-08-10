module Core {
    export var GetLocalizedCurrency: (number) => string;

    Core.NG.CoreModule.Module().run([
        Core.NG.$filter.name, ($filter: ng.IFilterService) => {
            GetLocalizedCurrency = (value: number) => $filter<ng.IFilterNumber>('currencyNoDecimalOrComma')(value);
        }
    ]);
 }