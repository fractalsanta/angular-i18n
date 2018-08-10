module Core.Directives {
    "use strict";

    export interface IGridHeaderDefinition {
        Title: string;
        Fields?: string[];
        Direction?: string;
        Class?: string;
    }

    export interface IGridHeader {
        Columns: IGridHeaderDefinition[];
        OnSortEvent(): void;
        IsAscending?: boolean;
        Selected?: IGridHeaderDefinition;
        DefaultSort?(data: any[]): any[];
    }

    export interface IMxGridHeaderScope extends ng.IScope {
        SortColumn(header: IGridHeaderDefinition): void;
        Header: IGridHeader;
        SplitLines(value: string): string[];
    }

    export class MxGridHeaderController {
        private _isAscending = true;

        constructor(
            private $scope: IMxGridHeaderScope
            ) {

            $scope.SplitLines = (value: string): string[]=> {
                return (value || "").split("\n");
            };

            $scope.Header.DefaultSort = (data: any[]): any[]=> {
                if (!$scope.Header || !$scope.Header.Selected || !$scope.Header.Selected.Fields) {
                    return data;
                }

                var fields = $scope.Header.Selected.Fields;
                var sortPath:string[][] = [];

                // separate each field by the . into a lookup path
                for (var i = 0; i < fields.length; i++) {
                    sortPath.push(fields[i].split("."));
                }

                var numFields = sortPath.length;

                var sortHandler = (item: any): any => {
                    var compositeValue = null;
                    var i,j: number;

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

                        // if we have a string, lower case it
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

            $scope.SortColumn = (column: IGridHeaderDefinition): void => {
                if ($scope.Header.Selected  != column) {
                    $scope.Header.IsAscending = true;
                } else {
                    $scope.Header.IsAscending = !$scope.Header.IsAscending;
                }

                $scope.Header.Selected = column;
                $scope.Header.OnSortEvent();
            };
        }
    }

    Core.NG.CoreModule.RegisterNamedController("MxGridHeaderController", MxGridHeaderController,
        Core.NG.$typedScope<IMxGridHeaderScope>());

    class MxGridHeaderDirective implements ng.IDirective {
        constructor() {
            return <ng.IDirective>{
                restrict: "E",
                scope: {
                    Header: "=header"
                },
                replace: true,
                templateUrl: "/Areas/Core/Templates/mx-grid-header.html",
                controller: "Core.MxGridHeaderController"
            };
        }
    }

    NG.CoreModule.RegisterDirective("mxGridHeader", MxGridHeaderDirective);
}