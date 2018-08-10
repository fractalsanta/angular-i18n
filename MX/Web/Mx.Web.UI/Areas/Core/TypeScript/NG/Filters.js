var Core;
(function (Core) {
    var NG;
    (function (NG) {
        "use strict";
        Core.NG.CoreModule.Module().filter("parseDate", function () {
            return function (input) {
                if (!input || !moment(input).isValid()) {
                    return undefined;
                }
                else {
                    return moment(input).toDate();
                }
            };
        });
        Core.NG.CoreModule.Module().filter("formatDate", function () {
            return function (input, format) {
                return moment(input).format(format);
            };
        });
        Core.NG.CoreModule.Module().filter("translate", function () {
            return function (input, translations) {
                return (!translations || !translations[input]) ? input : translations[input];
            };
        });
        Core.NG.CoreModule.Module().config([
            '$provide', function ($provide) {
                $provide.decorator('currencyFilter', ['$delegate', Core.$systemSettingsService.name, function ($delegate, systemSettingsService) {
                        var srcFilter = $delegate;
                        var extendsFilter = function (amount, symbol, fractionSize) {
                            var g = srcFilter.apply(this, [amount, symbol || systemSettingsService.GetCurrencySymbol(), fractionSize]);
                            return g;
                        };
                        return extendsFilter;
                    }]);
            }
        ]);
        Core.NG.CoreModule.Module().filter("currencyOrDash", ["$filter", function ($filter) {
                var currency = $filter("currency");
                return function (amount, symbol, fractionSize) {
                    var value = Number(amount);
                    if (isNaN(value) || Math.abs(value) < 0.005) {
                        return "-";
                    }
                    return currency(value, symbol, fractionSize);
                };
            }]);
        Core.NG.CoreModule.Module().filter("currencyNoDecimalOrComma", ["$filter", "$locale", function ($filter, $locale) {
                var currency = $filter("currency"), formats = $locale.NUMBER_FORMATS;
                return function (amount, symbol) {
                    if (amount == null)
                        return null;
                    var formattedCurrency = currency(amount, symbol), noDecimalExpression = new RegExp("\\" + formats.DECIMAL_SEP + "\\d{2}"), value = formattedCurrency.replace(noDecimalExpression, "").replace(/,/g, "");
                    return value;
                };
            }]);
        Core.NG.CoreModule.Module().filter("capitalize", function () {
            return function (input) {
                if (!input || typeof input !== "string") {
                    return "";
                }
                return input[0].toUpperCase() + input.slice(1);
            };
        });
    })(NG = Core.NG || (Core.NG = {}));
})(Core || (Core = {}));
