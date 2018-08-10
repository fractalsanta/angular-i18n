describe("DateCoreService", function () {
    var injector;
    beforeEach(function () {
        angular.module("ui.validate", []);
        angular.module(Core.NG.CoreModule.Module().name).constant(Core.Constants.name, {});
        return angular.mock.module("Core");
    });
    beforeEach(inject(function ($httpBackend, $injector) {
        injector = $injector;
    }));
    it("should resolve the service", function () {
        var service = injector.get("Core.Services.DateService");
        expect(service).not.toBeNull();
    });
    it("Should give Sunday", function () {
        var service = injector.get("Core.Services.DateService");
        expect(service.CalculateDayFromOffset(moment('2014-08-12'), 0).format('YYYY-MM-DD')).toEqual('2014-08-10');
    });
    it("Should give Monday", function () {
        var service = injector.get("Core.Services.DateService");
        expect(service.CalculateDayFromOffset(moment('2014-08-12'), 1).format('YYYY-MM-DD')).toEqual('2014-08-11');
    });
    it("Should give Tuesday", function () {
        var service = injector.get("Core.Services.DateService");
        expect(service.CalculateDayFromOffset(moment('2014-08-13'), 2).format('YYYY-MM-DD')).toEqual('2014-08-12');
    });
    it("Should give Wednesday", function () {
        var service = injector.get("Core.Services.DateService");
        expect(service.CalculateDayFromOffset(moment('2014-08-12'), 3).format('YYYY-MM-DD')).toEqual('2014-08-06');
    });
    it("Should give Thursday", function () {
        var service = injector.get("Core.Services.DateService");
        expect(service.CalculateDayFromOffset(moment('2014-08-13'), 4).format('YYYY-MM-DD')).toEqual('2014-08-07');
    });
    it("Should give Friday", function () {
        var service = injector.get("Core.Services.DateService");
        expect(service.CalculateDayFromOffset(moment('2014-08-12'), 5).format('YYYY-MM-DD')).toEqual('2014-08-08');
    });
    it("Should give Saturday", function () {
        var service = injector.get("Core.Services.DateService");
        expect(service.CalculateDayFromOffset(moment('2014-08-12'), 6).format('YYYY-MM-DD')).toEqual('2014-08-09');
    });
    it("Should give Tuesday - Today", function () {
        var service = injector.get("Core.Services.DateService");
        expect(service.CalculateDayFromOffset(moment('2014-08-12'), 2).format('YYYY-MM-DD')).toEqual('2014-08-12');
    });
    it("Overlapping - Is overlapping", function () {
        var service = injector.get("Core.Services.DateService");
        var times = [
            {
                Start: moment('2014-08-12T12:31'),
                End: moment('2014-08-12T12:34')
            },
            {
                Start: moment('2014-08-12T12:32'),
                End: moment('2014-08-12T14:31')
            }
        ];
        expect(service.IsOverlapping(times)).toBe(true);
    });
    it("Overlapping - One entry", function () {
        var service = injector.get("Core.Services.DateService");
        var times = [
            {
                Start: moment('2014-08-12T12:31'),
                End: moment('2014-08-12T12:32')
            }
        ];
        expect(service.IsOverlapping(times)).toBe(false);
    });
    it("Overlapping - Is not overlapping", function () {
        var service = injector.get("Core.Services.DateService");
        var times = [
            {
                Start: moment('2014-08-12T12:31'),
                End: moment('2014-08-12T12:34')
            },
            {
                Start: moment('2014-08-12T12:34'),
                End: moment('2014-08-12T14:38')
            }
        ];
        expect(service.IsOverlapping(times)).toBe(false);
    });
    it("Overlapping - Time range invalid", function () {
        var service = injector.get("Core.Services.DateService");
        var times = [
            {
                Start: moment('2014-08-12T12:34'),
                End: moment('2014-08-12T12:31')
            }
        ];
        expect(service.IsOverlapping(times)).toBe(true);
    });
    it("Overlapping - Time range Equal", function () {
        var service = injector.get("Core.Services.DateService");
        var times = [
            {
                Start: moment('2014-08-12T12:34'),
                End: moment('2014-08-12T12:34')
            }
        ];
        expect(service.IsOverlapping(times)).toBe(true);
    });
    it("Overlapping - Time range valid", function () {
        var service = injector.get("Core.Services.DateService");
        var times = [
            {
                Start: moment('2014-08-12T12:34'),
                End: moment('2014-08-12T12:35')
            }
        ];
        expect(service.IsOverlapping(times)).toBe(false);
    });
    it("Overlapping - Empty", function () {
        var service = injector.get("Core.Services.DateService");
        var times = [];
        expect(service.IsOverlapping(times)).toBe(false);
    });
});
