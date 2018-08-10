var Forecasting;
(function (Forecasting) {
    var AllEventsForDayController = (function () {
        function AllEventsForDayController($scope, $translation, $modalInstance, constants, eventData, date) {
            this.constants = constants;
            $translation.GetTranslations().then(function (result) {
                $scope.Translations = result.Forecasting;
                $scope.Title = $scope.Translations.AllScheduledEventsFor + date.format(constants.DateCompactFormat);
            });
            $scope.EventData = eventData;
            $scope.Close = function () {
                $modalInstance.close();
            };
        }
        return AllEventsForDayController;
    }());
    Core.NG.ForecastingModule.RegisterNamedController("AllEventsForDayController", AllEventsForDayController, Core.NG.$typedScope(), Core.$translation, Core.NG.$modalInstance, Core.Constants, Core.NG.$typedCustomResolve("eventData"), Core.NG.$typedCustomResolve("date"));
})(Forecasting || (Forecasting = {}));
