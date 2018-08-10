module Forecasting {
    "use strict";

    interface ISelectStoreControllerScope extends ng.IScope {
        Cancel(): void;
        OK(): void;
        Model: {
            Stores: Core.Api.Models.IEntityModel[];
            SelectedStore: Core.Api.Models.IEntityModel;
            L10N?: Forecasting.Api.Models.ITranslations;
        }
    }

    class SelectStoreController {
        constructor(
            private $scope: ISelectStoreControllerScope,
            private modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private translationService: Core.ITranslationService,
            private StoreList: Core.Api.Models.IEntityModel[]
        ) {
            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                $scope.Model.L10N = result.Forecasting;
            });

            $scope.Model = {
                Stores: StoreList,
                SelectedStore: null
            };

            $scope.Cancel = (): void => modalInstance.dismiss();
            $scope.OK = (): void => modalInstance.close($scope.Model.SelectedStore);

        }
    }

    Core.NG.ForecastingModule.RegisterNamedController("SelectStoreController", SelectStoreController,
        Core.NG.$typedScope<ISelectStoreControllerScope>(),
        Core.NG.$modalInstance,
        Core.$translation,
        Core.NG.$typedCustomResolve<any>("Stores")
       );
} 