var Core;
(function (Core) {
    var NG;
    (function (NG) {
        "use strict";
        var MxDisableButtonIfBusy = (function () {
            function MxDisableButtonIfBusy($http) {
                return {
                    restrict: "A",
                    link: function (scope, element) {
                        var elem = element[0];
                        scope.$watch(function () {
                            return $http.pendingRequests.length > 0;
                        }, function (hasPending) {
                            if (hasPending) {
                                elem.disabled = true;
                            }
                            else {
                                elem.disabled = false;
                            }
                        });
                    }
                };
            }
            return MxDisableButtonIfBusy;
        }());
        NG.CoreModule.RegisterDirective("mxDisableButtonIfBusy", MxDisableButtonIfBusy, Core.NG.$http);
    })(NG = Core.NG || (Core.NG = {}));
})(Core || (Core = {}));
