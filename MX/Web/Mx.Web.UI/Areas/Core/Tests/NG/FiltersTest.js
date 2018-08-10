describe("@ts Filters", function () {
    var filter;
    var systemSettingsServiceMock = new Core.Tests.SystemSettingsServiceMock();
    beforeEach(function () {
        angular.module('Core').factory(Core.$systemSettingsService.name, function () { return systemSettingsServiceMock.Object; });
    });
    beforeEach(function () {
        angular.mock.module('Core');
    });
    beforeEach(inject(function ($filter) {
        filter = $filter;
    }));
    it("Currency or Dash - zero", function () {
        var currency = filter("currencyOrDash");
        var result = currency("0");
        expect(result).toEqual('-');
    });
    it("Currency or Dash - zero dot zero zero", function () {
        var currency = filter("currencyOrDash");
        var result = currency("0.00");
        expect(result).toEqual('-');
    });
    it("Currency or Dash - 1", function () {
        var currency = filter("currencyOrDash");
        var result = currency("1");
        expect(result).toEqual(systemSettingsServiceMock.GetCurrencySymbol() + '1.00');
    });
    it("Currency or Dash - minus 1", function () {
        var currency = filter("currencyOrDash");
        var result = currency("-1");
        expect(result).toBe('-' + systemSettingsServiceMock.GetCurrencySymbol() + '1.00');
    });
});
