var Inventory;
(function (Inventory) {
    var Production;
    (function (Production) {
        "use strict";
        var PrepAdjustConfirmController = (function () {
            function PrepAdjustConfirmController($scope, modalInstance, translationService, items) {
                this.$scope = $scope;
                this.modalInstance = modalInstance;
                this.translationService = translationService;
                this.items = items;
                translationService.GetTranslations().then(function (result) {
                    $scope.Translation = result.InventoryProduction;
                });
                $scope.Model = {
                    ShowApplyDate: false,
                    MaxDate: moment().toDate(),
                    ApplyDate: new Date(),
                    DateOptions: {
                        'year-format': "'yy'",
                        'starting-day': 1,
                        showWeeks: false
                    },
                    ItemsCount: items.length
                };
                $scope.Cancel = function () { return modalInstance.dismiss(); };
                $scope.Submit = function () {
                    modalInstance.close($scope.Model.ApplyDate);
                };
                $scope.ValidateDate = function (value) {
                    if (!value) {
                        return false;
                    }
                    var m = moment(value);
                    if (!m.isValid()) {
                        return false;
                    }
                    return !m.isAfter(moment());
                };
                $scope.Model.ShowApplyDate = false;
                $scope.OpenApplyDate = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.Model.ShowApplyDate = !$scope.Model.ShowApplyDate;
                };
            }
            return PrepAdjustConfirmController;
        }());
        Core.NG.InventoryProductionModule.RegisterNamedController("PrepAdjustConfirmController", PrepAdjustConfirmController, Core.NG.$typedScope(), Core.NG.$modalInstance, Core.$translation, Core.NG.$typedCustomResolve("items"));
    })(Production = Inventory.Production || (Inventory.Production = {}));
})(Inventory || (Inventory = {}));
