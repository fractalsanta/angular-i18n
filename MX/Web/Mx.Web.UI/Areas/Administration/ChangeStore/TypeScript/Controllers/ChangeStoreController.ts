module Administration.ChangeStore {
    "use strict";

    interface IEntityControllerScope extends ng.IScope {
        ChangeStore: (entity: Core.Api.Models.IEntityModel) => void;
        Stores: Core.Api.Models.IEntityModel[];
        Translations: ChangeStore.Api.Models.IL10N;
    }

    class ChangeStoreController {
        constructor(
            private $scope: IEntityControllerScope,
            private entityService: Core.Api.IEntityService,
            private authService: Core.Auth.IAuthService,
            private popupMessageService: Core.IPopupMessageService,
            private mobileSettingsService: Core.Api.IMobileSettingsService,
            private $rootScope: ng.IRootScopeService,
            private location: ng.ILocationService,
            private translationService: Core.ITranslationService,
            private constants: Core.IConstants
            ) {

            entityService.GetOpenEntities(authService.GetUser().BusinessUser.Id).success((result: Core.Api.Models.IEntityModel[]): void => {
                $scope.Stores = result;
            });

            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                $scope.Translations = result.ChangeStore;
                popupMessageService.SetPageTitle(result.ChangeStore.ChangeStore);
            });

            $scope.ChangeStore = (store: Core.Api.Models.IEntityModel): void => {
                if (store != null) {
                    var currentUser = authService.GetUser(),
                        previousEntityId = currentUser.BusinessUser.MobileSettings.EntityId;

                    currentUser.BusinessUser.MobileSettings.EntityId = store.Id;
                    currentUser.BusinessUser.MobileSettings.EntityName = store.Name;
                    currentUser.BusinessUser.MobileSettings.EntityNumber = store.Number;

                    entityService.GetStartOfWeek(store.Id, moment().format(this.constants.InternalDateFormat)).success((result: number): void => {
                        Core.NG.Configs.DatepickerConfig.startingDay = result;
                    });

                    this.mobileSettingsService.Post(currentUser.BusinessUser.MobileSettings).success((): void => {
                        popupMessageService.ShowSuccess($scope.Translations.StoreSelected + store.Name);
                        if (previousEntityId !== store.Id) {
                            var eventArg = <Core.IChangeStoreEventArg>{
                                previousEntityId: previousEntityId,
                                currentEntityId: store.Id
                            };

                            $rootScope.$broadcast(Core.ApplicationEvent.ChangeStore, eventArg);
                            location.path("/");
                        }
                    });
                } else {
                    popupMessageService.ShowError($scope.Translations.UnexpectedError);
                }
            };
        }
    }

    Core.NG.AdministrationChangeStoreModule.RegisterRouteController("", "Templates/ChangeStore.html", ChangeStoreController,
        Core.NG.$typedScope<IEntityControllerScope>(),
        Core.Api.$entityService,
        Core.Auth.$authService,
        Core.$popupMessageService,
        Core.Api.$mobileSettingsService,
        Core.NG.$rootScope,
        Core.NG.$location,
        Core.$translation,
        Core.Constants
        );
}  