module Core.UiRouterState {  

    export class DefaultMainDetailStates {
        public static Main: string = "^";
    }

    export class OrderHistoryStates {
        public static History: string = "OrderHistory.History";
        public static PlacedOrderDetails: string = "OrderHistory.History.PlacedOrderDetails";
        public static ReceivedOrderDetails: string = "OrderHistory.History.ReceivedOrderDetails";
    }

    export class ReceiveOrderStates {
        public static ReceiveOrder: string = "ReceiveOrder.Receive";
        public static ReceiveOrderDetails: string = "ReceiveOrder.Receive.Details";

        public static ReceiveOrderExist: string = "ReceiveOrderExist.Receive";
        public static ReceiveOrderExistDetails: string = "ReceiveOrderExist.Receive.Details";
    }

    export class OrderStates {
        public static Place: string = "OrderPlace.Place";
        public static Details: string = "OrderPlace.Place.Details";
        public static Scheduled: string = "OrderScheduled.Scheduled";
        public static ScheduledOverdue: string = "OrderScheduledOverdue.ScheduledOverdue";
        public static ScheduledOverdueDetails: string = "OrderScheduledOverdue.ScheduledOverdue.Details";
    }

    export class ViewManagerStates {
        public static ViewManager: string = "Reporting.ViewManager";
        public static Details: string = "Reporting.ViewManager.Details";
    }

    export class TransferHistoryStates {
        public static History: string = "TransferHistory.History";
        public static TransferDetails: string = "TransferHistory.History.TransferDetails";
    }

    export class PromotionStates {
        public static List: string = "Promotions.List";
        public static Details: string = "Promotions.List.Details";
    }
} 