var Forecasting;
(function (Forecasting) {
    "use strict";
    var MirrorConfirmationController = (function () {
        function MirrorConfirmationController($scope, modalInstance, translationService, confirmation, interval) {
            var _this = this;
            this.$scope = $scope;
            this.modalInstance = modalInstance;
            this.translationService = translationService;
            this.confirmation = confirmation;
            this.interval = interval;
            this.L10N = {};
            $scope.Cancel = function () { return modalInstance.dismiss(); };
            $scope.OK = function () { return modalInstance.close(_this.$scope.Model.Interval.OverwriteManager); };
            this.Initialize();
        }
        MirrorConfirmationController.prototype.Initialize = function () {
            this.$scope.Model = {
                L10N: null,
                Interval: _.cloneDeep(this.interval),
                Confirmation: this.confirmation,
                ButtonClass: this.confirmation.ConfirmationType === Core.ConfirmationTypeEnum.Positive ? 'btn-success' :
                    this.confirmation.ConfirmationType === Core.ConfirmationTypeEnum.Danger ? 'btn-danger' :
                        'btn-warning'
            };
            this.GetL10N();
        };
        MirrorConfirmationController.prototype.GetL10N = function () {
            var model = this.$scope.Model;
            this.translationService.GetTranslations().then(function (l10NData) {
                model.L10N = l10NData.Forecasting;
                if (!model.Confirmation.CancelText) {
                    model.Confirmation.CancelText = model.L10N.Cancel;
                }
            });
        };
        return MirrorConfirmationController;
    }());
    Forecasting.MirrorConfirmationController = MirrorConfirmationController;
    Forecasting.mirrorConfirmationController = Core.NG.ForecastingModule.RegisterNamedController("MirrorConfirmationController", MirrorConfirmationController, Core.NG.$typedScope(), Core.NG.$modalInstance, Core.$translation, Core.NG.$typedCustomResolve("confirmation"), Core.NG.$typedCustomResolve("Interval"));
})(Forecasting || (Forecasting = {}));
