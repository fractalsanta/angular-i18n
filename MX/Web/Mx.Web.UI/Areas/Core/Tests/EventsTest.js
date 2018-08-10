describe("Events", function () {
    var event;
    var rootScope;
    beforeEach(function () {
        inject(function ($rootScope) {
            rootScope = $rootScope;
        });
        event = new Core.Events.Event();
    });
    it("Subscribes", function () {
        var callback1 = function (arg) { };
        var callback2 = function (arg) { };
        event.Subscribe(callback1);
        var jsEvent = event;
        expect(jsEvent._callbacks.length).toEqual(1);
        expect(jsEvent._callbacks.indexOf(callback1)).toEqual(0);
        event.Subscribe(callback2);
        expect(jsEvent._callbacks.length).toEqual(2);
        expect(jsEvent._callbacks.indexOf(callback2)).toEqual(1);
    });
    it("Unsubscribes", function () {
        var callback1 = function (arg) { };
        var callback2 = function (arg) { };
        event.Subscribe(callback1);
        event.Subscribe(callback2);
        var jsEvent = event;
        expect(jsEvent._callbacks.indexOf(callback2)).toEqual(1);
        event.Unsubscribe(callback1);
        expect(jsEvent._callbacks.length).toEqual(1);
        expect(jsEvent._callbacks.indexOf(callback2)).toEqual(0);
        event.Unsubscribe(callback2);
        expect(jsEvent._callbacks.indexOf(callback2)).toEqual(-1);
    });
    it("Fires event", function () {
        var eventArg = "hello";
        var callback1 = jasmine.createSpy("callback1");
        var callback2 = jasmine.createSpy("callback2");
        event.Subscribe(callback1);
        event.Subscribe(callback2);
        event.Fire(eventArg);
        expect(callback1).toHaveBeenCalledWith(eventArg);
        expect(callback2).toHaveBeenCalledWith(eventArg);
    });
    it("Subscribes Controller", function () {
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
        var jsEvent = event;
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
