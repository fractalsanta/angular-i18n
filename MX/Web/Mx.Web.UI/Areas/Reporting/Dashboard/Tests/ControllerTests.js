describe("Dashboard Controller", function () {
    var mocks;
    var q;
    var popupMessageService;
    var rootScope;
    beforeEach(function () {
        angular.module("ui.validate", []);
        inject(function ($q, $rootScope) {
            q = $q;
            mocks = new Mocks($q);
            rootScope = $rootScope;
            popupMessageService = new Core.Tests.PopupMessageServiceMock();
        });
    });
    it("should bind data by KPI", function () {
        var scope = rootScope.$new(false);
        var controller = new Reporting.Dashboard.DashboardController(scope, mocks.Translations(), mocks.Measures(), mocks.ReferenceData(), popupMessageService, mocks.Graph(), mocks.Auth(), new ConstantsMock().Object);
        var entities = [];
        var reference = null;
        mocks.Measures().GetMeasures(0, 0, 0, "any string").then(function (r) { return entities = r.data; });
        mocks.ReferenceData().Get().then(function (r) { return reference = r.data; });
        rootScope.$digest();
        rootScope.$digest();
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
