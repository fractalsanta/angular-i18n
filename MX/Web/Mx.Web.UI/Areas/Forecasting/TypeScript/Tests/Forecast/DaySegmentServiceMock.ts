module Forecasting.Tests {
    "use strict";

    var _myDefaults = {
    };

    export class DaySegmentServiceMock extends DataMock implements Core.Tests.IMock<Api.IDaySegmentService> {
        constructor(public $q: ng.IQService) {
            super($q, _myDefaults);
        }

        public Object: Api.IDaySegmentService = {
            GetDaysegments: (entityId: number): ng.IHttpPromise<Forecasting.Api.Models.IDaySegment[]> => {
                return this.GetDataHttpPromise("GetDaysegments");
            }
        };
    };
} 