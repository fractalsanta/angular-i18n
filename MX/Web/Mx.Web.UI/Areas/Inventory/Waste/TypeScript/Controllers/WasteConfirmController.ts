module Inventory.Waste {
    "use strict";


    interface IWasteConfirmModel {
        ApplyDate: Date;
        MaxDate: Date;
        DateOptions: {};
        ItemsCount: number;
        TotalCost: string;
        ShowApplyDate: boolean;
        PeriodClosed: boolean;
    }

    interface IWasteConfirmScope extends ng.IScope {
        Model: IWasteConfirmModel;
        Translation: Api.Models.IL10N;
        ValidateDate(value: Date): boolean;
        OpenApplyDate($event: Event): void;
        Cancel(): void;
        Submit(): void;
        Init(): void;
        UpdatePeriodClosedStatus(currentDate: Date): void;
    }

    class WasteConfirmController {
        private _user: Core.Auth.IUser;
        private _currentDate: Date;

        constructor(
            private $scope: IWasteConfirmScope,
            private modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private translationService: Core.ITranslationService,
            private items: Inventory.Waste.Api.Models.IWastedItemCount[],
            private totalCost: string,
            private $authService: Core.Auth.IAuthService,
            private $periodCloseService: Workforce.PeriodClose.Api.IPeriodCloseService,
            private constants: Core.IConstants
            )
        {
            this._user = $authService.GetUser();

            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                $scope.Translation = result.InventoryWaste;
            });

            this._currentDate = new Date();
            
            $scope.Model = {
                ShowApplyDate: false,
                MaxDate: moment().toDate(),
                ApplyDate: this._currentDate,
                DateOptions: {
                    'year-format': "'yy'",
                    'starting-day': 1,
                    showWeeks: false
                },
                ItemsCount: items.length,
                TotalCost: totalCost,
                PeriodClosed: false
            };

            $scope.Cancel = () => modalInstance.dismiss();
            $scope.Submit = () => {
                modalInstance.close($scope.Model.ApplyDate);
            };

            $scope.ValidateDate = (value: Date): boolean => {
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

            $scope.OpenApplyDate = ($event: Event): void => {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.Model.ShowApplyDate = !$scope.Model.ShowApplyDate;
            };

            $scope.Init = () => {
                
                this.$scope.UpdatePeriodClosedStatus(this._currentDate);

                this.$scope.$watch("Model.ApplyDate", () => {

                    if (this._currentDate !== $scope.Model.ApplyDate) {

                        this._currentDate = $scope.Model.ApplyDate;

                        this.$scope.UpdatePeriodClosedStatus($scope.Model.ApplyDate);
                    }
                });
            };

            $scope.UpdatePeriodClosedStatus = (currentDate: Date): void => {

                $periodCloseService.GetPeriodLockStatus(this._user.BusinessUser.MobileSettings.EntityId, moment(currentDate).format(this.constants.InternalDateFormat))
                    .success((result) => {

                        $scope.Model.PeriodClosed = (result.IsClosed && !$authService.CheckPermissionAllowance(Core.Api.Models.Task.Waste_CanEditClosedPeriods));

                    });
            };

            $scope.Init();
        }

    
    }

    

    Core.NG.InventoryWasteModule.RegisterNamedController("WasteConfirmController", WasteConfirmController,
        Core.NG.$typedScope<IWasteConfirmScope>(), 
        Core.NG.$modalInstance, 
        Core.$translation,
        Core.NG.$typedCustomResolve<any>("items"),
        Core.NG.$typedCustomResolve<any>("totalCost"),
        Core.Auth.$authService,
        Workforce.PeriodClose.Api.$periodCloseService,
        Core.Constants
    );
}
