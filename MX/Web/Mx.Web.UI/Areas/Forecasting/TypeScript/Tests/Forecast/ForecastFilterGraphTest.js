var Forecasting;
(function (_Forecasting) {
    (function (Tests) {
        "use strict";

        describe("@ts forecast filter graph Controller", function () {
            var q, scope, timeout, translationServiceMock, testTranslations = {
                Forecasting: {}
            }, fos;

            var createTestController = function (params) {
                var params, currentMetric, fo;

                params.metric = params.metric.toLowerCase();
                currentMetric = _Forecasting.Services.metricMap[params.metric];

                scope.Options = {
                    Metric: params.metric,
                    MetricKey: currentMetric.MetricKey,
                    Template: currentMetric.Template,
                    Part: params.part === null ? null : Number(params.part),
                    PartIndex: params.part === null || !fo || !fo.Metrics ? 0 : fo.Metrics.TypeIndexes[_Forecasting.Services.IntervalTypes.DaySegment][params.part],
                    ItemId: params.itemid ? Number(params.itemid) : null,
                    IntervalTypes: _Forecasting.Services.IntervalTypes,
                    ForecastIndex: 0,
                    EventProfile: null,
                    Filters: null,
                    FiltersMap: {},
                    HasFilters: false
                };

                return new Forecasting.ForecastFilterGraphController(scope, timeout, fos, translationServiceMock.Object);
            };

            beforeEach(function () {
                inject(function ($rootScope, $q, $location, $timeout) {
                    q = $q;
                    scope = $rootScope;
                    timeout = $timeout;
                    translationServiceMock = new Core.Tests.TranslationServiceMock(q);

                    fos = new _Forecasting.Services.ForecastingObjectService($q, $location, $timeout);
                });
            });

            it("defines all scope methods and models upon initialization", function () {
                createTestController({
                    metric: "sales"
                });
            });

            it("loads translations correctly and sets correct header", function () {
                translationServiceMock.InjectTranslations(testTranslations);

                var controller = createTestController({
                    metric: "sales"
                });
            });
        });
    })(_Forecasting.Tests || (_Forecasting.Tests = {}));
    var Tests = _Forecasting.Tests;
})(Forecasting || (Forecasting = {}));
//# sourceMappingURL=ForecastFilterGraphTest.js.map
