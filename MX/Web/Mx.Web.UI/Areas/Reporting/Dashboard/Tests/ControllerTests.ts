/// <reference path="../../../Core/Tests/TestFramework.ts" />

/// <reference path="../TypeScript/Services/DashboardService.ts" />
/// <reference path="../../../core/typescript/constants.ts" />
/// <reference path="../TypeScript/Controllers/DashboardController.ts" />

/// <reference path="Mocks.ts" />

describe("Dashboard Controller", () => {
    var mocks: Mocks;
    var q: ng.IQService;
    var popupMessageService: Core.IPopupMessageService;
    
    var rootScope: ng.IRootScopeService;
    beforeEach(() => {
        angular.module("ui.validate", []);
        inject(($q: ng.IQService, $rootScope: ng.IRootScopeService) => {
            q = $q;
            mocks = new Mocks($q);
            rootScope = $rootScope;
            popupMessageService = new Core.Tests.PopupMessageServiceMock();
        });
    });

    it("should bind data by KPI", () => {
        var scope = <Reporting.Dashboard.IDashboardScope>rootScope.$new(false);

        var controller = new Reporting.Dashboard.DashboardController(
            scope,
            mocks.Translations(),
            mocks.Measures(),
            mocks.ReferenceData(),
            popupMessageService,
            mocks.Graph(),
            mocks.Auth(),
            new ConstantsMock().Object
        );

        var entities: Reporting.Dashboard.Api.Models.IEntityMeasure[] = [];
        var reference: Reporting.Dashboard.Api.Models.IReferenceData = null;
        mocks.Measures().GetMeasures(0, 0, 0, "any string").then(r => entities = r.data);
        mocks.ReferenceData().Get().then(r => reference = r.data);
        rootScope.$digest(); // invoke the first round of callbacks
        rootScope.$digest(); // force the derived callback to invoke
        expect(entities.length).not.toBe(0);
        var entity = entities[0];
        var kpiName = "TransactionCount";
        var index = _.findIndex(reference.Groups[0].Measures, { Id: kpiName });
        var measure = _.find(entity.Measures, { Id: kpiName });
        var expected = measure.Intervals[0].DisplayValue;
        var value = scope.Value(entity, index);
        expect(value).toBe(expected);
    });
});
