/// <reference path="../../../../Core/Tests/TestFramework.ts" />
/// <reference path="../../../../Core/Tests/Mocks/TranslationServiceMock.ts" />
/// <reference path="../../../../Core/Tests/Mocks/PopupMessageServiceMock.ts" />
/// <reference path="../../../../Core/Tests/Mocks/ModalServiceMock.ts" />
/// <reference path="../../Services/DataService.ts" />
/// <reference path="../../Services/ForcastingObjectService.ts" />

/// <reference path="./DataServiceMock.ts" />

module Forecasting.Tests {
    "use strict";

    describe("@ts forecasting object service ReCalculateFilteredTotal", (): void => {
        var q: ng.IQService,
            locationService: ng.ILocationService,
            timeoutService: ng.ITimeoutService,
            dataServiceMock: DataServiceMock,
            data: Services.IAllForecastingDataFiltered[],
            totalsFiltered: Services.IAllForecastingDataFiltered,
            filtersMap: any,
            filters: Api.Models.IForecastFilterRecord[]
            ;

        var createTestController = (): any => {
            return new Services.ForecastingObjectService(
                q,
                locationService,
                timeoutService
            );
        };

        beforeEach((): void => {
            inject(($q: ng.IQService, $location: ng.ILocationService, $timeout: ng.ITimeoutService): void => {
                q = $q;
                locationService = $location;
                timeoutService = $timeout;
            });

            dataServiceMock = new DataServiceMock(q);
            data = dataServiceMock.multiFilterMetricAllServiceMock.GetData("GetForecastMetricAlls");
            filtersMap = {};
            _.each(data, function (filtered: Services.IAllForecastingDataFiltered): void {
                var filter = <Api.Models.IForecastFilterRecord>{
                        Id: filtered.FilterId,
                        Name: "test" + filtered.FilterId,
                        IsForecastEditableViaGroup: true,
                        ForecastFilterGroupTypes: []
                    },
                    options = <Services.IFilterOptions>{
                        Filter: filter,
                        Visible: true
                    };
                filtersMap[filtered.FilterId || 0] = options;
            });
            totalsFiltered = filtersMap[0];
        });

        it("idk", (): void => {
            var controller = createTestController();

            var res: any = dataServiceMock.multiFilterMetricAllServiceMock.GetData("GetForecastMetricAlls");

            //console.log(res.length);
            //console.log(JSON.stringify(filtersMap));

            pending();

            //_.each(

        });
    });
}