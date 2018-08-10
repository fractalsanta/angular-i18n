var Forecasting;
(function (Forecasting) {
    var Tests;
    (function (Tests) {
        "use strict";
        describe("@ts forecasting object service ReCalculateFilteredTotal", function () {
            var q, locationService, timeoutService, dataServiceMock, data, totalsFiltered, filtersMap, filters;
            var createTestController = function () {
                return new Forecasting.Services.ForecastingObjectService(q, locationService, timeoutService);
            };
            beforeEach(function () {
                inject(function ($q, $location, $timeout) {
                    q = $q;
                    locationService = $location;
                    timeoutService = $timeout;
                });
                dataServiceMock = new Tests.DataServiceMock(q);
                data = dataServiceMock.multiFilterMetricAllServiceMock.GetData("GetForecastMetricAlls");
                filtersMap = {};
                _.each(data, function (filtered) {
                    var filter = {
                        Id: filtered.FilterId,
                        Name: "test" + filtered.FilterId,
                        IsForecastEditableViaGroup: true,
                        ForecastFilterGroupTypes: []
                    }, options = {
                        Filter: filter,
                        Visible: true
                    };
                    filtersMap[filtered.FilterId || 0] = options;
                });
                totalsFiltered = filtersMap[0];
            });
            it("idk", function () {
                var controller = createTestController();
                var res = dataServiceMock.multiFilterMetricAllServiceMock.GetData("GetForecastMetricAlls");
                pending();
            });
        });
    })(Tests = Forecasting.Tests || (Forecasting.Tests = {}));
})(Forecasting || (Forecasting = {}));
