module Workforce.MyDetails {
    "use strict";

    interface IMyDetailsController extends ng.IScope {
        User: Api.Models.IUserContact;
        OrigUser: Api.Models.IUserContact;
        Translations: Api.Models.IL10N;

        IsSameAddress(): boolean;
        MarkPageAsDirty(): void;
        MarkPageAsClean(): void;

        InViewMode: boolean;
        IsDirty: boolean;

        CanEdit: boolean;

        Edit(): void;
        Save(): void;
        Cancel(): ng.IPromise<void>;
    }

    class MyDetailsController {
        constructor(
            $scope: IMyDetailsController,
            translationService: Core.ITranslationService,
            popupMessageService: Core.IPopupMessageService,
            myDetailsService: Api.IMyDetailsService,
            private $modal: ng.ui.bootstrap.IModalService,
            $location: ng.ILocationService,
            authService: Core.Auth.IAuthService,
            confirmation: Core.IConfirmationService
            ) {

            $scope.InViewMode = true;
            $scope.IsDirty = false;

            $scope.CanEdit = authService.CheckPermissionAllowance(Core.Api.Models.Task.Labor_EmployeePortal_MyDetails_CanUpdate);

            myDetailsService.GetUserById().success((result: Api.Models.IUserContact): void => {
                $scope.User = result;
                $scope.OrigUser = _.clone(result);
            });

            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                $scope.Translations = result.WorkforceMyDetails;
                popupMessageService.SetPageTitle($scope.Translations.MyDetails);
            });

            $scope.IsSameAddress = (): boolean => {
                var isSame = false;

                if ($scope.User && $scope.User.Address1 && $scope.User.Address1 === $scope.User.MailAddress1) {
                    isSame = true;
                }

                return isSame;
            };

            $scope.Edit = (): void => {
                $scope.InViewMode = false;
            };

            $scope.Save = (): void => {
                myDetailsService.PutUserContact($scope.User)
                    .success((): void => {
                        popupMessageService.ShowSuccess($scope.Translations.UpdateSuccess);
                        $scope.InViewMode = true;
                        $scope.MarkPageAsClean();

                        $scope.OrigUser = _.clone($scope.User);
                    });
            };

            $scope.Cancel = (): ng.IPromise<void> => {
                var result;
                if ($scope.IsDirty) {

                    result = confirmation.Confirm({
                        Title: $scope.Translations.CancelChanges,
                        Message: $scope.Translations.ExitMyDetailsConfirmationMessage,
                        ConfirmationType: Core.ConfirmationTypeEnum.Positive,
                        ConfirmText: $scope.Translations.Confirm
                    }).then((): void => {
                        $scope.User = _.clone($scope.OrigUser);
                        $scope.InViewMode = true;
                        $scope.MarkPageAsClean();
                    });

                } else {
                    $scope.InViewMode = true;
                    $scope.MarkPageAsClean();
                }

                return result;
            };

            $scope.MarkPageAsDirty = (): void => {
                $scope.IsDirty = true;
            };

            $scope.MarkPageAsClean = (): void => {
                $scope.IsDirty = false;
            };

            $scope.$on("$locationChangeStart", (e: ng.IAngularEvent, newUrl: string): void => {
                var targetPath = newUrl.split("#");

                if ($scope.IsDirty && targetPath.length > 1) {
                    $scope.Cancel().then((): void => {
                        $location.path(targetPath[1]);
                    });

                    e.preventDefault();
                }
            });
        }
    }
    Core.NG.WorkforceMyDetailsModule.RegisterRouteController("", "Templates/MyDetails.html", MyDetailsController,
        Core.NG.$typedScope<IMyDetailsController>(),
        Core.$translation,
        Core.$popupMessageService,
        Api.$myDetailsService,
        Core.NG.$modal,
        Core.NG.$location,
        Core.Auth.$authService,
        Core.$confirmationService
        );

}