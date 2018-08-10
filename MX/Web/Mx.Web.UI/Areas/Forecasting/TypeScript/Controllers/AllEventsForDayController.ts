module Forecasting {

    interface IAllEventsForDayScope extends ng.IScope {
        Translations: Api.Models.ITranslations;
        Title: string;
        EditType: string;
        EventData: Forecasting.IDayEventData[];

        Close(): void;
    }

    class AllEventsForDayController {

        constructor(
            $scope: IAllEventsForDayScope,
            $translation: Core.ITranslationService,
            $modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private constants: Core.IConstants,
            eventData: Forecasting.IDayEventData[],
            date: Moment) {

            $translation.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {

                $scope.Translations = result.Forecasting;
                $scope.Title = $scope.Translations.AllScheduledEventsFor + date.format(constants.DateCompactFormat);

            });

            $scope.EventData = eventData;

            $scope.Close = () => {
                $modalInstance.close();
            };
        }
    }

    Core.NG.ForecastingModule.RegisterNamedController("AllEventsForDayController", AllEventsForDayController,
        Core.NG.$typedScope<IAllEventsForDayScope>(),
        Core.$translation,
        Core.NG.$modalInstance,
        Core.Constants,
        Core.NG.$typedCustomResolve<Forecasting.IDayEventData[]>("eventData"),
        Core.NG.$typedCustomResolve<Moment>("date"));
}