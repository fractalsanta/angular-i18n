var Administration;
(function (Administration) {
    (function (CompStore) {
        var RuleEditController = (function () {
            function RuleEditController($scope, compStoreService, $log, popupMessageService, $sce, $routeParams) {
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

                this.compStoreService.GetLookups().then(function (result) {
                }).then(function (result) {
                    _this.compStoreService.GetRule($routeParams.RuleId).then(function (resultData) {
                        $scope.Rule = resultData.data;

                        $scope.RuleLevelIdx = _.find($scope.RuleProperties, { Id: $scope.Rule.RuleLevel }).Index;
                        $scope.RuleTypeIdx = _.find($scope.RuleProperties[$scope.RuleLevelIdx].RuleTypes, { Id: $scope.Rule.RuleType }).Index;
                        $scope.RuleValueIdx = _.find($scope.RuleProperties[$scope.RuleLevelIdx].RuleTypes[$scope.RuleTypeIdx].RuleValueTypes, { Id: $scope.Rule.RuleValueType }).Index;
                        $scope.RuleResultIdx = _.find($scope.RuleProperties[$scope.RuleLevelIdx].RuleResultTypes, { Id: $scope.Rule.RuleResultTypePositive }).Index;
                    }).then(function () {
                        _this.compStoreService.GetRules($scope.Rule.RuleSetId).then(function (resultData) {
                            $scope.ExistingRules = resultData.data;
                        });
                    });
                });

                $scope.GetSafeHtmlStr = function (rulename) {
                    return $sce.trustAsHtml(rulename);
                };

                $scope.RuleProperties = this.compStoreService.GetRuleProperties();

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

                $scope.Submit = function (rule) {
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

                        _this.compStoreService.GetRules($scope.Rule.RuleSetId).then(function (resultData) {
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
            return RuleEditController;
        })();

        Core.NG.AdministrationCompStore.RegisterRouteController("RuleEdit/:RuleId", "Templates/RuleNew.html", RuleEditController, Core.NG.$typedScope(), CompStore.$comparableStoreService, Core.NG.$log, Core.$popupMessageService, Core.NG.$sce, Core.NG.$typedStateParams());
    })(Administration.CompStore || (Administration.CompStore = {}));
    var CompStore = Administration.CompStore;
})(Administration || (Administration = {}));
//# sourceMappingURL=RuleEditController.js.map
