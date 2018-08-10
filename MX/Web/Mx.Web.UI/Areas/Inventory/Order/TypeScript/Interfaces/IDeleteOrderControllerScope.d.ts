declare module Inventory.Order {

    export interface IDeleteOrderControllerScope extends ng.IScope {

        Message: string;

        Cancel(): void;
        Confirm(): void;

        Translations: Api.Models.IL10N;
    }
}