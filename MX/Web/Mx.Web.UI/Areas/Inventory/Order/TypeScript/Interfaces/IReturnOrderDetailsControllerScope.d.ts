declare module Inventory.Order {
    export interface IReturnOrderDetailsControllerScope extends ng.IScope {
        Translation: Api.Models.IL10N;

        Model: {
            ReceiveOrder: Api.Models.IReceiveOrder;
            CurrentOrderDetails: Api.Models.IReceiveOrderDetail[];
            IsReadOnly: boolean;
            CanReturnOrder: boolean;
            SearchFilter: string;
        };

        ActionsEnabled(): boolean;

        ReturnAmountGreaterThanToReceivedAmount(item: Api.Models.IReceiveOrderDetail): boolean;
        ItemCanBeReturned(item: Api.Models.IReceiveOrderDetail): boolean;
        SelectedCanBeReturned(): boolean;
        CanOrderBeReturned(): boolean;

        GoBack(): void;

        ReturnSelected(): void;
        ReturnEntireOrder(): void;
    }
} 
