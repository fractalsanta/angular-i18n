var Administration;
(function (Administration) {
    (function (CompStore) {
        var RuleCreateController = (function () {
            function RuleCreateController($scope, compStoreService, $log, popupMessageService, $sce, $routeParams) {
                var _this = this;
                this.compStoreService = compStoreService;
                this.$log = $log;
                this.popupMessageService = popupMessageService;
                this.$sce = $sce;
                this.$routeParams = $routeParams;
                $scope.Rule = {};
                $scope.RuleLevelIdx = 0;
                $scope.RuleTypeIdx = 0;
                $scope.RuleValueIdx = 0;
                $scope.RuleResultIdx = 0;
                $scope.RuleSelected = null;
                $scope.SubmitButtonClickedSuccess = false;

                this.compStoreService.GetRules($routeParams.RuleSetId).then(function (result) {
                    $scope.ExistingRules = result.data;
                });

                $scope.RuleProperties = this.compStoreService.GetRuleProperties();
                $scope.RuleTypes = null;

                $scope.RuleLevelChanged = function () {
                    $scope.RuleTypeIdx = 0;
                    $scope.RuleValueIdx = 0;
                    $scope.RuleResultIdx = 0;

                    $scope.RuleTypes = $scope.RuleProperties[$scope.RuleLevelIdx].RuleTypes;
                };

                $scope.RuleTypeChanged = function () {
                    $scope.RuleValueIdx = 0;
                    $scope.RuleResultIdx = 0;
                };

                $scope.RuleClicked = function (rule) {
                    $scope.RuleSelected = rule;
                };

                $scope.GetSafeHtmlStr = function (rulename) {
                    return $sce.trustAsHtml(rulename);
                };

                $scope.Submit = function (rule) {
                    rule.RuleId = 0;
                    rule.RuleSetId = $routeParams.RuleSetId;
                    rule.RuleLevelName = $scope.RuleProperties[$scope.RuleLevelIdx].Name;
                    rule.RuleLevel = $scope.RuleProperties[$scope.RuleLevelIdx].Id;

                    rule.RuleType = $scope.RuleProperties[$scope.RuleLevelIdx].RuleTypes[$scope.RuleTypeIdx].Id;
                    rule.RuleTypeName = $scope.RuleProperties[$scope.RuleLevelIdx].RuleTypes[$scope.RuleTypeIdx].Name;

                    rule.RuleValueType = $scope.RuleProperties[$scope.RuleLevelIdx].RuleTypes[$scope.RuleTypeIdx].RuleValueTypes[$scope.RuleValueIdx].Id;
                    rule.RuleValueTypeName = $scope.RuleProperties[$scope.RuleLevelIdx].RuleTypes[$scope.RuleTypeIdx].RuleValueTypes[$scope.RuleValueIdx].Name;

                    rule.RuleResultTypePositive = $scope.RuleProperties[$scope.RuleLevelIdx].RuleResultTypes[$scope.RuleResultIdx].Id;
                    rule.RuleResultTypePositiveName = $scope.RuleProperties[$scope.RuleLevelIdx].RuleResultTypes[$scope.RuleResultIdx].Name;

                    _this.compStoreService.SaveRule(rule).success(function (result) {
                        $scope.SubmitButtonClickedSuccess = true;
                        popupMessageService.ShowSuccess("Rule has been successfully saved.");

                        _this.compStoreService.GetRules($routeParams.RuleSetId).then(function (resultData) {
                            $scope.ExistingRules = resultData.data;
                        });
                    }).error(function (error) {
                        popupMessageService.ShowSuccess("Error has occured while saving new rule.");
                    });
                };

                $scope.Validate = function () {
                    if ($scope.RuleLevelIdx > 0 && $scope.RuleResultIdx > 0 && $scope.RuleTypeIdx > 0 && $scope.RuleValueIdx > 0)
                        return true;
                    return false;
                };
            }
            return RuleCreateController;
        })();

        Core.NG.AdministrationCompStore.RegisterRouteController("RuleCreate/:RuleSetId", "Templates/RuleNew.html", RuleCreateController, Core.NG.$typedScope(), CompStore.$comparableStoreService, Core.NG.$log, Core.$popupMessageService, Core.NG.$sce, Core.NG.$typedStateParams());
    })(Administration.CompStore || (Administration.CompStore = {}));
    var CompStore = Administration.CompStore;
})(Administration || (Administration = {}));
//# sourceMappingURL=RuleCreateController.js.map
