var Core;
(function (Core) {
    "use strict";
    var TableSyncController = (function () {
        function TableSyncController($scope, $timeout, $interval) {
            this.$scope = $scope;
            $scope.Sync = function () {
                $scope.SyncTables($scope.$dest, $scope.$src);
                $timeout(function () {
                    $scope.SyncTables($scope.$dest, $scope.$src);
                }, 1000);
            };
            $scope.SyncTables = function ($dest, $src) {
                var bottom = $dest.position().top + $dest.outerHeight(true);
                $src.parent().css("top", bottom);
                if ($dest.width() !== $src.width()) {
                    $dest.css("padding-right", $dest.width() - $src.width());
                }
            };
            var resizeHandler = function () {
                $scope.Sync();
            };
            $(window).bind("resize", resizeHandler);
            $scope.$on("$destroy", function () {
                $(window).unbind("resize", resizeHandler);
            });
            $scope.$on("mxTableSync-refresh", function () {
                $scope.Sync();
            });
            $timeout($scope.Sync);
        }
        return TableSyncController;
    }());
    Core.NG.CoreModule.RegisterNamedController("TableSyncController", TableSyncController, Core.NG.$typedScope(), Core.NG.$timeout, Core.NG.$interval);
    var MxTableSync = (function () {
        function MxTableSync() {
            return {
                controller: "Core.TableSyncController",
                restrict: "A",
                scope: false,
                replace: true,
                transclude: 'element',
                template: "<div class='mx-table-sync header-container' ng-transclude style=''></div>",
                link: function ($scope, element, attrs) {
                    $scope.$dest = $(element);
                    $scope.$src = $(attrs.mxTableSync || $scope.$dest.next().find("table"));
                }
            };
        }
        return MxTableSync;
    }());
    Core.NG.CoreModule.RegisterDirective("mxTableSync", MxTableSync);
})(Core || (Core = {}));
