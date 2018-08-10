/// <reference path="../TestFramework.ts" />
/// <reference path="../../typescript/constants.ts" />
/// <reference path="../../typescript/directives/mx-grid-header-directive.ts" />

describe("@ts Grid Header Directive", () => {
    var injector: ng.auto.IInjectorService;
    var scope: any;  // Core.Directives.IMxGridHeaderScope;
    var form: any;
    var sampleData: any[];

    beforeEach((): void => {
        inject(($rootScope: ng.IScope, $compile: ng.ICompileService): void => {
            scope = $rootScope.$new();
            var col1 = {
                Title: 'Test 1',
                Fields: ['A']
            };
            var col2 = {
                Title: 'Test 2',
                Fields: ['B.B']
            };
            var col3 = {
                Title: 'Test 3',
                Fields: ['num']
            };
            scope.Header = {
                Columns: [col1, col2, col3],
                Selected: col1,
                IsAscending: true
            };
            form = $compile("<form><mx-grid-header header='Header' ></mx-grid-header></form>")(scope);
            scope.$digest();
        });

        sampleData = [
            {
                A: 'A',
                num: 1,
                B: {B:1}
            },
            {
                A: 'A',
                num: 1,
                B: { B: 5 }
            },
            {
                A: 'AA',
                num: 2,
                B: { B: 2 }
            },
            {
                A: null,
                num: null,
                B: { B: null }
            },
            {
                A: 'NullOnly',
                num: 2,
                B: null
            },
            {
                A: 'AA',
                num: 2,
                B: { B: 4 }
            }
        ];
    });


    //it("basic resolve the service", () => {
    //    expect(form).not.toBeNull();
    //    expect(scope['Header']).not.toBeNull();
    //    console.log(JSON.stringify(scope['Header']));
    //    expect(scope['Header'].DefaultSort).toBeDefined();
    //});


    it("Default Sort", () => {

        var controller = new Core.Directives.MxGridHeaderController(scope);
        //console.log(JSON.stringify(scope['Header']));

        expect(scope['Header'].DefaultSort).toBeDefined();
        var result = scope['Header'].DefaultSort(sampleData);
        //console.log(JSON.stringify(result));
        expect(result[0].A).toEqual(null);
        expect(result[1].A).toEqual('A');
        expect(result[2].A).toEqual('A');
        expect(result[3].A).toEqual('AA');
        expect(result[4].A).toEqual('AA');
    });

    it("Default Integer Sort", () => {

        var controller = new Core.Directives.MxGridHeaderController(scope);
        scope.Header.Selected = scope.Header.Columns[1];
        //console.log(JSON.stringify(scope['Header']));

        expect(scope['Header'].DefaultSort).toBeDefined();
        var result = scope['Header'].DefaultSort(sampleData);
        //console.log(JSON.stringify(result));
        expect(result[0].B.B).toEqual(null);
        expect(result[1].B).toEqual(null);
        expect(result[2].B.B).toEqual(1);
        expect(result[3].B.B).toEqual(2);
        expect(result[4].B.B).toEqual(4);
        expect(result[5].B.B).toEqual(5);
    });

    it("Default Integer Sort one level", () => {

        var controller = new Core.Directives.MxGridHeaderController(scope);
        scope.Header.Selected = scope.Header.Columns[2];
        //console.log(JSON.stringify(scope['Header']));

        expect(scope['Header'].DefaultSort).toBeDefined();
        var result = scope['Header'].DefaultSort(sampleData);
        //console.log(JSON.stringify(result));
        expect(result[0].num).toEqual(null);
        expect(result[1].num).toEqual(1);
        expect(result[2].num).toEqual(1);
        expect(result[3].num).toEqual(2);
        expect(result[4].num).toEqual(2);
        expect(result[5].num).toEqual(2);
    });

});