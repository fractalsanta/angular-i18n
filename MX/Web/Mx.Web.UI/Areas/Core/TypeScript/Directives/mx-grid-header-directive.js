var Core;
(function (Core) {
    var Directives;
    (function (Directives) {
        "use strict";
        var MxGridHeaderController = (function () {
            function MxGridHeaderController($scope) {
                this.$scope = $scope;
                this._isAscending = true;
                $scope.SplitLines = function (value) {
                    return (value || "").split("\n");
                };
                $scope.Header.DefaultSort = function (data) {
                    if (!$scope.Header || !$scope.Header.Selected || !$scope.Header.Selected.Fields) {
                        return data;
                    }
                    var fields = $scope.Header.Selected.Fields;
                    var sortPath = [];
                    for (var i = 0; i < fields.length; i++) {
                        sortPath.push(fields[i].split("."));
                    }
                    var numFields = sortPath.length;
                    var sortHandler = function (item) {
                        var compositeValue = null;
                        var i, j;
                        for (i = 0; i < numFields; i++) {
                            var fieldPath = sortPath[i];
                            var fieldPathLength = fieldPath.length;
                            var value = item;
                            for (j = 0; j < fieldPathLength; j++) {
                                value = value[fieldPath[j]];
                                if (value == null) {
                                    value = '';
                                    break;
                                }
                            }
                            if (numFields > 1 && value && !value.toLowerCase) {
                                throw "You cannot sort on multiple non-string fields.";
                            }
                            value = value && value.toLowerCase ? value.toLowerCase() : value;
                            compositeValue = compositeValue ? compositeValue + String.fromCharCode(1) + value : value;
                        }
                        return compositeValue;
                    };
                    var result = _.sortBy(data, sortHandler);
                    if (!$scope.Header.IsAscending) {
                        return result.reverse();
                    }
                    return result;
                };
                $scope.SortColumn = function (column) {
                    if ($scope.Header.Selected != column) {
                        $scope.Header.IsAscending = true;
                    }
                    else {
                        $scope.Header.IsAscending = !$scope.Header.IsAscending;
                    }
                    $scope.Header.Selected = column;
                    $scope.Header.OnSortEvent();
                };
            }
            return MxGridHeaderController;
        }());
        Directives.MxGridHeaderController = MxGridHeaderController;
        Core.NG.CoreModule.RegisterNamedController("MxGridHeaderController", MxGridHeaderController, Core.NG.$typedScope());
        var MxGridHeaderDirective = (function () {
            function MxGridHeaderDirective() {
                return {
                    restrict: "E",
                    scope: {
                        Header: "=header"
                    },
                    replace: true,
                    templateUrl: "/Areas/Core/Templates/mx-grid-header.html",
                    controller: "Core.MxGridHeaderController"
                };
            }
            return MxGridHeaderDirective;
        }());
        Core.NG.CoreModule.RegisterDirective("mxGridHeader", MxGridHeaderDirective);
    })(Directives = Core.Directives || (Core.Directives = {}));
})(Core || (Core = {}));
