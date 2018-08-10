var Core;
(function (Core) {
    var UiRouterState;
    (function (UiRouterState) {
        var DefaultMainDetailStates = (function () {
            function DefaultMainDetailStates() {
            }
            DefaultMainDetailStates.Main = "^";
            return DefaultMainDetailStates;
        }());
        UiRouterState.DefaultMainDetailStates = DefaultMainDetailStates;
        var OrderHistoryStates = (function () {
            function OrderHistoryStates() {
            }
            OrderHistoryStates.History = "OrderHistory.History";
            OrderHistoryStates.PlacedOrderDetails = "OrderHistory.History.PlacedOrderDetails";
            OrderHistoryStates.ReceivedOrderDetails = "OrderHistory.History.ReceivedOrderDetails";
            return OrderHistoryStates;
        }());
        UiRouterState.OrderHistoryStates = OrderHistoryStates;
        var ReceiveOrderStates = (function () {
            function ReceiveOrderStates() {
            }
            ReceiveOrderStates.ReceiveOrder = "ReceiveOrder.Receive";
            ReceiveOrderStates.ReceiveOrderDetails = "ReceiveOrder.Receive.Details";
            ReceiveOrderStates.ReceiveOrderExist = "ReceiveOrderExist.Receive";
            ReceiveOrderStates.ReceiveOrderExistDetails = "ReceiveOrderExist.Receive.Details";
            return ReceiveOrderStates;
        }());
        UiRouterState.ReceiveOrderStates = ReceiveOrderStates;
        var OrderStates = (function () {
            function OrderStates() {
            }
            OrderStates.Place = "OrderPlace.Place";
            OrderStates.Details = "OrderPlace.Place.Details";
            OrderStates.Scheduled = "OrderScheduled.Scheduled";
            OrderStates.ScheduledOverdue = "OrderScheduledOverdue.ScheduledOverdue";
            OrderStates.ScheduledOverdueDetails = "OrderScheduledOverdue.ScheduledOverdue.Details";
            return OrderStates;
        }());
        UiRouterState.OrderStates = OrderStates;
        var ViewManagerStates = (function () {
            function ViewManagerStates() {
            }
            ViewManagerStates.ViewManager = "Reporting.ViewManager";
            ViewManagerStates.Details = "Reporting.ViewManager.Details";
            return ViewManagerStates;
        }());
        UiRouterState.ViewManagerStates = ViewManagerStates;
        var TransferHistoryStates = (function () {
            function TransferHistoryStates() {
            }
            TransferHistoryStates.History = "TransferHistory.History";
            TransferHistoryStates.TransferDetails = "TransferHistory.History.TransferDetails";
            return TransferHistoryStates;
        }());
        UiRouterState.TransferHistoryStates = TransferHistoryStates;
        var PromotionStates = (function () {
            function PromotionStates() {
            }
            PromotionStates.List = "Promotions.List";
            PromotionStates.Details = "Promotions.List.Details";
            return PromotionStates;
        }());
        UiRouterState.PromotionStates = PromotionStates;
    })(UiRouterState = Core.UiRouterState || (Core.UiRouterState = {}));
})(Core || (Core = {}));
