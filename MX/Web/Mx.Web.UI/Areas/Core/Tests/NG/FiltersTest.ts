/// <reference path="../TestFramework.ts" />
/// <reference path="../../typescript/constants.ts" />
/// <reference path="../Mocks/SystemSettingsServiceMock.ts"/>
/// <reference path="../../typescript/NG/filters.ts" />
/// <reference path="../../../../Areas/Core/TypeScript/Interfaces/ISystemSettingsService.d.ts" />

describe("@ts Filters", () => {
    var filter: ng.IFilterService;
    var systemSettingsServiceMock = new Core.Tests.SystemSettingsServiceMock();

    beforeEach(() => {
        angular.module('Core').factory(Core.$systemSettingsService.name, () => systemSettingsServiceMock.Object);
    });

    beforeEach(() => {
        angular.mock.module('Core');
    });
        
    beforeEach(inject(($filter) => {
        filter = $filter;
    }));

    it("Currency or Dash - zero", () => {
        var currency = filter<ng.IFilterNumber>("currencyOrDash");
        var result = currency("0");
        expect(result).toEqual('-');
    });

    it("Currency or Dash - zero dot zero zero", () => {
        var currency = filter<ng.IFilterNumber>("currencyOrDash");
        var result = currency("0.00");
        expect(result).toEqual('-');
    });

    it("Currency or Dash - 1", () => {
        var currency = filter<ng.IFilterNumber>("currencyOrDash");
        var result = currency("1");
        expect(result).toEqual(systemSettingsServiceMock.GetCurrencySymbol() + '1.00');
    });
    it("Currency or Dash - minus 1", () => {
        var currency = filter<ng.IFilterNumber>("currencyOrDash");
        var result = currency("-1");
        expect(result).toBe('-' + systemSettingsServiceMock.GetCurrencySymbol() + '1.00');
    });

});
