var Workforce;
(function (Workforce) {
    var MyDetails;
    (function (MyDetails) {
        "use strict";
        var MyDetailsController = (function () {
            function MyDetailsController($scope, translationService, popupMessageService, myDetailsService, $modal, $location, authService, confirmation) {
                this.$modal = $modal;
                $scope.InViewMode = true;
                $scope.IsDirty = false;
                $scope.CanEdit = authService.CheckPermissionAllowance(Core.Api.Models.Task.Labor_EmployeePortal_MyDetails_CanUpdate);
                myDetailsService.GetUserById().success(function (result) {
                    $scope.User = result;
                    $scope.OrigUser = _.clone(result);
                });
                translationService.GetTranslations().then(function (result) {
                    $scope.Translations = result.WorkforceMyDetails;
                    popupMessageService.SetPageTitle($scope.Translations.MyDetails);
                });
                $scope.IsSameAddress = function () {
                    var isSame = false;
                    if ($scope.User && $scope.User.Address1 && $scope.User.Address1 === $scope.User.MailAddress1) {
                        isSame = true;
                    }
                    return isSame;
                };
                $scope.Edit = function () {
                    $scope.InViewMode = false;
                };
                $scope.Save = function () {
                    myDetailsService.PutUserContact($scope.User)
                        .success(function () {
                        popupMessageService.ShowSuccess($scope.Translations.UpdateSuccess);
                        $scope.InViewMode = true;
                        $scope.MarkPageAsClean();
                        $scope.OrigUser = _.clone($scope.User);
                    });
                };
                $scope.Cancel = function () {
                    var result;
                    if ($scope.IsDirty) {
                        result = confirmation.Confirm({
                            Title: $scope.Translations.CancelChanges,
                            Message: $scope.Translations.ExitMyDetailsConfirmationMessage,
                            ConfirmationType: Core.ConfirmationTypeEnum.Positive,
                            ConfirmText: $scope.Translations.Confirm
                        }).then(function () {
                            $scope.User = _.clone($scope.OrigUser);
                            $scope.InViewMode = true;
                            $scope.MarkPageAsClean();
                        });
                    }
                    else {
                        $scope.InViewMode = true;
                        $scope.MarkPageAsClean();
                    }
                    return result;
                };
                $scope.MarkPageAsDirty = function () {
                    $scope.IsDirty = true;
                };
                $scope.MarkPageAsClean = function () {
                    $scope.IsDirty = false;
                };
                $scope.$on("$locationChangeStart", function (e, newUrl) {
                    var targetPath = newUrl.split("#");
                    if ($scope.IsDirty && targetPath.length > 1) {
                        $scope.Cancel().then(function () {
                            $location.path(targetPath[1]);
                        });
                        e.preventDefault();
                    }
                });
            }
            return MyDetailsController;
        }());
        Core.NG.WorkforceMyDetailsModule.RegisterRouteController("", "Templates/MyDetails.html", MyDetailsController, Core.NG.$typedScope(), Core.$translation, Core.$popupMessageService, MyDetails.Api.$myDetailsService, Core.NG.$modal, Core.NG.$location, Core.Auth.$authService, Core.$confirmationService);
    })(MyDetails = Workforce.MyDetails || (Workforce.MyDetails = {}));
})(Workforce || (Workforce = {}));
