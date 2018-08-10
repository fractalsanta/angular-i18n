/// <reference path="TestFramework.ts" />
/// <reference path="../typescript/events.ts" />

describe("Events", () => {
    var event: Core.Events.IEvent<string>;
    var rootScope: ng.IRootScopeService;

    beforeEach(() => {
        inject(($rootScope)=> {
            rootScope = $rootScope;
        });

        event = new Core.Events.Event<String>();
    });

    it("Subscribes", ()=> {

        var callback1 = (arg) => { };
        var callback2 = (arg) => { };
        event.Subscribe(callback1);
        var jsEvent = <any>event;
        expect(jsEvent._callbacks.length).toEqual(1);
        expect(jsEvent._callbacks.indexOf(callback1)).toEqual(0);

        event.Subscribe(callback2);
        expect(jsEvent._callbacks.length).toEqual(2);
        expect(jsEvent._callbacks.indexOf(callback2)).toEqual(1);
    });

    it("Unsubscribes", ()=> {
        var callback1 = (arg) => { };
        var callback2 = (arg) => { };
        event.Subscribe(callback1);
        event.Subscribe(callback2);

        var jsEvent = <any>event;

        expect(jsEvent._callbacks.indexOf(callback2)).toEqual(1);

        event.Unsubscribe(callback1);
        expect(jsEvent._callbacks.length).toEqual(1);
        expect(jsEvent._callbacks.indexOf(callback2)).toEqual(0);

        event.Unsubscribe(callback2);
        expect(jsEvent._callbacks.indexOf(callback2)).toEqual(-1);
    });

    it("Fires event", () => {
        var eventArg = "hello";
        var callback1 = jasmine.createSpy("callback1");
        var callback2 = jasmine.createSpy("callback2");
        event.Subscribe(callback1);
        event.Subscribe(callback2);

        event.Fire(eventArg);

        expect(callback1).toHaveBeenCalledWith(eventArg);
        expect(callback2).toHaveBeenCalledWith(eventArg);
    });

    it("Subscribes Controller", ()=> {
        var eventArg = "hello";
        var callback1 = jasmine.createSpy("callback1");
        var callback2 = jasmine.createSpy("callback2");

        var scope1 = rootScope.$new(true);
        var scope2 = rootScope.$new(true);
        
        event.SubscribeController(scope1, callback1);
        event.SubscribeController(scope2, callback2);

        event.Fire(eventArg);

        expect(callback1).toHaveBeenCalledWith(eventArg);
        expect(callback2).toHaveBeenCalledWith(eventArg);
        
        scope1.$destroy();
        rootScope.$digest();

        var jsEvent = <any>event;

        expect(jsEvent._callbacks.length).toEqual(1);
        expect(jsEvent._callbacks.indexOf(callback2)).toEqual(0);

        event.Fire(eventArg);

        expect(callback1.calls.count()).toEqual(1);
        expect(callback2.calls.count()).toEqual(2);

        scope2.$destroy();
        rootScope.$digest();

        expect(jsEvent._callbacks.length).toEqual(0);
        expect(jsEvent._callbacks.indexOf(callback2)).toEqual(-1);

        event.Fire(eventArg);
        expect(callback1.calls.count()).toEqual(1);
        expect(callback2.calls.count()).toEqual(2);
    });
}); 