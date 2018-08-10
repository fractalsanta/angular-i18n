module Administration.Hierarchy {
    "use strict";

    interface IHierarchyControllerScope extends ng.IScope {
        Translations: Api.Models.ITranslations;
        HierarchyLevels: string[];

        SelectedLocation: Services.ILocation;
        SearchedLocation: Services.ILocation;
        SelectedLocationChildren: Services.ILocation[];
        Breadcrumbs: Services.ILocation[];

        SelectLocation(location: Services.ILocation): void;
        AddLocation(): void;
        EditLocation(currentLocation: Services.ILocation): void;
        GetHierarchy(): void;

        SearchOptions: Core.Directives.IMxEntitySearchOptions;
    }

    class HierarchyController {
        constructor(
            $scope: IHierarchyControllerScope,
            translation: Core.ITranslationService,
            popup: Core.IPopupMessageService,
            locationService: Services.ILocationService,
            $modalService: ng.ui.bootstrap.IModalService,
            $window: ng.IWindowService
            ) {
            translation.GetTranslations().then((results: Core.Api.Models.ITranslations): void => {
                $scope.Translations = results.Hierarchy;
                popup.SetPageTitle(results.Hierarchy.Hierarchy);
            });

            $scope.Breadcrumbs = [];

            $scope.SelectLocation = (location: Services.ILocation): void => {
                var crumbs = [],
                    current = location,
                    parent = current.Parent;

                if (current.Type === $scope.HierarchyLevels.length) {
                    if (parent !== $scope.SelectedLocation) {
                        current = parent;
                        parent = current.Parent;
                    } else {
                        return;
                    }
                }

                $scope.SelectedLocation = current;
                $scope.SearchedLocation = null;
                $scope.SelectedLocationChildren = current.Children;

                crumbs.unshift(current);

                while (parent) {
                    current = parent;
                    crumbs.unshift(current);
                    parent = current.Parent;
                }

                $scope.Breadcrumbs = crumbs;
            };

            $scope.SearchOptions = <Core.Directives.IMxEntitySearchOptions>{
                OnSelect: (selectedLocation: Services.ILocation): void => {
                    locationService.GetLocationById(selectedLocation.Id).then((location: Services.ILocation): void => {
                        var isLowest = (location.Type === $scope.HierarchyLevels.length);

                        if (location) {
                            $scope.SelectLocation(location);
                            $scope.SearchedLocation = location;

                            if (isLowest) {
                                $scope.SelectedLocationChildren = [location].concat($scope.SelectedLocation.Children);
                            }
                        }
                    });
                }
            };

            $scope.AddLocation = (): void => {
                var modal = $modalService.open(<ng.ui.bootstrap.IModalSettings>{
                    templateUrl: "/Areas/Administration/Hierarchy/Templates/NewLocation.html",
                    controller: "Administration.Hierarchy.NewLocation",
                    resolve: {
                        selectedLocation: (): Services.ILocation => {
                            return $scope.SelectedLocation;
                        }
                    }
                });

                modal.result.then((result: Services.ILocation[]): void => {
                    if (result) {
                        var selectedStoreFormattedInfo = $scope.SelectedLocation.DisplayName,
                            resLength = result.length,
                            buildSuccessMsg: string;

                        if (resLength === 0) {
                            return;
                        }

                        if (resLength === 1) {
                            buildSuccessMsg = result[0].DisplayName + $scope.Translations.AddedSingleLocation + selectedStoreFormattedInfo;
                        } else {
                            buildSuccessMsg = resLength + $scope.Translations.AddedMultipleLocations + selectedStoreFormattedInfo;
                        }

                        popup.ShowSuccess(buildSuccessMsg);
                        $window.scrollTo(0, 0);
                    }
                });
            };

            $scope.EditLocation = (currentLocation: Services.ILocation): void => {
                var modal = $modalService.open(<ng.ui.bootstrap.IModalSettings>{
                    templateUrl: "/Areas/Administration/Hierarchy/Templates/EditLocation.html",
                    controller: "Administration.Hierarchy.EditLocation",
                    resolve: {
                        selectedLocation: (): Services.ILocation => {
                            return currentLocation;
                        }
                    }
                });

                modal.result.then((result: Services.ILocation): void => {
                    popup.ShowSuccess($scope.Translations.ChangesMadeTo + result.DisplayName + $scope.Translations.SuccessfullySaved);
                    $window.scrollTo(0, 0);
                });
            };

            locationService.Subscribe($scope, (location: Services.ILocation, levels: string[]): void => {
                $scope.HierarchyLevels = levels;
                $scope.SelectLocation(location);
            });
        }
    }

    Core.NG.AdministrationHierarchyModule.RegisterRouteController("", "Templates/Hierarchy.html", HierarchyController,
        Core.NG.$typedScope<IHierarchyControllerScope>(),
        Core.$translation,
        Core.$popupMessageService,
        Services.$locationService,
        Core.NG.$modal,
        Core.NG.$window);
}