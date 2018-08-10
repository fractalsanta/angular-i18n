module Inventory.Order {
    "use strict";

    export class BaseApplyDateController {
        private _user: Core.Auth.IUser;
        private _lastCheckedDate: string;
        private _storeTimeTracker: Core.LocalTimeTracker;

        constructor(
            public $scope: IBaseApplyDateControllerScope,
            public instance: ng.ui.bootstrap.IModalServiceInstance,
            public translationService: Core.ITranslationService,
            public periodCloseService: Workforce.PeriodClose.Api.IPeriodCloseService,
            public authService: Core.Auth.IAuthService,
            public receiveOrderService: IReceiveOrderService,
            public constants: Core.IConstants
            ) {

            this._user = authService.GetUser();

            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations) => {
                $scope.Translations = result.InventoryOrder;
            });

            $scope.Model = {
                ApplyDate: null,
                MaxDate: null,
                ShowApplyDate: false,
                PeriodClosed: false,
                PeriodCheckInProgress: false
            };

            receiveOrderService.GetLocalStoreDateTimeString().then((result) => {
                this._storeTimeTracker = new Core.LocalTimeTracker(moment(result.data));
                $scope.Model.ApplyDate = this._storeTimeTracker.Get().toDate();
                $scope.Model.MaxDate = $scope.Model.ApplyDate;
            });

            $scope.IsApplyDateValid = (value: Date): boolean => {
                if (!value) {
                    return false;
                }

                var m = moment(value);
                if (!m.isValid()) {
                     return false;
                }

                var now = this.GetCurrentDateTime();
                return !m.isAfter(now);
            };

            $scope.OpenApplyDate = ($event: Event): void => {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.Model.ShowApplyDate = !$scope.Model.ShowApplyDate;
            };

            $scope.Cancel = (): void => {
                instance.dismiss();
            };

            $scope.Confirm = (): void => {
                instance.close($scope.Model.ApplyDate);
            };

            $scope.$watch("Model.ApplyDate", () => {
                this.UpdatePeriodCloseStatus();
            });
        }

        GetCurrentDateTime(): Moment {
            return this._storeTimeTracker.Get();
        }

        UpdatePeriodCloseStatus(): void {
            var m = moment(this.$scope.Model.ApplyDate);
            if (!m.isValid()) {
                return;
            }

            var formattedDate = m.format(this.constants.InternalDateFormat);
            if (this._lastCheckedDate !== formattedDate) {
                this._lastCheckedDate = formattedDate;
                // reset value before checking to avoid potential race condition when Confirm is clicked before the check completes
                this.$scope.Model.PeriodCheckInProgress = true; 
                this.periodCloseService.GetPeriodLockStatus(this._user.BusinessUser.MobileSettings.EntityId, formattedDate)
                    .success((result) => {
                        this.$scope.Model.PeriodClosed = (result.IsClosed && !this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Orders_CanEditClosedPeriods));
                        this.$scope.Model.PeriodCheckInProgress = false; 
                    });
            }
        }
    }
}