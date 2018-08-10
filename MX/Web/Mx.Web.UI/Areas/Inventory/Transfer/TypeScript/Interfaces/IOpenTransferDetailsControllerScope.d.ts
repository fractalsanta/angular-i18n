declare module Inventory.Transfer {
    export interface IOpenTransferDetailsControllerScope extends ng.IScope {
        Translations: Api.Models.IL10N;
        Transfer: Api.Models.ITransfer;
        RequestingLocationDisplayName: string;
        SendingLocationDisplayName: string;
        GridDefinitions: IOpenTransferDetailsColumnDefinition[];
        CurrentSortColumn: IOpenTransferDetailsColumnDefinition;
        Ascending: boolean;
        IsReadOnly: boolean;
        SelectedItem: Api.Models.ITransferDetail;
        PreviousTransfer: Api.Models.ITransfer;
        IsPeriodClosed: boolean;

        SortColumn(column: IOpenTransferDetailsColumnDefinition): void;
        GetRequestTotal(): number;
        Approve(): void;
        Receive(): void;
        Deny(): void;
        Return(): void;
        OnRowSelect(e: Event): void;
        UpdateDetails(item: Api.Models.ITransferDetail): void;
        GetToOrFromText(): string;
        IsInbound(): boolean;
        IsReceive(): boolean;
        UpdatePeriodClosedStatus(fromLocationId: number, toLocationId: number): void;
    }
} 