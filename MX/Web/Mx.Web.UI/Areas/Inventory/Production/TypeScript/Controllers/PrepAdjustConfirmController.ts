module Inventory.Production {
    "use strict";


    interface IPrepAdjustConfirmModel {
        ApplyDate: Date;
        MaxDate: Date;
        DateOptions: {};
        ItemsCount: number;
        ShowApplyDate: boolean;
    }

    interface IPrepAdjustConfirmController extends ng.IScope {
        Model: IPrepAdjustConfirmModel;
        Translation: Api.Models.IL10N;
        ValidateDate(value: Date): boolean;
        OpenApplyDate($event: Event): void;
        Cancel(): void;
        Submit(): void;
    }

    class PrepAdjustConfirmController {
        constructor(
            private $scope: IPrepAdjustConfirmController,
            private modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private translationService: Core.ITranslationService,
            private items: Production.Api.Models.IPrepAdjustedItem[]
            ) {
            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                $scope.Translation = result.InventoryProduction;
            });

            $scope.Model = {
                ShowApplyDate: false,
                MaxDate: moment().toDate(),
                ApplyDate: new Date(),
                DateOptions: {
                    'year-format': "'yy'",
                    'starting-day': 1,
                    showWeeks: false
                },
                ItemsCount: items.length
            };

            $scope.Cancel = () => modalInstance.dismiss();
            $scope.Submit = () => {
                modalInstance.close($scope.Model.ApplyDate);
            };

            $scope.ValidateDate = (value: Date): boolean => {
                if (!value) {
                    return false;
                }

                var m = moment(value);
                if (!m.isValid()) {
                    return false;
                }

                return !m.isAfter(moment());
            };

            $scope.Model.ShowApplyDate = false;

            $scope.OpenApplyDate = ($event: Event): void => {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.Model.ShowApplyDate = !$scope.Model.ShowApplyDate;
            };
        }
    }

    Core.NG.InventoryProductionModule.RegisterNamedController("PrepAdjustConfirmController", PrepAdjustConfirmController,
        Core.NG.$typedScope<IPrepAdjustConfirmController>(),
        Core.NG.$modalInstance,
        Core.$translation,
        Core.NG.$typedCustomResolve<any>("items")
        );
}
