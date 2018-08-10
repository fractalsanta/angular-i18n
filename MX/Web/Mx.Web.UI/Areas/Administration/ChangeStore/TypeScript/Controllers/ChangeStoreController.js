var Administration;
(function (Administration) {
    var ChangeStore;
    (function (ChangeStore) {
        "use strict";
        var ChangeStoreController = (function () {
            function ChangeStoreController($scope, entityService, authService, popupMessageService, mobileSettingsService, $rootScope, location, translationService, constants) {
                var _this = this;
                this.$scope = $scope;
                this.entityService = entityService;
                this.authService = authService;
                this.popupMessageService = popupMessageService;
                this.mobileSettingsService = mobileSettingsService;
                this.$rootScope = $rootScope;
                this.location = location;
                this.translationService = translationService;
                this.constants = constants;
                entityService.GetOpenEntities(authService.GetUser().BusinessUser.Id).success(function (result) {
                    $scope.Stores = result;
                });
                translationService.GetTranslations().then(function (result) {
                    $scope.Translations = result.ChangeStore;
                    popupMessageService.SetPageTitle(result.ChangeStore.ChangeStore);
                });
                $scope.ChangeStore = function (store) {
                    if (store != null) {
                        var currentUser = authService.GetUser(), previousEntityId = currentUser.BusinessUser.MobileSettings.EntityId;
                        currentUser.BusinessUser.MobileSettings.EntityId = store.Id;
                        currentUser.BusinessUser.MobileSettings.EntityName = store.Name;
                        currentUser.BusinessUser.MobileSettings.EntityNumber = store.Number;
                        entityService.GetStartOfWeek(store.Id, moment().format(_this.constants.InternalDateFormat)).success(function (result) {
                            Core.NG.Configs.DatepickerConfig.startingDay = result;
                        });
                        _this.mobileSettingsService.Post(currentUser.BusinessUser.MobileSettings).success(function () {
                            popupMessageService.ShowSuccess($scope.Translations.StoreSelected + store.Name);
                            if (previousEntityId !== store.Id) {
                                var eventArg = {
                                    previousEntityId: previousEntityId,
                                    currentEntityId: store.Id
                                };
                                $rootScope.$broadcast(Core.ApplicationEvent.ChangeStore, eventArg);
                                location.path("/");
                            }
                        });
                    }
                    else {
                        popupMessageService.ShowError($scope.Translations.UnexpectedError);
                    }
                };
            }
            return ChangeStoreController;
        }());
        Core.NG.AdministrationChangeStoreModule.RegisterRouteController("", "Templates/ChangeStore.html", ChangeStoreController, Core.NG.$typedScope(), Core.Api.$entityService, Core.Auth.$authService, Core.$popupMessageService, Core.Api.$mobileSettingsService, Core.NG.$rootScope, Core.NG.$location, Core.$translation, Core.Constants);
    })(ChangeStore = Administration.ChangeStore || (Administration.ChangeStore = {}));
})(Administration || (Administration = {}));
