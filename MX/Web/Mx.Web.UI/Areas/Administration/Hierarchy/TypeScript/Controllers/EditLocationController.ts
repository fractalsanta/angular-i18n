module Administration.Hierarchy {
    "use strict";

    interface IEditLocationControllerScope extends ng.IScope {
        LocationInfo: string;
        Translations: Api.Models.ITranslations;
        UpdatedLocation: Services.ILocation;

        Confirm(isDone: boolean): void;
        SaveAndClose(formScope: ng.IFormController): void;
        Cancel(): void;
        Update(formScope: ng.IFormController): void;
        FormScope: ng.IFormController;
        SelectParent(parent: Services.ILocation, formScope: ng.IFormController): void;
        SelectedParent: string;
        ParentOptions: { Value: string };
        Search: { FilterText: string };
        FilterOnLocation(location: Services.ILocation): boolean;
        NewParent: Services.ILocation;
        PossibleParents: Services.ILocation[];
        HierarchyLevel: string;
    }

    class EditLocationController {
        constructor(
            $scope: IEditLocationControllerScope,
            translation: Core.ITranslationService,
            popup: Core.IPopupMessageService,
            locationService: Services.ILocationService,
            selectedLocation: Services.ILocation,
            $modalInstance: ng.ui.bootstrap.IModalServiceInstance
            ) {
            $scope.NewParent = <Services.ILocation>{};

            $scope.UpdatedLocation = <Services.ILocation>{
                Name: selectedLocation.Name,
                Number: selectedLocation.Number,
                Parent: selectedLocation.Parent
            };

            $scope.ParentOptions = {
                Value: ""
            };

            $scope.Search = {
                FilterText: ""
            };

            $scope.LocationInfo = selectedLocation.DisplayName;

            if (selectedLocation.Parent) {
                $scope.ParentOptions.Value = selectedLocation.Parent.Number;
                if (selectedLocation.Parent.Parent) {
                    $scope.PossibleParents = selectedLocation.Parent.Parent.Children;
                }
            }

            $scope.FilterOnLocation = (loc: Services.ILocation): boolean => {
                return (loc.DisplayName.toLowerCase()).indexOf($scope.Search.FilterText.toLowerCase()) >= 0;
            };

            popup.Dismiss();

            translation.GetTranslations().then((results: Core.Api.Models.ITranslations): void => {
                $scope.Translations = results.Hierarchy;
            });

            locationService.Subscribe($scope, (location: Services.ILocation, levels: string[]): void => {
                if (selectedLocation.Parent) {
                    $scope.HierarchyLevel = levels[selectedLocation.Parent.Type - 1];
                } else {
                    $scope.HierarchyLevel = undefined;
                }
            });

            $scope.Confirm = (isDone: boolean): void => {
                locationService.UpdateLocation(selectedLocation.Id, $scope.UpdatedLocation.Number, $scope.UpdatedLocation.Name)
                    .then(
                    () => {
                        if ($scope.ParentOptions.Value !== "" && $scope.ParentOptions.Value !== selectedLocation.Parent.Number) {
                            locationService.MoveLocation(selectedLocation.Id, $scope.NewParent.Id)
                                .then(() => {
                                    $scope.FormScope.$setPristine();

                                    popup.ShowSuccess($scope.Translations.SaveSuccessful);

                                    if (isDone === true) {
                                        $modalInstance.close(selectedLocation);
                                    }
                                }, (response) => {
                                    popup.ShowError($scope.Translations[response.statusText]);
                                });
                        } else {
                            $scope.FormScope.$setPristine();

                            popup.ShowSuccess($scope.Translations.SaveSuccessful);

                            if (isDone === true) {
                                $modalInstance.close(selectedLocation);
                            }
                        }
                    },
                    (response) => {
                        popup.ShowError($scope.Translations[response.statusText]);
                    });
            };

            $scope.SaveAndClose = (formScope: ng.IFormController): void => {
                $scope.FormScope = formScope;
                if ($scope.FormScope.$dirty) {
                    $scope.Confirm(true);
                } else {
                    $modalInstance.close(selectedLocation);
                }
            };

            $scope.Cancel = (): void => {
                if (!$scope.FormScope || $scope.FormScope.$dirty) {
                    $modalInstance.dismiss();
                } else {
                    $modalInstance.close(selectedLocation);
                }
            };

            $scope.Update = (formScope: ng.IFormController): void => {
                $scope.FormScope = formScope;
                $scope.Confirm(false);
                popup.Dismiss();
            };

            $scope.SelectParent = (parent: Services.ILocation, formScope: ng.IFormController): void => {
                $scope.ParentOptions.Value = parent.Number;
                $scope.NewParent = parent;
                $scope.FormScope = formScope;
                $scope.FormScope.$setDirty();
            };
        }
    }

    Core.NG.AdministrationHierarchyModule.RegisterNamedController("EditLocation", EditLocationController,
        Core.NG.$typedScope<IEditLocationControllerScope>(),
        Core.$translation,
        Core.$popupMessageService,
        Services.$locationService,
        Core.NG.$typedCustomResolve<Services.ILocation>("selectedLocation"),
        Core.NG.$modalInstance
        );
}
