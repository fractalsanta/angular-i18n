module Administration.Hierarchy {
    "use strict";

    interface IFormData {
        Name: string;
        Number: string;
    }

    interface INewLocationControllerScope extends ng.IScope {
        LocationInfo: string;
        Translations: Api.Models.ITranslations;
        FormData: IFormData;
        NewLocations: Services.ILocation[];

        Confirm(isDone: boolean): void;
        AddAnother(): void;
        Finish(): void;
        Cancel(): void;
    }

    class NewLocationController {
        constructor(
            private $scope: INewLocationControllerScope,
            translation: Core.ITranslationService,
            popup: Core.IPopupMessageService,
            locationService: Services.ILocationService,
            selectedLocation: Services.ILocation,
            $modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            $window: ng.IWindowService
            ) {

            this.ClearForm();


            $scope.NewLocations = [];
            $scope.LocationInfo = selectedLocation.DisplayName;

            translation.GetTranslations().then((results: Core.Api.Models.ITranslations): void => {
                $scope.Translations = results.Hierarchy;
            });

            popup.Dismiss();

            $scope.Confirm = (isDone: boolean): void => {
                locationService.CreateNewLocationForParent(selectedLocation.Id, $scope.FormData.Name, $scope.FormData.Number)
                    .then(
                    (result): void => {
                        locationService.GetLocationById(result.data).then((newLocation: Services.ILocation): void => {
                            popup.ShowSuccess(newLocation.DisplayName + $scope.Translations.AddedSingleLocation + $scope.LocationInfo);
                            $scope.NewLocations.push(newLocation);

                            if (isDone) {
                                $modalInstance.close($scope.NewLocations);
                            }

                            this.ClearForm();
                        });
                    },
                    (response)=> {
                        popup.ShowError($scope.Translations[response.statusText]);
                    });
            };

            $scope.AddAnother = (): void => {
                popup.Dismiss();
                $scope.Confirm(false);
                $window.scrollTo(0, 0);
            };

            $scope.Finish = (): void => {
                if ($scope.FormData.Number && $scope.FormData.Name) {
                    $scope.Confirm(true);
                } else {
                    $modalInstance.close($scope.NewLocations);
                }
            };

            $scope.Cancel = (): void => {
                if ($scope.NewLocations.length > 0) {
                    $modalInstance.close($scope.NewLocations);
                } else {
                    $modalInstance.dismiss();
                }
            };
        }
        private ClearForm() {
            this.$scope.FormData = {
                Name: null,
                Number: null
            };
        }
    }

    Core.NG.AdministrationHierarchyModule.RegisterNamedController("NewLocation", NewLocationController,
        Core.NG.$typedScope<INewLocationControllerScope>(),
        Core.$translation,
        Core.$popupMessageService,
        Services.$locationService,
        Core.NG.$typedCustomResolve<Services.ILocation>("selectedLocation"),
        Core.NG.$modalInstance,
        Core.NG.$window
        );
}
