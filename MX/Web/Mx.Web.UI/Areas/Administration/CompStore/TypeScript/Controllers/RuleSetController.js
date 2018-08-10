var Administration;
(function (Administration) {
    (function (CompStore) {
        var RuleSetController = (function () {
            function RuleSetController($scope, compStoreService, $log, $authService, confirmationService, popupMessageService, $sce) {
                var _this = this;
                this.$scope = $scope;
                this.compStoreService = compStoreService;
                this.$log = $log;
                this.$authService = $authService;
                this.confirmationService = confirmationService;
                this.popupMessageService = popupMessageService;
                this.$sce = $sce;
                this.currentLocationIdx = 0;
                var user = $authService.GetUser();
                $scope.RuleLevelFilter = {};
                $scope.RuleLevelFilter.RuleLevel = -1;
                $scope.RuleSetSelected = null;
                $scope.RuleSets = [];
                $scope.RuleSetSelectedRules = null;
                $scope.RuleSelected = null;

                $scope.RuleLevels = this.compStoreService.GetRuleLevels();

                this.compStoreService.GetRuleSets().then(function (result) {
                    $scope.RuleSets = result.data;
                });

                $scope.RuleLevelFilterFunc = function (rule) {
                    var result = false;

                    if ($scope.RuleLevelFilter.RuleLevel == undefined)
                        result = true;
                    if ($scope.RuleLevelFilter.RuleLevel === -1)
                        result = true;
                    if ($scope.RuleLevelFilter.RuleLevel === "")
                        result = true;
                    if ($scope.RuleLevelFilter.RuleLevel === rule.RuleLevel)
                        result = true;
                    return result;
                };

                $scope.RuleSetClicked = function (ruleSet) {
                    $scope.RuleSetSelected = ruleSet;

                    $scope.RuleSetSelectedRules = ruleSet.Rules;
                    $scope.RuleSelected = null;
                    $scope.RuleLevelFilter.RuleLevel = -1;
                };

                $scope.GetSafeHtmlStr = function (rulename) {
                    return $sce.trustAsHtml(rulename);
                };

                $scope.RuleClicked = function (rule) {
                    $scope.RuleSelected = rule;
                };

                $scope.RuleDelete = function (rule) {
                    confirmationService.Confirm({
                        Title: "Please confirm delete action:",
                        Message: "Delete Rule: \"" + rule.RuleLevelName + ": " + rule.RuleTypeName + "\"?",
                        ConfirmText: "Delete",
                        ConfirmationType: 3 /* Danger */
                    }).then(function (result) {
                        if (result) {
                            _this.compStoreService.DeleteRule(rule).success(function () {
                                _this.popupMessageService.ShowSuccess("Rule:'" + $scope.RuleSelected.RuleLevelName + " - " + $scope.RuleSelected.RuleTypeName + "' has been successfully deleted.");
                                var indexOfDeletedRule = $scope.RuleSetSelected.Rules.indexOf($scope.RuleSelected);
                                $scope.RuleSetSelected.Rules.splice(indexOfDeletedRule, 1);
                            }).error(function () {
                                _this.popupMessageService.ShowError("Error has occurred while deleting rule.");
                            });
                        }
                    });
                };

                $scope.RuleSetDelete = function (ruleSet) {
                    confirmationService.Confirm({
                        Title: "Please confirm delete action:",
                        Message: "Delete Rule Set: \"" + $scope.RuleSetSelected.RuleSetName + "\"?",
                        ConfirmText: "Delete",
                        ConfirmationType: 3 /* Danger */
                    }).then(function (result) {
                        if (result) {
                            _this.compStoreService.DeleteRuleSet(ruleSet).success(function () {
                                _this.popupMessageService.ShowSuccess("Rule Set:'" + $scope.RuleSetSelected.RuleSetName + "' has been successfully deleted.");
                                var indexOfDeletedRuleSet = $scope.RuleSets.indexOf($scope.RuleSetSelected);
                                $scope.RuleSets.splice(indexOfDeletedRuleSet, 1);
                                $scope.RuleSelected = null;
                                $scope.RuleSetSelected = null;
                            }).error(function () {
                                _this.popupMessageService.ShowError("Error has occurred while deleting rule set.");
                            });
                            ;
                        }
                    });
                };

                $scope.RuleLevelFilterClicked = function (ruleLevelId) {
                    $log.log(ruleLevelId);
                };
            }
            return RuleSetController;
        })();

        Core.NG.AdministrationCompStore.RegisterRouteController("RuleSets", "Templates/RuleSets.html", RuleSetController, Core.NG.$typedScope(), CompStore.$comparableStoreService, Core.NG.$log, Core.Auth.$authService, Core.$confirmationService, Core.$popupMessageService, Core.NG.$sce);
    })(Administration.CompStore || (Administration.CompStore = {}));
    var CompStore = Administration.CompStore;
})(Administration || (Administration = {}));
//# sourceMappingURL=RuleSetController.js.map
