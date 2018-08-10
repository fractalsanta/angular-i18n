module Operations.Reporting.InventoryMovement {

    class InventoryMovementController implements IReportController {

        public ReportType: Reporting.Api.Models.ReportType;
        private _reportIsBeingLoaded: boolean;
        private _category: number = null;
        private _products: Reporting.Api.Models.IProductDetails[];
        private _itemDictionary: any;
        private _categoryList: ICategory[];
        private _lastSearch = "";
        private _data: Reporting.Api.Models.IProductData;

        constructor(
            private $scope: IInventoryMovementControllerScope
            , private translationService: Core.ITranslationService
            , private popupMessageService: Core.IPopupMessageService
            , private userSettingService: Administration.User.Services.IUserSettingsService
            , private authService: Core.Auth.IAuthService
            , private constants: Core.IConstants
            , private reportService: IReportService
            , private stateService: ng.ui.IStateService
        ) {

            this.Initialise();

            this.$scope.SortRows = (col: Reporting.Api.Models.IReportColumnData): void => {
                if (this.$scope.Vm.SortColumnId === col.ColumnId) {
                    this.SwitchSortOrder();
                    this.$scope.Vm.SortMap.reverse();
                } else {
                    this.ResetSortkeys();
                    this.$scope.Vm.SortColumnId = col.ColumnId;

                    this.$scope.Vm.SortMap = _.chain(this.$scope.Vm.SortMap)
                        .sortBy(val => val) // secondary sort on date
                        .sortBy(val => this.GetColumnValueByIndex(col, val)) // primary sort on chosen column
                        .value();
                }
            };

            this.$scope.SortCategories = (col: Reporting.Api.Models.IReportColumnData): void => {
                if (this.$scope.Vm.SortColumnId === col.ColumnId) {
                    this.SwitchSortOrder();
                    this.$scope.Vm.Categories.reverse();
                } else {
                    this.ResetSortkeys();
                    this.$scope.Vm.SortColumnId = col.ColumnId;

                    this.$scope.Vm.Categories = _.sortBy(this.$scope.Vm.Categories, (cat: ICategory) => {
                        return this.GetParsedTotalByGroup(col, cat.GroupId);
                    });
                }
            };

            this.$scope.SortByCategory = (): void => {
                if (this.$scope.Vm.SortCategory) {
                    this.SwitchSortOrder();
                    this.$scope.Vm.Categories.reverse();
                } else {
                    this.ResetSortkeys();
                    this.$scope.Vm.SortCategory = true;
                    this.$scope.Vm.Categories = _.sortBy(this.$scope.Vm.Categories, (cat: ICategory) => cat.GroupDescription);
                }
            };

            this.$scope.GetProductByIndex = (index: number) => {
                return this._products[index];
            };

            this.$scope.IsActive = (category: number) => {
                return this._category === category;
            };

            this.$scope.SetCategory = (category: number) => {
                this._category = category;
                this.ResetSortMap();
            };

            this.$scope.ShowTotals = () => {
                this._category = null;
            };

            this.$scope.IsTotals = () => {
                return this._category == null;
            };

            this.$scope.GetSortedValueByIndex = (column: Reporting.Api.Models.IReportColumnData, index: number): any => {
                return column.Values[index];
            };

            this.$scope.GetTotal = (column: Reporting.Api.Models.IReportColumnData): any => {
                return this.$scope.GetTotalByGroup(column, this._category);
            };

            this.$scope.GetTotalByGroup = (column: Reporting.Api.Models.IReportColumnData, group: number): any => {
                var value = _.find(column.Summary, (sum: any) => sum.GroupId === group);
                return value ? value.Total : null;
            };


            this.$scope.GetView = (view: Reporting.Api.Models.IViewModel) => this.GetView(view);

            this.$scope.ShowManager = () => {
                this.reportService.DateFrom = this.$scope.Vm.Dates[0];
                this.reportService.DateTo = this.$scope.Vm.Dates[1];
                this.stateService.go(Core.UiRouterState.ViewManagerStates.ViewManager, { ReportTypeId: Api.Models.ReportType.InventoryMovement });
            };

            this.$scope.ReportIsBeingLoaded = () => this._reportIsBeingLoaded;

            this.$scope.FavouriteClick = (event: Event, view: Reporting.Api.Models.IViewModel): void => {
                if (view.IsDefault) {
                    view.IsDefault = false;
                    this.userSettingService.SetUserSetting(Administration.User.Api.Models.UserSettingEnum.InventoryMovementFavouriteView, "");
                } else {
                    this.SetFavourite(view.ViewId);
                    this.userSettingService.SetUserSetting(Administration.User.Api.Models.UserSettingEnum.InventoryMovementFavouriteView, view.ViewId.toString());
                }
                event.preventDefault();
                event.stopPropagation();
            }

            this.$scope.ExportData = (): void => {
                
                var result: string = "",
                    index: number = 0;

                result += this.EncodeValue(this.$scope.L10N.ExportStoreName) + ",";
                result += this.EncodeValue(this.$scope.L10N.Categories) + ",";
                result += this.EncodeValue(this.$scope.L10N.ColumnItemCode) + ",";
                result += this.EncodeValue(this.$scope.L10N.ColumnItemDescription) + ",";

                //Header
                _.each(this.$scope.Vm.Columns, (column) => {

                    result += this.EncodeValue(this.$scope.L10N[column.ColumnLocalisationKey]) + ",";
                });
                if (result.length > 0) {
                    result = result.substr(0, result.length - 1);
                    result += "\n";
                }

                //Rows
                _.each(this._data.Products, (product) => {
               
                    var group = _.find(this._data.Groups, { 'GroupId': product.GroupId });
                             
                    result += this.EncodeValue(this.$scope.Vm.CurrentEntity.Number + "-" + this.$scope.Vm.CurrentEntity.Name) + ",";
                    result += this.EncodeValue(group.GroupDescription) + ",";
                    result += this.EncodeValue(product.Code) + ",";
                    result += this.EncodeValue(product.Description) + ",";

                    _.each(this._data.Columns, (column) => {

                            result += this.EncodeValue(column.Values[index]) + ",";
                        });

                    if (result.length > 0) {
                        result = result.substr(0, result.length - 1);
                        result += "\n";
                    }

                    index++;
                });

                var anchor: HTMLElement = document.createElement('a');
                anchor.setAttribute("style", "display:none");
                anchor.setAttribute("href", 'data:attachment/csv,' + encodeURIComponent(result));
                anchor.setAttribute("download", this.$scope.Vm.ExportFileName);

                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
            }
        }

        private SwitchSortOrder() {
            this.$scope.Vm.SortAscending = !this.$scope.Vm.SortAscending;
        }

        private ResetSortkeys() {
            this.$scope.Vm.SortColumnId = null;
            this.$scope.Vm.SortItemDescription = false;
            this.$scope.Vm.SortItemCode = false;
            this.$scope.Vm.SortCategory = false;
            this.$scope.Vm.SortAscending = true;
        }

        Initialise() {

            this._reportIsBeingLoaded = false;
            this.ReportType = Api.Models.ReportType.InventoryMovement;
            var canEdit = this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Operations_InventoryMovement_CanAccess);

            this.$scope.ClearSearch = () => {
                this.$scope.Vm.SearchText = "";
                if (this._lastSearch !== "") {
                    this.GetData(this.$scope.Vm.Dates[0], this.$scope.Vm.Dates[1]);
                }
            }

            this.$scope.Search = () => {
                this.GetData(this.$scope.Vm.Dates[0], this.$scope.Vm.Dates[1]);
            }

            this.$scope.SortBy = (key: string) => {
                if (key === "description") {
                    if (this.$scope.Vm.SortItemDescription) {
                        this.SwitchSortOrder();
                        this.$scope.Vm.SortMap.reverse();
                    } else {
                        this.ResetSortkeys();
                        this.$scope.Vm.SortItemDescription = true;
                        this.$scope.Vm.SortMap = _.chain(this.$scope.Vm.SortMap)
                            .sortBy(val => this.$scope.GetProductByIndex(val).Description.toUpperCase())
                            .value();
                    }
                }
                else if (key === "code") {
                    if (this.$scope.Vm.SortItemCode) {
                        this.SwitchSortOrder();
                        this.$scope.Vm.SortMap.reverse();
                    } else {
                        this.ResetSortkeys();
                        this.$scope.Vm.SortItemCode = true;
                        this.$scope.Vm.SortMap = _.chain(this.$scope.Vm.SortMap)
                            .sortBy(val => this.$scope.GetProductByIndex(val).Code.toUpperCase())
                            .value();
                    }
                }
            };

            var today = moment().toDate();
            this.$scope.Vm = {
                SelectedView: null,
                Views: null,
                Dates: [today, today],

                SortMap: [],
                SortColumnId: null,
                SortAscending: true,
                SortItemCode: false,
                SortItemDescription: false,
                SortCategory: false,

                ShowViewManager: canEdit,
                ExportCurrentViewUri: null,
                Columns: [],
                Categories: [],

                SearchText: "",
                State: {
                    Mode: 0
                },
                CurrentEntity: null,
                ExportFileName: ""
            };

            var viewPromise = this.reportService.GetViews(this.ReportType)
                .then(views => {
                    this.$scope.Vm.Views = views;
                    return this.userSettingService.GetUserSetting(Administration.User.Api.Models.UserSettingEnum.InventoryMovementFavouriteView);
                })
                .then(favourite => {
                    var viewId = Number(favourite);
                    if (favourite) {
                        this.SetFavourite(viewId);
                    } else {
                        this.SetFavourite(-1); // clear
                    }

                    var views = this.$scope.Vm.Views;
                    var defaultView = _.find(views, view => view.IsDefault);
                    if (defaultView == null && views.length > 0) {
                        defaultView = views[0];
                    }

                    this.$scope.Vm.SelectedView = defaultView;
                });

            if (this.reportService.DateFrom != null) {
                this.$scope.Vm.Dates[0] = this.reportService.DateFrom;
            }

            if (this.reportService.DateTo != null) {
                this.$scope.Vm.Dates[1] = this.reportService.DateTo;
            }

            this.$scope.ChangeDates = (dates: Date[]): void => {
                viewPromise.then(() => {
                    this.GetData(this.$scope.Vm.Dates[0], this.$scope.Vm.Dates[1]);
                });
            };

            this.translationService.GetTranslations().then((l10N) => {
                this.$scope.L10N = l10N.OperationsReportingInventoryMovement;
                this.popupMessageService.SetPageTitle(this.$scope.L10N.InventoryMovement);
            });

            this.$scope.ChangeDates(this.$scope.Vm.Dates);
        }

        GetView(view: Reporting.Api.Models.IViewModel) {
            this.$scope.Vm.SelectedView = view;
            this.GetData(this.$scope.Vm.Dates[0], this.$scope.Vm.Dates[1]);
        }

        GetData(dateFrom: Date, dateTo: Date) {
            this._reportIsBeingLoaded = true;
            var viewId = this.$scope.Vm.SelectedView != null ? this.$scope.Vm.SelectedView.ViewId : null;
            this._lastSearch = this.$scope.Vm.SearchText;
            this.reportService.GetProductData(viewId, dateFrom, dateTo, this.ReportType, this._lastSearch)
                .then(data => {
                    this.$scope.Vm.Columns = data.Columns;
                    this.$scope.Vm.CurrentEntity = data.CurrentEntity;
                    this.$scope.Vm.ExportFileName = data.ExportFileName;
                    this._data = data;
                    this._products = data.Products;

                    this._categoryList = [];
                    _.forEach(data.Groups, (row: Reporting.Api.Models.IProductGroupDetails) => {
                            this._categoryList.push({ GroupId: row.GroupId, GroupDescription: row.GroupDescription, SortOrder: row.SortOrder, Items: [] });
                    });

                    var index = 0;
                    _.forEach(data.Products, (row: Reporting.Api.Models.IProductDetails) => {
                        var category = _.find(this._categoryList, x => { return x.GroupId === row.GroupId });
                        category.Items.push(index);
                        index++;
                    });

                    this.$scope.Vm.Categories = this._categoryList;

                    this.$scope.ShowTotals();
                    this.ResetSortMap();
                    this.$scope.Vm.ExportCurrentViewUri = this.reportService.GetExportUri(viewId, dateFrom, dateTo, this.ReportType);
                }).finally(() => this._reportIsBeingLoaded = false);
        }

        ResetSortMap() {
            if (this._category == null) {
                return;
            }
            var fr = _.find(this._categoryList, x => { return x.GroupId === this._category });
            this.$scope.Vm.SortMap = fr.Items;
            this.ResetSortkeys();
            this.$scope.SortBy('code');
        }

        SetFavourite(viewId: number) {
            _.each(this.$scope.Vm.Views, (view) => {
                view.IsDefault = view.ViewId === viewId;
            });
        }

        ParseColumnValue(value: any, type: Reporting.Api.Models.ReportColumnValueType): any {
            switch (type) {
                case Api.Models.ReportColumnValueType.Currency:
                case Api.Models.ReportColumnValueType.Decimal:
                case Api.Models.ReportColumnValueType.Integer:
                case Api.Models.ReportColumnValueType.Percentage:
                case Api.Models.ReportColumnValueType.Date:
                    return parseFloat(value) || 0;
                case Api.Models.ReportColumnValueType.String:
                    return value.toString();
                default:
                    return 0;
            }
        }

        GetColumnValueByIndex(column: Reporting.Api.Models.IReportColumnData, index: number) {
            return this.ParseColumnValue(column.Values[index], column.ColumnValueType);
        }

        GetParsedTotalByGroup(column: Reporting.Api.Models.IReportColumnData, group: number): any {
            return this.ParseColumnValue(this.$scope.GetTotalByGroup(column, group), column.ColumnValueType);
        }

        EncodeValue = (value: any): string => {
            if (value == null)
                return "";

            if (typeof (value) === "string") {
                value = "\"" + value.replace(",", "").replace("\"", "") + "\"";
            }

            return value;
        };
   }

    Core.NG.OperationsReportingInventoryMovementModule.RegisterRouteController("", "Templates/InventoryMovement.html", InventoryMovementController
        , Core.NG.$typedScope<IInventoryMovementControllerScope>()
        , Core.$translation
        , Core.$popupMessageService
        , Administration.User.Services.$userSettingService
        , Core.Auth.$authService
        , Core.Constants
        , reportService
        , Core.NG.$state
    );
}