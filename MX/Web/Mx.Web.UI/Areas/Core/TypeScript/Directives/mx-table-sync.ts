module Core {
    "use strict";

    interface ITableSyncScope extends ng.IScope {
        $src: any;
        $dest: any;

        Sync(): void;
        SyncTables($dest: any, $src: any): void;
    }

    class TableSyncController {
        constructor(
                private $scope: ITableSyncScope,
                $timeout: ng.ITimeoutService,
                $interval: ng.IIntervalService) {

            $scope.Sync = (): void=> {
                $scope.SyncTables($scope.$dest, $scope.$src);
                $timeout(()=> {
                    $scope.SyncTables($scope.$dest, $scope.$src);
                }, 1000);
            };

            $scope.SyncTables = function($dest, $src): void {
                var bottom = $dest.position().top + $dest.outerHeight(true);
                $src.parent().css("top", bottom);

                if ($dest.width() !== $src.width()) {
                    $dest.css("padding-right", $dest.width() - $src.width());
                }
            };

            var resizeHandler = (): void => {
                $scope.Sync();
            };

            $(window).bind("resize", resizeHandler);

            $scope.$on("$destroy", (): void => {
                $(window).unbind("resize", resizeHandler);
            });

            $scope.$on("mxTableSync-refresh", (): void => {
                $scope.Sync();
            });

            $timeout($scope.Sync);
        }
    }

    NG.CoreModule.RegisterNamedController("TableSyncController", TableSyncController,
        Core.NG.$typedScope<ITableSyncScope>(),
        Core.NG.$timeout,
        Core.NG.$interval);

    class MxTableSync implements ng.IDirective {
        constructor() {
            return <ng.IDirective>{
                controller: "Core.TableSyncController",
                restrict: "A",
                scope: false,
                replace: true,
                transclude: 'element',
                template: "<div class='mx-table-sync header-container' ng-transclude style=''></div>",
                link: ($scope: ITableSyncScope, element: ng.IAugmentedJQuery, attrs: any): void => {
                    $scope.$dest = $(element);
                    $scope.$src = $(attrs.mxTableSync || $scope.$dest.next().find("table"));
                }
            };
        }
    }

    NG.CoreModule.RegisterDirective("mxTableSync", MxTableSync);
}