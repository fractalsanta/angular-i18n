module Inventory.Waste {
    "use strict";

    enum FilterEnum {
        AllItems,
        RawItems,
        FinishedItems
    }

    interface IWasteHistoryControllerScope extends ng.IScope {
        Translations: Api.Models.IL10N;
        Header: Core.Directives.IGridHeader;
        WasteItems: Inventory.Waste.Api.Models.IWasteHistoryItem[];
        HasWaste: boolean;

        Model: {
            Search: string;
            CurrentFilter: string;
        }

        Filtered(): Inventory.Waste.Api.Models.IWasteHistoryItem[];
        FilteredItems: Inventory.Waste.Api.Models.IWasteHistoryItem[];

        Dates: Core.IDateRange;
        ChangeDates(): void;

        GetFilterEnum(): typeof FilterEnum;
        SetFilter(filterIndex: number): void;
    }

    class WasteHistoryController {
        private _customRange: Core.IDateRange;
        private _user: Core.Auth.IUser;
        private _twoWeeks = 14;
        private _filter : FilterEnum;
        private _filterFunction : any;
        private _wasteItems: Inventory.Waste.Api.Models.IWasteHistoryItem[];


        constructor(
            scope: IWasteHistoryControllerScope,
            private historyService: Inventory.Waste.Api.IWasteHistoryService,
            authService: Core.Auth.IAuthService,
            popupMessageService: Core.IPopupMessageService,
            translationService: Core.ITranslationService,
            constants: Core.IConstants
        ) {
            this._user = authService.GetUser();

            scope.$watch("Model.Search", () => {
                scope.FilteredItems = scope.Filtered();
            }, true);


            translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                var tran = scope.Translations = result.InventoryWaste;

                this._filter = FilterEnum.AllItems;
                this._filterFunction = () => {
                    switch (this._filter) {
                    case FilterEnum.RawItems:
                        scope.WasteItems = scope.Header.DefaultSort(_.filter(this._wasteItems, (x) => { return !x.IsFinished; }));
                        scope.Model.CurrentFilter = tran.RawItems;
                        scope.FilteredItems = scope.Filtered();
                        break;
                    case FilterEnum.FinishedItems:
                        scope.WasteItems = scope.Header.DefaultSort(_.filter(this._wasteItems, (x) => { return x.IsFinished; }));
                        scope.Model.CurrentFilter = tran.FinishedItems;
                        scope.FilteredItems = scope.Filtered();
                        break;
                    default:
                        scope.WasteItems = scope.Header.DefaultSort(this._wasteItems);
                        scope.Model.CurrentFilter = tran.AllItems;
                        scope.FilteredItems = scope.Filtered();
                        break;
                    }
                };

                var performSort = (): void => {
                    scope.WasteItems = scope.Header.DefaultSort(scope.WasteItems);
                    scope.FilteredItems = scope.Filtered();
                }

                scope.Header = <Core.Directives.IGridHeader> {
                    Columns: [
                        { Fields: ["WasteDate"], Title: tran.Date },
                        { Fields: ["Description", 'Code'], Title: tran.Description + ' (' + tran.ItemCode + ')' },
                        { Fields: ["Qty"], Title: tran.ItemQuantity },
                        { Fields: ["Reason"], Title: tran.Reason },
                        { Fields: ["TotalValue"], Title: tran.Cost, Class: "text-right" }
                    ],
                    OnSortEvent: performSort,
                };
                scope.Header.Selected = scope.Header.Columns[0];

                scope.GetFilterEnum = () => {
                    return FilterEnum;
                };

                scope.Model = {
                    Search: '',
                    CurrentFilter: tran.AllItems
                };


                scope.SetFilter = (filterIndex: FilterEnum) => {
                    this._filter = filterIndex;
                    this._filterFunction();
                };

                popupMessageService.SetPageTitle(tran.WasteHistory);
            });

            var today = moment();
            scope.Dates = {
                EndDate: today.toDate(),
                StartDate: today.subtract('days', this._twoWeeks).toDate()
            };

            scope.WasteItems = [];

            scope.Filtered = () =>
            {
                if (scope.Model.Search) {
                    var lower = scope.Model.Search.toLowerCase();
                    return _.filter(scope.WasteItems, (item) => {
                        return (_.contains(item.Description.toLowerCase(), lower)
                            || _.contains(item.ProductCode.toLowerCase(), lower)
                            || (item.Reason && _.contains(item.Reason.toLowerCase(), lower)));
                    });
                }
                return scope.WasteItems;
            }

            scope.ChangeDates = (): void => {
                historyService.GetWasteHistory(this._user.BusinessUser.MobileSettings.EntityId, moment(scope.Dates.StartDate).format(constants.InternalDateFormat), moment(scope.Dates.EndDate).format(constants.InternalDateFormat)).success(
                    (result) => {
                        this._wasteItems = result;
                        this._filterFunction();
                    }
                );
            };
        }
    }

    Core.NG.InventoryWasteModule.RegisterRouteController("History", "Templates/WasteHistory.html", WasteHistoryController,
        Core.NG.$typedScope<IWasteHistoryControllerScope>(),
        Inventory.Waste.Api.$wasteHistoryService,
        Core.Auth.$authService,
        Core.$popupMessageService,
        Core.$translation,
        Core.Constants
    );
}
