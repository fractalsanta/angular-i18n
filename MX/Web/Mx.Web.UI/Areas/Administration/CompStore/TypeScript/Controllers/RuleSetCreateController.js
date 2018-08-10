var Administration;
(function (Administration) {
    (function (CompStore) {
        var RuleSetCreateController = (function () {
            function RuleSetCreateController($scope, compStoreService, $log, $location, popupMessageService) {
                var _this = this;
                this.compStoreService = compStoreService;
                this.$log = $log;
                this.$location = $location;
                this.popupMessageService = popupMessageService;
                $scope.Zones = null;
                $scope.ZoneSelected = null;
                $scope.SubmitButtonClickedSuccess = false;
                $scope.FiscalPeriods = this.compStoreService.GetFiscalPeriods();
                $scope.FiscalPeriodsEvaluateFrom = this.compStoreService.GetFiscalPeriods();

                this.compStoreService.GetZones().then(function (result) {
                    $scope.Zones = result.data;
                });

                $scope.FiscalYearEvaluateFromChanged = function () {
                    if ($scope.FiscalYearEvaluateFromIdx != null) {
                        $scope.RuleSet.FiscalYearEvaluateFrom = $scope.FiscalPeriods[$scope.FiscalYearEvaluateFromIdx].FiscalYear;
                        $scope.RuleSet.EvaluateFromDate = $scope.FiscalPeriods[$scope.FiscalYearEvaluateFromIdx].Months[0].PeriodBegin;
                    } else {
                        $scope.RuleSet.FiscalYearEvaluateFrom = null;
                        $scope.RuleSet.EvaluateFromDate = null;
                    }
                };

                $scope.FiscalYearEffectiveFromChanged = function () {
                    if ($scope.FiscalYearEffectiveFromIdx != null) {
                        $scope.RuleSet.FiscalYearEffectiveFrom = $scope.FiscalPeriods[$scope.FiscalYearEffectiveFromIdx].FiscalYear;
                        $scope.RuleSet.EffectiveFromDate = $scope.FiscalPeriods[$scope.FiscalYearEffectiveFromIdx].Months[0].PeriodBegin;
                    } else {
                        $scope.RuleSet.FiscalYearEffectiveFrom = null;
                        $scope.RuleSet.EffectiveFromDate = null;
                    }
                };

                $scope.Submit = function (ruleSet, zoneSelected) {
                    var validationResult = _this.compStoreService.ValidateRuleSet(ruleSet);

                    if (validationResult.Result) {
                        _this.compStoreService.SaveRuleSet(ruleSet).success(function (result) {
                            popupMessageService.ShowSuccess("Rule Set has been successfully saved.");
                        }).error(function (error) {
                            popupMessageService.ShowError("Error has occured while saving new rule set.");
                        });
                    } else {
                        popupMessageService.ShowSuccess(validationResult.Message);
                    }
                };
            }
            return RuleSetCreateController;
        })();
        CompStore.RuleSetCreateController = RuleSetCreateController;

        Core.NG.AdministrationCompStore.RegisterRouteController("RuleSetCreate", "Templates/RuleSetNew.html", RuleSetCreateController, Core.NG.$typedScope(), CompStore.$comparableStoreService, Core.NG.$log, Core.NG.$location, Core.$popupMessageService);
    })(Administration.CompStore || (Administration.CompStore = {}));
    var CompStore = Administration.CompStore;
})(Administration || (Administration = {}));
//# sourceMappingURL=RuleSetCreateController.js.map
