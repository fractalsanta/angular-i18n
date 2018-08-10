var Core;
(function (Core) {
    Core.NG.CoreModule.Module().run([
        Core.NG.$filter.name, function ($filter) {
            Core.GetLocalizedCurrency = function (value) { return $filter('currencyNoDecimalOrComma')(value); };
        }
    ]);
})(Core || (Core = {}));
