declare module Inventory.Order {
    export interface IReceiveOrderDetailsControllerScope extends ng.IScope {
        Translation: Api.Models.IL10N;

        Model: {
            ReceiveOrder: Api.Models.IReceiveOrder;
            SearchFilter: string;
            IsSelectAllItems: boolean;
            CanBePushedToTomorrow: boolean;
            IsReadOnly: boolean;
            CanCorrectReceive: boolean;
            CanChangeApplyDate: boolean;
            InCorrectMode: boolean;
            ShowAddItems: boolean;
            CanAddItems: boolean;
            TotalDeliveryCost: number;
            TotalDeliveryCases: number;
            IsPeriodClosed: boolean;
            CanEditPrice: boolean;
            CanEditCorrectReceivePrice: boolean;
        };

        AreThereAnyItemsToReceive(): boolean;
        ActionsEnabled(): boolean;
        HasReceived(): boolean;
        HasASN(): boolean;

        IsItemReadOnly(item: Api.Models.IReceiveOrderDetail): boolean;
        ItemCheckBoxDisable(item: Api.Models.IReceiveOrderDetail): boolean;
        ShowReceiveTextBox(item: Api.Models.IReceiveOrderDetail): boolean;
        Change(item: Api.Models.IReceiveOrderDetail): void;

        NumericalInputBoxPattern(): RegExp;
        SelectAllItems(): void;
        ItemCheckBoxClicked(item: Api.Models.IReceiveOrderDetail): void;
        BeginCorrectReceive(): void;

        FinishNow(): void;
        ChangeApplyDate(): void;
        PushToTomorrow(): void;
        Return(skipChanges?: boolean): void;
        InReceivingMode(): boolean;
        IsOfflineMode(): boolean;
        ShowChangeApplyDate(): boolean;

        SaveChanges(): void;
        CancelChanges(): void;

        AddNewItems(): void;

        ClearCategoryFilter(): void;
        CategoryText: string;
        OriginalDetails: Api.Models.IReceiveOrderDetail[];
        TotalItems: number;
        SetCategory(category: Api.Models.ICategory): void;

        UpdateTotals(): void;
        PeriodCloseStatusCheckAndSaveChanges(): void;
        PriceInEditMode(item: Api.Models.IReceiveOrderDetail): boolean;
    }
} 