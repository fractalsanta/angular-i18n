module Core.NG {
    "use strict";

    Core.NG.CoreModule.Module().filter("parseDate", (): Function => {
        return (input: string): Date => {
            if (!input || !moment(input).isValid()) {
                return undefined;
            } else {
                return moment(input).toDate();
            }
        };
    });

    Core.NG.CoreModule.Module().filter("formatDate", (): Function => {
        return (input: string, format: string): string => {
            return moment(input).format(format);
        };
    });

    Core.NG.CoreModule.Module().filter("translate", (): Function => {
        return (input: string, translations: {}): string => {
            return (!translations || !translations[input]) ? input : translations[input];
        };
    });

    Core.NG.CoreModule.Module().config([
        '$provide', ($provide: ng.auto.IProvideService) => {
            $provide.decorator('currencyFilter', ['$delegate', $systemSettingsService.name, ($delegate: Function, systemSettingsService: ISystemSettingsService) => {
                var srcFilter = $delegate;
                var extendsFilter = function (amount: string, symbol: string, fractionSize?: number) {
                    var g = srcFilter.apply(this, [amount, symbol || systemSettingsService.GetCurrencySymbol(), fractionSize]);
                    return g;
                }
                return extendsFilter;
            }]);
        }
    ]);

    Core.NG.CoreModule.Module().filter("currencyOrDash", ["$filter", ($filter: ng.IFilterService): Function => {
        var currency = $filter("currency");
        
        return function (amount: string, symbol: string, fractionSize?: number): string {
            var value = Number(amount);
            
            if (isNaN(value) || Math.abs(value) < 0.005 ) {
                 return "-";
            }
            return currency(value, symbol, fractionSize);
        };
    }]);

    Core.NG.CoreModule.Module().filter("currencyNoDecimalOrComma", ["$filter", "$locale", ($filter: ng.IFilterService, $locale: ng.ILocaleService): Function => {
        var currency = $filter("currency"),
            formats = $locale.NUMBER_FORMATS;

        return (amount: string, symbol: string): string => {
            if (amount == null) return null;
                var formattedCurrency = currency(<any>amount, symbol),
                    noDecimalExpression = new RegExp("\\" + formats.DECIMAL_SEP + "\\d{2}"),
                    value = formattedCurrency.replace(noDecimalExpression, "").replace(/,/g, "");
                return value;
        };
    }]);

    Core.NG.CoreModule.Module().filter("capitalize", (): Function => {
        return (input: string): string => {
            if (!input || typeof input !== "string") {
                return "";
            }

            return input[0].toUpperCase() + input.slice(1);
        };
    });
}
