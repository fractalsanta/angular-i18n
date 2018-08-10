var Administration;
(function (Administration) {
    (function (CompStore) {
        var ComparableStoreService = (function () {
            function ComparableStoreService(entityZoneService, entityService, compStoreApiService, ruleSetApiService, ruleApiService, authService, $log) {
                var _this = this;
                this.entityZoneService = entityZoneService;
                this.entityService = entityService;
                this.compStoreApiService = compStoreApiService;
                this.ruleSetApiService = ruleSetApiService;
                this.ruleApiService = ruleApiService;
                this.authService = authService;
                this.$log = $log;
                this.lookups = {
                    RuleLevels: [],
                    RuleTypes: [],
                    RuleValueTypes: [],
                    RuleResultTypes: [],
                    RuleProperties: [],
                    FiscalPeriods: []
                };

                this.compStoreApiService.GetLookups().then(function (result) {
                    _.assign(_this.lookups.RuleLevels, result.data.RuleLevels);
                    _.assign(_this.lookups.RuleTypes, result.data.RuleTypes);
                    _.assign(_this.lookups.RuleValueTypes, result.data.RuleValueTypes);
                    _.assign(_this.lookups.RuleResultTypes, result.data.RuleResultTypes);
                    _.assign(_this.lookups.RuleProperties, result.data.RuleProperties);
                    _.assign(_this.lookups.FiscalPeriods, result.data.FiscalPeriods);
                });
            }
            ComparableStoreService.prototype.GetLookups = function () {
                return this.compStoreApiService.GetLookups();
            };

            ComparableStoreService.prototype.GetZones = function () {
                return this.entityZoneService.GetZones();
            };

            ComparableStoreService.prototype.GetRuleSet = function (ruleSetId) {
                return this.ruleSetApiService.GetRuleSet(ruleSetId);
            };

            ComparableStoreService.prototype.GetRuleSets = function () {
                return this.ruleSetApiService.GetRuleSets();
            };

            ComparableStoreService.prototype.GetRules = function (ruleSetId) {
                return this.ruleApiService.GetRules(ruleSetId);
            };

            ComparableStoreService.prototype.GetRule = function (ruleId) {
                return this.ruleApiService.GetRule(ruleId);
            };
            ComparableStoreService.prototype.GetRuleLevels = function () {
                return this.lookups.RuleLevels;
            };
            ComparableStoreService.prototype.GetRuleProperties = function () {
                return this.lookups.RuleProperties;
            };
            ComparableStoreService.prototype.GetFiscalPeriods = function () {
                return this.lookups.FiscalPeriods;
            };

            ComparableStoreService.prototype.SaveRuleSet = function (ruleSet) {
                return this.ruleSetApiService.PostRuleSet(ruleSet);
            };

            ComparableStoreService.prototype.UpdateRuleSet = function (ruleSet) {
                return this.ruleSetApiService.PutRuleSet(ruleSet);
            };

            ComparableStoreService.prototype.SaveRule = function (rule) {
                return this.ruleApiService.PostRule(rule);
            };

            ComparableStoreService.prototype.DeleteRuleSet = function (ruleSet) {
                return this.ruleSetApiService.DeleteRuleSet(ruleSet.RuleSetId);
            };
            ComparableStoreService.prototype.DeleteRule = function (rule) {
                return this.ruleApiService.DeleteRule(rule.RuleId);
            };
            ComparableStoreService.prototype.ValidateRuleSet = function (ruleSet) {
                var validationResult = {};

                validationResult.Result = true;
                if (ruleSet != undefined) {
                    if (ruleSet.EvaluateFromDate != undefined && ruleSet.EffectiveFromDate != undefined && ruleSet.EvaluateFromDate !== "" && ruleSet.EffectiveFromDate !== "") {
                        var effectivedate = moment(ruleSet.EffectiveFromDate).toDate();
                        var evaluatedate = moment(ruleSet.EvaluateFromDate).toDate();

                        if (effectivedate < evaluatedate) {
                            validationResult.Message = "Effective from date must be greater than Effective from date";
                            validationResult.Result = false;
                        }
                    }

                    if (ruleSet.EffectiveFromDate != undefined && ruleSet.EffectiveFromDate !== "") {
                        var now = moment().toDate();
                        var effective = moment(ruleSet.EffectiveFromDate).toDate();

                        if (effective <= now) {
                            validationResult.Message = "Effective from date must be greater than today";
                            validationResult.Result = false;
                        }
                    }
                } else {
                    validationResult.Result = false;
                }

                return validationResult;
            };
            return ComparableStoreService;
        })();

        CompStore.$comparableStoreService = Core.NG.AdministrationCompStore.RegisterService("ComparableStore", ComparableStoreService, Core.Api.$entityZoneService, Core.Api.$entityService, CompStore.Api.$compStoreService, CompStore.Api.$ruleSetService, CompStore.Api.$ruleService, Core.Auth.$authService, Core.NG.$log);
    })(Administration.CompStore || (Administration.CompStore = {}));
    var CompStore = Administration.CompStore;
})(Administration || (Administration = {}));
//# sourceMappingURL=CompStoreService.js.map
