declare module Inventory.Order {

    interface IOrderDetailWithValidation extends Api.Models.IOrderDetail {
        QuantityIsValid: boolean;
        ErrorMessage: string;
    }
}   