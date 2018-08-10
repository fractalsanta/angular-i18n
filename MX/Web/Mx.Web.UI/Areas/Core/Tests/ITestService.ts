module Core.Tests {
    // A sample Service interface
    export interface ITestService {
        RequestStuff(): ng.IPromise<string>;
    }

    export var $testService: NG.INamedDependency<ITestService> = null;
}