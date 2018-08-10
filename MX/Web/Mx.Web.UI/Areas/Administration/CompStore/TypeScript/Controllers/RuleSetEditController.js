var Administration;
(function (Administration) {
    (function (CompStore) {
        var RuleSetEditController = (function () {
            function RuleSetEditController($scope, compStoreService, $log, popupMessageService, $routeParams, $q, $sce) {
                var _this = this;
                this.compStoreService = compStoreService;
                this.$log = $log;
                this.popupMessageService = popupMessageService;
                this.$routeParams = $routeParams;
                this.$q = $q;
                this.$sce = $sce;
                this.compStoreService.GetZones().then(function (result) {
                    $scope.Zones = result.data;
                });

                this.compStoreService.GetLookups().then(function () {
                    $scope.FiscalPeriods = _this.compStoreService.GetFiscalPeriods();
                    $scope.FiscalPeriodsEvaluateFrom = _this.compStoreService.GetFiscalPeriods();

                    _this.compStoreService.GetRuleSet($routeParams.RuleSetId).then(function (result) {
                        $scope.RuleSet = result.data;

                        if ($scope.RuleSet.ZoneId > 0) {
                            $scope.ZoneSelected = { ZoneId: $scope.RuleSet.ZoneId, ZoneName: "" };
                        }

                        if ($scope.RuleSet.FiscalYearEffectiveFrom != null) {
                            $scope.FiscalYearEffectiveFromIdx = _.find($scope.FiscalPeriods, { 'FiscalYear': $scope.RuleSet.FiscalYearEffectiveFrom }).Index;
                        }

                        if ($scope.RuleSet.FiscalYearEvaluateFrom != null) {
                            $scope.FiscalYearEvaluateFromIdx = _.find($scope.FiscalPeriodsEvaluateFrom, { 'FiscalYear': $scope.RuleSet.FiscalYearEvaluateFrom }).Index;
                        }

                        $log.log($scope.FiscalYearEffectiveFromIdx);
                        $log.log($scope.FiscalYearEvaluateFromIdx);

                        $log.log($scope.RuleSet.EffectiveFromDate);
                        $log.log($scope.RuleSet.FiscalYearEffectiveFrom);
                    });
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
                    if (_this.compStoreService.ValidateRuleSet(ruleSet)) {
                        _this.compStoreService.UpdateRuleSet(ruleSet).success(function (result) {
                            popupMessageService.ShowSuccess("Rule Set has been successfully saved.");
                        }).error(function (error) {
                            popupMessageService.ShowSuccess("Error has occured while saving new rule set.");
                        });
                    }
                };
            }
            return RuleSetEditController;
        })();

        Core.NG.AdministrationCompStore.RegisterRouteController("RuleSetEdit/:RuleSetId", "Templates/RuleSetEdit.html", RuleSetEditController, Core.NG.$typedScope(), CompStore.$comparableStoreService, Core.NG.$log, Core.$popupMessageService, Core.NG.$typedStateParams(), Core.NG.$q, Core.NG.$sce);
    })(Administration.CompStore || (Administration.CompStore = {}));
    var CompStore = Administration.CompStore;
})(Administration || (Administration = {}));
//# sourceMappingURL=RuleSetEditController.js.map
