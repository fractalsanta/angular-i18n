module Inventory.Count {

    interface IUpdateCostControllerScope extends ng.IScope {
        DialogResult: boolean;
        Continue(): void;
        Cancel(): void;
        Title: string;
        NoCostItems: Inventory.Count.Api.Models.ICountItem[];
        HasNoCostItems: boolean;
        User: Core.Auth.IUser;
        UpdateCost():ng.IHttpPromise<{}>;
        ItemCostChanged(): void;
        UndoCostChanges(): void;

        Translation: Api.Models.IL10N;
        CheckUpdateCostPermission();

        NumericalInputBoxPattern(): RegExp
    }

    class UpdateCostController {

        private _numericInputPattern: RegExp;

        constructor(
            private $scope: IUpdateCostControllerScope,
            private $authService: Core.Auth.IAuthService,
            private $modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private updateCostCheckService: IUpdateNoCostItemService,
            private translationService: Core.ITranslationService,
            private popupMessageService: Core.IPopupMessageService,
            private constants: Core.IConstants,
            private IsJustReturnUpdated: boolean
            ) {

            this._numericInputPattern = new RegExp(constants.NumericalInputBoxPattern);

            translationService.GetTranslations().then((result) => {
                $scope.Translation = result.InventoryCount;

                if (!$scope.CheckUpdateCostPermission()) {
                    popupMessageService.ShowError($scope.Translation.CountUpdateCostPermission);
                }
            });

            var user = $authService.GetUser();
            $scope.HasNoCostItems = true;

            $modalInstance.result.then(null , (reason)=> {
                if (reason === "backdrop click") {
                    $scope.UndoCostChanges();
                }
            });

            $scope.NumericalInputBoxPattern = () => { return this._numericInputPattern; };

            $scope.ItemCostChanged = () => {
                $scope.HasNoCostItems = _.some($scope.NoCostItems, (item=> {
                    if (item.ItemCost == 0 || item.ItemCost == null) {
                        return true;
                    } else {
                        return false;
                    }
                }));
            };

            $scope.UpdateCost = () => {
                var promise = <ng.IHttpPromise<{}>> {};
                if (!$scope.HasNoCostItems) {
                    var updatecostRequest = this.GetUpdateCostRequest(this.$scope.NoCostItems);
                    promise = this.updateCostCheckService.UpdateNoCostItems(updatecostRequest);
                }
                return promise;
            };

            if (updateCostCheckService.HasNoCostItems()) {
                $scope.NoCostItems = updateCostCheckService.GetNoCostValues();
            }

            $scope.Continue = () => {
                if (!this.IsJustReturnUpdated) {
                    $scope.UpdateCost().then(() => {
                        $scope.DialogResult = true;
                        $modalInstance.close($scope.DialogResult);
                    });
                } else {
                    $modalInstance.close(this.GetUpdateCostRequest(this.$scope.NoCostItems));
                }
            };

            $scope.Cancel = () => {
                $scope.UndoCostChanges();
                $scope.DialogResult = false;
                $modalInstance.dismiss("Cancel");
            };

            $scope.UndoCostChanges = ()=> {
                _.forEach($scope.NoCostItems, item=> {
                    item.ItemCost = null;
                });
            };

            $scope.CheckUpdateCostPermission = () => {
                return $authService.CheckPermissionAllowance(Core.Api.Models.Task.Inventory_InventoryCount_CanUpdate_Cost);
            };
        }

        GetUpdateCostRequest(noCostItems: Inventory.Count.Api.Models.ICountItem[]): Count.Api.Models.IUpdateCostViewModel[] {
            var updatecostRequest: Count.Api.Models.IUpdateCostViewModel[] = new Array<Count.Api.Models.IUpdateCostViewModel>();
            _.forEach(noCostItems, item=> {
                var updatecostModel = <Count.Api.Models.IUpdateCostViewModel> {};
                updatecostModel.ItemId = item.ItemId;
                updatecostModel.InventoryUnitCost = item.ItemCost;
                updatecostModel.ReportingUnit = item.OuterUnit || item.InventoryUnit;
                updatecostModel.InventoryUnit = item.InventoryUnit;
                updatecostRequest.push(updatecostModel);
            });
            
            return updatecostRequest;
        }
    }

    Core.NG.InventoryCountModule.RegisterNamedController("UpdateCostInventory", UpdateCostController,
            Core.NG.$typedScope<IUpdateCostControllerScope>(),
            Core.Auth.$authService,
            Core.NG.$modalInstance, 
            $countService,
            Core.$translation,
            Core.$popupMessageService,
            Core.Constants,
            Core.NG.$typedCustomResolve<boolean>("IsJustReturnUpdated")
            );

    Core.NG.InventoryCountModule.RegisterNamedController("UpdateCostTransfers", UpdateCostController,
            Core.NG.$typedScope<IUpdateCostControllerScope>(),
            Core.Auth.$authService,
            Core.NG.$modalInstance,
            Inventory.Transfer.transfersService,
            Core.$translation,
            Core.$popupMessageService,
            Core.Constants,
            Core.NG.$typedCustomResolve<boolean>("IsJustReturnUpdated")
        );
}