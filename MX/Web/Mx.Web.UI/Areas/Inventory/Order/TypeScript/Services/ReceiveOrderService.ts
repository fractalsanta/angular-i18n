module Inventory.Order {
    "use strict";
    class ReceiveOrderService implements IReceiveOrderService {
        constructor(
            private authService: Core.Auth.IAuthService,
            private signalR: Core.ISignalRService,
            private $receiveOrderApiService: Api.IReceiveOrderService,
            private $receiveOrderDetailsApiService: Api.IReceiveOrderDetailService,
            private constants: Core.IConstants
        ) {
            this.Initialise();
        }

        Initialise() {
            this.OrderModified = new Core.Events.Event<void>();
        }


        public OrderAddItems(orderId: number, itemCodesToAdd: string[]) {
            var user = this.authService.GetUser();
            var promise = <ng.IPromise<Order.Api.Models.IReceiveOrderDetail[]>> {};
            if (user != null && user.BusinessUser != null && user.BusinessUser.MobileSettings != null) {
                promise = this.$receiveOrderApiService.PostAddItems(user.BusinessUser.MobileSettings.EntityId, orderId, itemCodesToAdd).then(result => {
                    return result.data;
                });
            }
            return promise;
        }

        public OrderModified: Core.Events.IEvent<void>;

        public GetReceiveOrder(orderId: number): ng.IHttpPromise<Api.Models.IReceiveOrder> {
            return this.$receiveOrderApiService.GetReceiveOrder(orderId);
        }

        public FinishReceiveOrder(applyDate: Date, order: Api.Models.IReceiveOrder): ng.IPromise<boolean> {
            var user = this.authService.GetUser(),
                items = _.where(order.Items, (item: Api.Models.IReceiveOrderDetail): boolean => {
                    return item.IsReadyToBeReceived && ! item.Received;
                });

            return this.$receiveOrderDetailsApiService.PostReceiveOrder(
                user.BusinessUser.MobileSettings.EntityId,
                moment(applyDate).format(this.constants.InternalDateTimeFormat), order.OrderNumber, order.InvoiceNumber, items)
                .then(result => {
                    this.OrderModified.Fire(null);
                    return result.data;
                });
        }

        public AdjustReceiveOrder(order: Api.Models.IReceiveOrder): ng.IPromise<boolean> {
            var user = this.authService.GetUser(),
                items = _.where(order.Items, (item: Api.Models.IReceiveOrderDetail): boolean => {
                    return item.Received;
                });

            return this.$receiveOrderDetailsApiService.PostAdjustment(
                user.BusinessUser.MobileSettings.EntityId, order.OrderNumber, items).then(result => {
                    this.OrderModified.Fire(null);
                    return result.data;
                });
        }

        public ChangeApplyDate(applyDate: Date, order: Api.Models.IReceiveOrder): ng.IPromise<Api.Models.IChangeApplyDateResponse> {
            return this.$receiveOrderDetailsApiService.PostChangeApplyDate(
                order.OrderNumber,
                moment(applyDate).format(this.constants.InternalDateTimeFormat)).then(result => {
                    this.OrderModified.Fire(null);
                    return result.data;
                });
        }

        public IsOffline(): boolean {
            return this.signalR.IsOffline();
        }

        public PushOrderToTomorrow(order: Api.Models.IReceiveOrder): ng.IPromise<void> {
            return this.$receiveOrderApiService.PostPushForTomorrow(order.OrderNumber).then(() => {
                this.OrderModified.Fire(null);
            });
        }

        public GetLocalStoreDateTimeString(): ng.IHttpPromise<string> {           
            return this.$receiveOrderApiService.GetLocalStoreDateTimeString(this.authService.GetUser().BusinessUser.MobileSettings.EntityId);           
        }

    }

    $receiveOrderService = Core.NG.InventoryOrderModule.RegisterService("ReceiveOrderSrv"
        , ReceiveOrderService
        , Core.Auth.$authService
        , Core.$signalR
        , Api.$receiveOrderService
        , Api.$receiveOrderDetailService
        , Core.Constants
        );
}
