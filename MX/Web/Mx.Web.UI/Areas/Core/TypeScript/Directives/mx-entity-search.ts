module Core.Directives {
    "use strict";

    interface IMxEntitySearchScope extends ng.IScope {
        Translations: Administration.Hierarchy.Api.Models.ITranslations;

        Entries: IListEntry[];
        SearchText: string;
        IsOnlyLowestlevel: boolean;
        HasFocus: boolean;

        FilterEntries(): void;

        SelectEntity(entry: IListEntry): void;

        Options: IMxEntitySearchOptions;
    }

    interface IListEntry {
        IsHeader: boolean;
        Location?: Administration.Hierarchy.Services.ILocation;
        Type: number;
    }

    export interface IMxEntitySearchOptions {
        OnSelect(location: Administration.Hierarchy.Services.ILocation): void;
        OnFilter(location: Administration.Hierarchy.Services.ILocation): boolean;
    }

    interface IMxEntitySearchAttributes extends ng.IAttributes {
        onlylowestlevel: string;
    }

    class MxEntitySearchController {
        private _originalEntries: IListEntry[];

        constructor(
            $scope: IMxEntitySearchScope,
            private locationService: Administration.Hierarchy.Services.ILocationService,
            translation: Core.ITranslationService) {

            $scope.SearchText = "";

            translation.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                $scope.Translations = result.Hierarchy;
            });

            $scope.FilterEntries = (): void => {
                var lowestlevel: number = locationService.GetLowestHiearchyLevel(),
                    searchText = $scope.SearchText.trim().toLocaleLowerCase(),
                    length = this._originalEntries.length,
                    filteredEntries = [],
                    current: IListEntry,
                    i;

                if (!searchText) {
                    $scope.Entries = [];
                    return;
                }

                // Loop through locations in reverse to allow locations a chance to be filtered before their
                // grouping header so the header can determine if it is needed.
                for (i = length - 1; i >= 0; i -= 1) {
                    current = this._originalEntries[i];

                    if (!current.IsHeader && $scope.Options.OnFilter && !$scope.Options.OnFilter(current.Location)) {
                        continue;
                    }

                    if ((current.IsHeader && (filteredEntries.length && filteredEntries[filteredEntries.length - 1].Type === current.Type)) ||
                        (current.Location.Viewable && current.Location.DisplayName.toLowerCase().indexOf(searchText) !== -1)) {

                        if (!$scope.IsOnlyLowestlevel) {
                            filteredEntries.push(current);
                            continue;
                        }

                        if (current.Location.Type === lowestlevel) {
                            filteredEntries.push(current);
                        }
                    }
                }

                $scope.Entries = filteredEntries.reverse();
            };

            locationService.Subscribe($scope, (hierarchy: Administration.Hierarchy.Services.ILocation, levels: string[]): void => {
                locationService.GetLocationById(1).then((location: Administration.Hierarchy.Services.ILocation): void => {
                    var flattenedLocations = this.FlattenHierarchy(location);

                    this._originalEntries = this.BuildList(flattenedLocations, levels);

                    $scope.SearchText = "";
                    $scope.FilterEntries();
                });
            }, this);

            locationService.LoadData();
        }

        private FlattenHierarchy(location: Administration.Hierarchy.Services.ILocation): Administration.Hierarchy.Services.ILocation[] {
            var locations = <Administration.Hierarchy.Services.ILocation[]>[],
                length = location.Children.length,
                i;

            locations.push(location);

            for (i = 0; i < length; i += 1) {
                locations.push.apply(locations, this.FlattenHierarchy(location.Children[i]));
            }

            return locations;
        }

        private BuildList(locations: Administration.Hierarchy.Services.ILocation[], hierarchy: string[]): IListEntry[] {
            var locationList: IListEntry[] = [],
                groupings: Administration.Hierarchy.Services.ILocation[][] = [],
                length = locations.length,
                currentLocation: Administration.Hierarchy.Services.ILocation,
                currentGrouping: Administration.Hierarchy.Services.ILocation[],
                type: number,
                i: number,
                r: number;

            for (i = 0; i < length; i += 1) {
                currentLocation = locations[i];
                type = currentLocation.Type - 1;

                if (!groupings[type]) {
                    groupings[type] = [];
                }

                groupings[type].push(currentLocation);
            }

            length = groupings.length;

            for (i = 0; i < length; i += 1) {
                currentGrouping = groupings[i];

                if (!currentGrouping) {
                    continue;
                }

                length = currentGrouping.length;

                currentGrouping = _.sortBy(currentGrouping, (location: Administration.Hierarchy.Services.ILocation): string => {
                    return location.Name.toLowerCase();
                });

                locationList.push(<IListEntry>{
                    Location: <Administration.Hierarchy.Services.ILocation>{ DisplayName: hierarchy[i] },
                    IsHeader: true,
                    Type: i
                });

                for (r = 0; r < length; r += 1) {
                    locationList.push(<IListEntry>{
                        IsHeader: false,
                        Location: currentGrouping[r],
                        Type: i
                    });
                }

                length = groupings.length;
            }

            return locationList;
        }
    }

    class MxEntitySearch implements ng.IDirective {
        constructor($timeout: ng.ITimeoutService) {
            return <ng.IDirective>{
                restrict: "E",
                replace: true,
                scope: { Options: "=options" },
                templateUrl: "/Areas/Core/Templates/mx-entity-search.html",
                controller: "Core.MxEntitySearchController",
                link: ($scope: IMxEntitySearchScope, element: ng.IAugmentedJQuery, attrs: IMxEntitySearchAttributes): void => {
                    var input = element.find("input"),
                        list = element.find("div.list-group"),
                        panel = element.find(".panel"),
                        $window = angular.element(window),
                        exclude = ":not(.list-group-item-info, .list-group-item-warning)",
                        active = "active",
                        possibleElements: JQuery,
                        currentElement: JQuery,
                        reset;

                    reset = (): void => {
                        if (currentElement) {
                            currentElement.removeClass(active);
                        }

                        currentElement = null;
                        possibleElements = null;

                        $scope.IsOnlyLowestlevel = !(attrs.onlylowestlevel == undefined);
                    };

                    $scope.SelectEntity = (entry: IListEntry): void => {
                        panel.scrollTop(0);
                        $scope.SearchText = "";

                        if ($scope.Options.OnSelect) {
                            $scope.Options.OnSelect(entry.Location);
                        }

                        reset();
                    };

                    $scope.$watch("SearchText", (): void => {
                        panel.scrollTop(0);
                        panel.css({ maxHeight: $window.height() - panel.offset().top - 50 });

                        reset();
                    });

                    input.on("keydown", (e: JQueryEventObject): void => {
                        if (!$scope.Entries || !$scope.Entries.length) {
                            return;
                        }

                        if (e.shiftKey && e.which === KeyCodes.Tab) {
                            e.which = KeyCodes.Up;
                        }

                        switch (e.which) {
                            case KeyCodes.Enter: {
                                (<HTMLInputElement>e.target).blur();

                                // Handling of enter if entries have been navigated
                                // with keyboard controls.
                                if (currentElement) {
                                    panel.scrollTop(0);
                                    currentElement.click();
                                    return;
                                }

                                // Handling of enter if there is only one entry (and grouping header)
                                // in the list, making it the default choice.
                                if ($scope.Entries.length === 2) {
                                    $timeout((): void => { $scope.SelectEntity($scope.Entries[1]); }, 0, true);
                                    return;
                                }

                                break;
                            }
                            case KeyCodes.Tab:
                            case KeyCodes.Down: {
                                if (!currentElement) {
                                    currentElement = list.children(exclude).first();
                                    break;
                                }

                                possibleElements = currentElement.nextAll(exclude);

                                if (possibleElements.length) {
                                    currentElement.removeClass(active);
                                    currentElement = possibleElements.first();
                                }

                                break;
                            }
                            case KeyCodes.Up: {
                                if (!currentElement) {
                                    return;
                                }

                                possibleElements = currentElement.prevAll(exclude);

                                if (possibleElements.length) {
                                    currentElement.removeClass(active);
                                    currentElement = possibleElements.first();
                                }

                                break;
                            }
                            default: return;
                        }

                        if (currentElement) {
                            e.preventDefault();
                            currentElement.addClass(active);
                            panel.scrollTop(panel.scrollTop() + currentElement.position().top - (panel.height() / 2) + currentElement.outerHeight());
                        }
                    });

                    input.on("focus", (): void => {
                        $timeout((): void => {
                            $scope.HasFocus = true;
                        }, 0, true);
                    });

                    input.on("blur", (): void => {
                        $timeout((): void => {
                            $scope.HasFocus = false;
                            reset();
                        }, 0, true);
                    });

                    $window.on("resize.mx-entity-search", (): void => {
                        panel.css({ maxHeight: $window.height() - panel.offset().top - 50 });
                    });

                    $scope.$on("$destroy", (): void => {
                        $window.off("resize.mx-entity-search");
                    });
                }
            };
        }
    }

    NG.CoreModule.RegisterNamedController("MxEntitySearchController", MxEntitySearchController,
        NG.$typedScope<IMxEntitySearchScope>(),
        Administration.Hierarchy.Services.$locationService,
        Core.$translation);

    NG.CoreModule.RegisterDirective("mxEntitySearch", MxEntitySearch, Core.NG.$timeout);
}