module Workforce.Deliveries {

    class DeliveriesController {

        private _deliveryData: Api.Models.IDeliveryData;

        constructor(
            private $scope: IDeliveriesControllerScope,
            private translationService: Core.ITranslationService,
            private popupMessageService: Core.IPopupMessageService,
            private authService: Core.Auth.IAuthService,
            private deliveriesService: IDeliveriesService,
            private $modal: ng.ui.bootstrap.IModalService
        ) {

            $scope.Vm = {
                DatePickerOptions: <Core.NG.IMxDayPickerOptions>{
                    Date: moment().toDate(),
                    DayOffset: 1,
                    MonthOffset: 0,
                    Max: moment().toDate()
                },
                SelectedDate: null,
                ShowDeliveriesGrid: this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Labor_EmployeePortal_Deliveries_CanViewOthersEntries),
                CanAuthoriseExtraDeliveries: this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Labor_EmployeePortal_ExtraDeliveries_CanAuthorise),
                DeliveriesQty: 0,
                TotalDeliveriesQty: 0,
                ExtraDeliveriesQty: 0,
                ExtraDeliveries: []
            };

            translationService.GetTranslations().then((l10NData) => {
                $scope.L10N = l10NData.WorkforceDeliveries;
                popupMessageService.SetPageTitle($scope.L10N.Deliveries);
            });

            $scope.OnDatePickerChange = (date: Date) => {
                this.GetDeliveryData(date);
            };

            $scope.GetStatusById = (id: number): { Status: string; Icon: string; } => {
                var result = { Status: "", Icon: "" };
                switch (id) {
                case Api.Models.Enums.ExtraDeliveryOrderStatus.Pending:
                    result.Status = $scope.L10N.PendingApproval;
                    result.Icon = "mx-col-info fa fa-spinner";
                    break;
                case Api.Models.Enums.ExtraDeliveryOrderStatus.Approved:
                    result.Status = $scope.L10N.Approved;
                    result.Icon = "mx-col-success fa fa-check";
                    break;
                case Api.Models.Enums.ExtraDeliveryOrderStatus.Denied:
                    result.Status = $scope.L10N.Denied;
                    result.Icon = "mx-col-warning fa fa-minus";
                    break;
                }
                return result;
            };

            $scope.AddExtraDelivery = () => this.AddNewExtraDelivery();

            $scope.AuthoriseExtraDelivery = (ed: Api.Models.IExtraDeliveryRequest): void => {
                this.$modal.open(<ng.ui.bootstrap.IModalSettings>{
                    templateUrl: "Areas/WorkForce/Deliveries/Templates/AuthorizeDeliveryDialog.html",
                    controller: "Workforce.Deliveries.AuthorizeDeliveryController",
                    resolve: {
                        extraDeliveryRequest: () => {
                            return ed;
                        }
                    }
                }).result.then(() => {
                    this.GetDeliveryData(moment(this._deliveryData.SelectedDate).toDate());
                });
            };

            $scope.DenyExtraDelivery = (ed: Api.Models.IExtraDeliveryRequest): void => {
                this.$modal.open(<ng.ui.bootstrap.IModalSettings>{
                    templateUrl: "Areas/WorkForce/Deliveries/Templates/DenyDeliveryDialog.html",
                    controller: "Workforce.Deliveries.DenyDeliveryController",
                    resolve: {
                        extraDeliveryRequest: () => {
                            return ed;
                        }
                    }
                }).result.then(() => {
                    this.GetDeliveryData(moment(this._deliveryData.SelectedDate).toDate());
                });
            };

            this.GetDeliveryData(null);
        }

        GetDeliveryData = (date: Date): void => {

            this.deliveriesService.GetDeliveriesData(date).then((result) => {

                this._deliveryData = result.data;

                this.$scope.Vm = {
                    DatePickerOptions: <Core.NG.IMxDayPickerOptions>{
                        Date: moment(this._deliveryData.SelectedDate).toDate(),
                        DayOffset: 1,
                        MonthOffset: 0,
                        Max: moment(this._deliveryData.MaxDate).toDate()
                    },
                    SelectedDate: moment(this._deliveryData.SelectedDate),
                    ShowDeliveriesGrid: this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Labor_EmployeePortal_Deliveries_CanViewOthersEntries),
                    CanAuthoriseExtraDeliveries: this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Labor_EmployeePortal_ExtraDeliveries_CanAuthorise),
                    DeliveriesQty: this._deliveryData.DeliveriesQty,
                    TotalDeliveriesQty: this._deliveryData.TotalDeliveriesQty,
                    ExtraDeliveriesQty: this._deliveryData.ExtraDeliveriesQty,
                    ExtraDeliveries: this._deliveryData.ExtraDeliveryRequests
                };
            });
        }

        AddNewExtraDelivery = (): void => {
            
            this.$modal.open(<ng.ui.bootstrap.IModalSettings>{
                templateUrl: "Areas/Workforce/Deliveries/Templates/AddExtraDeliveryDialog.html",
                controller: "Workforce.Deliveries.AddExtraDeliveryController",
                resolve: {
                    selectedDate: () => {
                        return moment(this._deliveryData.SelectedDate).toDate();
                    }
                }
            }).result.then(() => {
                this.GetDeliveryData(moment(this._deliveryData.SelectedDate).toDate());
            });
        }
    }

    Core.NG.WorkforceDeliveriesModule.RegisterRouteController("", "Templates/Deliveries.html", DeliveriesController,
        Core.NG.$typedScope<IDeliveriesControllerScope>(),
        Core.$translation,
        Core.$popupMessageService,
        Core.Auth.$authService,
        deliveriesService,
        Core.NG.$modal
    );
}