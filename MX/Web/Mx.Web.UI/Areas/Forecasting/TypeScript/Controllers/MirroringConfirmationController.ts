module Forecasting {
    "use strict";

    export interface IMirrorConfirmationControllerScope extends ng.IScope {
        Cancel(): void;
        OK(): void;
        Model: {
            Confirmation: Core.IConfirmation;
            L10N: Api.Models.ITranslations;
            Interval: IMySalesItemMirroringInterval;
            ButtonClass: string;
        }
    }

    export class MirrorConfirmationController {
        private L10N: Api.Models.ITranslations = <Api.Models.ITranslations>{};

        constructor(
            private $scope: IMirrorConfirmationControllerScope,
            private modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private translationService: Core.ITranslationService,
            private confirmation: Core.IConfirmation,
            private interval: IMySalesItemMirroringInterval
        ) {

            $scope.Cancel = (): void => modalInstance.dismiss();
            $scope.OK = (): void => modalInstance.close(this.$scope.Model.Interval.OverwriteManager);

            this.Initialize();
        }

        public Initialize(): void {
            this.$scope.Model = {
                L10N: null,
                Interval: _.cloneDeep(this.interval),
                Confirmation: this.confirmation,
                ButtonClass: this.confirmation.ConfirmationType === Core.ConfirmationTypeEnum.Positive ? 'btn-success' : 
                            this.confirmation.ConfirmationType === Core.ConfirmationTypeEnum.Danger ? 'btn-danger' :
                            'btn-warning'
            };

            this.GetL10N();
        }

        GetL10N(): void {
            var model: any = this.$scope.Model;

            this.translationService.GetTranslations().then((l10NData: any): void => {
                model.L10N = l10NData.Forecasting;

                if (!model.Confirmation.CancelText) {
                    model.Confirmation.CancelText = model.L10N.Cancel;
                }

            });
        }

    }

    export var mirrorConfirmationController = Core.NG.ForecastingModule.RegisterNamedController("MirrorConfirmationController", MirrorConfirmationController,
        Core.NG.$typedScope<IMirrorConfirmationControllerScope>(),
        Core.NG.$modalInstance,
        Core.$translation,
        Core.NG.$typedCustomResolve<Core.IConfirmation>("confirmation"),
        Core.NG.$typedCustomResolve<IMySalesItemMirroringInterval>("Interval")
       );
}