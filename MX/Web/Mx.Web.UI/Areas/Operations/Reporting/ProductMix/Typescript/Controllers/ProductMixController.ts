module Operations.Reporting.ProductMix {
    
    class ProductMixController implements IReportController {

        public ReportType: Reporting.Api.Models.ReportType;
        private _reportLoading: boolean;
        private _products: IIndexedProductDetails[];
        private _categoryList: ICategory[];
        private _category: number = null;

        constructor(
            private $scope: IProductMixControllerScope,
            private translationService: Core.ITranslationService,
            private popupMessageService: Core.IPopupMessageService,
            private userSettingService: Administration.User.Services.IUserSettingsService,
            private authService: Core.Auth.IAuthService,
            private constants: Core.IConstants,
            private reportService: IReportService,
            private stateService: ng.ui.IStateService
        ) {

            this.Initialise();
            this.GetData(this.$scope.Vm.Dates[0], this.$scope.Vm.Dates[1]);
        }

        Initialise() {

            this._reportLoading = false;

            var today = moment().toDate();
            var canAccessViewManager = this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Operations_ProductMix_CanAccessViewManager);

            this.ReportType = Api.Models.ReportType.ProductMix;
            this.translationService.GetTranslations().then((l10N) => {
                this.$scope.L10N = l10N.OperationsReportingProductMix;
                this.popupMessageService.SetPageTitle(this.$scope.L10N.ProductMix);
            });

            this.$scope.Vm = {
                Dates: [today, today],
                Views: [],
                SelectedView: null,
                SortMap: [],
                SortColumnId: null,
                SortAscending: true,
                SortItemCode: false,
                SortItemDescription: false,
                SortCategory: false,
                ShowViewManager: canAccessViewManager,
                State: {
                    Mode: 0
                },
                SearchText: null,
                Columns: [],
                Categories: [],
                ExportCurrentViewUri: null
        };

            var viewPromise = this.reportService.GetViews(this.ReportType)
                .then(views => {
                    this.$scope.Vm.Views = views;
                    return this.userSettingService.GetUserSetting(Administration.User.Api.Models.UserSettingEnum.ProductMixFavouriteView);
                })
                .then(favouriteView => {
                    if (favouriteView) {
                        this.SetFavourite(Number(favouriteView));
                    } else {
                        this.SetFavourite(-1);
                    }

                    var defaultView = _.find(this.$scope.Vm.Views, view => view.IsDefault);

                    if (defaultView == null && this.$scope.Vm.Views.length > 0) {
                        defaultView = this.$scope.Vm.Views[0];
                    }

                    this.$scope.Vm.SelectedView = defaultView;
                });

            this.$scope.ShowViewManager = () => {
                this.reportService.DateFrom = this.$scope.Vm.Dates[0];
                this.reportService.DateTo = this.$scope.Vm.Dates[1];
                this.stateService.go(Core.UiRouterState.ViewManagerStates.ViewManager, { ReportTypeId: Api.Models.ReportType.ProductMix });
            };
            this.$scope.UpdateFavouriteView = (event: Event, view: Reporting.Api.Models.IViewModel) => {
                if (view.IsDefault) {
                    view.IsDefault = false;
                    this.userSettingService.SetUserSetting(Administration.User.Api.Models.UserSettingEnum
                        .ProductMixFavouriteView,
                        "");
                } else {
                    this.SetFavourite(view.ViewId);
                    this.userSettingService.SetUserSetting(Administration.User.Api.Models.UserSettingEnum
                        .ProductMixFavouriteView,
                        view.ViewId.toString());
                }
                event.preventDefault();
                event.stopPropagation();
            };
            this.$scope.GetView = (view: Reporting.Api.Models.IViewModel) => {
                this.$scope.Vm.SelectedView = view;
                this.GetData(this.$scope.Vm.Dates[0], this.$scope.Vm.Dates[1]);
            };
            this.$scope.ChangeDates = (dates: Date[]) => {
                viewPromise.then(() => {
                this.GetData(this.$scope.Vm.Dates[0], this.$scope.Vm.Dates[0]);
                });
            };
            this.$scope.IsReportLoading = () => {
                return this._reportLoading;
            };
            this.$scope.IsTotals = () => {
                return this._category == null;
            };
            this.$scope.ShowTotals = () => {
                return this._category = null;
            };
            this.$scope.IsActive = (category: number) => {
                return this._category === category;
            };

            this.$scope.SetCategory = (category: number) => {
                this._category = category;
                this.ResetSortMap();
            };
            this.$scope.GetTotal = (column: Reporting.Api.Models.IReportColumnData) => {
                return this.$scope.GetTotalByGroup(column, this._category);
            };
            this.$scope.GetTotalByGroup = (column: Reporting.Api.Models.IReportColumnData, group: number): any => {
                var value = _.find(column.Summary, (sum: any) => sum.GroupId === group);

                return value ? value.Total : null;
            };
            this.$scope.GetProductByIndex = (index: number) => {
                return this._products[index];
            };
            this.$scope.GetSortedValueByIndex = (column: Reporting.Api.Models.IReportColumnData, index: number) => {
                return column.Values[index];
            }
            this.$scope.SortBy = (key: string) => {
                if (key === "description") {
                    if (this.$scope.Vm.SortItemDescription) {
                        this.SwitchSortOrder();
                        this.$scope.Vm.SortMap.reverse();
                    } else {
                        this.ResetSortKeys();
                        this.$scope.Vm.SortItemDescription = true;
                        this.$scope.Vm.SortMap = _.chain(this.$scope.Vm.SortMap)
                            .sortBy(val => this.$scope.GetProductByIndex(val.Index).Description.toUpperCase())
                            .value();
                    }
                }
                else if (key === "code") {
                    if (this.$scope.Vm.SortItemCode) {
                        this.SwitchSortOrder();
                        this.$scope.Vm.SortMap.reverse();
                    } else {
                        this.ResetSortKeys();
                        this.$scope.Vm.SortItemCode = true;
                        this.$scope.Vm.SortMap = _.chain(this.$scope.Vm.SortMap)
                            .sortBy(val => this.$scope.GetProductByIndex(val.Index).Code.toUpperCase())
                            .value();
                    }
                }
            };
            this.$scope.SortByCategory = (): void => {
                if (this.$scope.Vm.SortCategory) {
                    this.SwitchSortOrder();
                    this.$scope.Vm.Categories.reverse();
                } else {
                    this.ResetSortKeys();
                    this.$scope.Vm.SortCategory = true;
                    this.$scope.Vm.Categories = _.sortBy(this.$scope.Vm.Categories, (cat: ICategory) => cat.GroupDescription);
                }
            };
            this.$scope.SortRows = (col: Reporting.Api.Models.IReportColumnData): void => {
                if (this.$scope.Vm.SortColumnId === col.ColumnId) {
                    this.SwitchSortOrder();
                    this.$scope.Vm.SortMap.reverse();
                } else {
                    this.ResetSortKeys();
                    this.$scope.Vm.SortColumnId = col.ColumnId;

                    this.$scope.Vm.SortMap = _.chain(this.$scope.Vm.SortMap)
                        .sortBy(val => val)                                     // secondary sort on date
                        .sortBy(val => this.GetColumnValueByIndex(col, val.Index))    // primary sort on chosen column
                        .value();
                }
            };
            this.$scope.SortCategories = (col: Reporting.Api.Models.IReportColumnData): void => {
                if (this.$scope.Vm.SortColumnId === col.ColumnId) {
                    this.SwitchSortOrder();
                    this.$scope.Vm.Categories.reverse();
                } else {
                    this.ResetSortKeys();
                    this.$scope.Vm.SortColumnId = col.ColumnId;

                    this.$scope.Vm.Categories = _.sortBy(this.$scope.Vm.Categories, (cat: ICategory) => {
                        return this.GetParsedTotalByGroup(col, cat.GroupId);
                    });
                }
            };
            this.$scope.Search = () => {
                if (this.$scope.Vm.SearchText) {
                    var result = _.where(this._products,
                        (item: IIndexedProductDetails) => {
                            return _.contains(item.Description.toLowerCase(), this.$scope.Vm.SearchText.toLowerCase()) ||
                                _.contains(item.Code.toLowerCase(), this.$scope.Vm.SearchText.toLowerCase());
                        });
                   
                    this.$scope.Vm.Categories = [];                    

                    _.forEach(result, (row: IIndexedProductDetails) => {
                            var category = _.find(this._categoryList, c => { return c.GroupId === row.GroupId });                            

                            if (!_.any(this.$scope.Vm.Categories, (item) => item.GroupId === category.GroupId)) {
                                this.$scope.Vm.Categories.push({
                                    GroupId: row.GroupId,
                                    GroupDescription: category.GroupDescription,
                                    SortOrder: category.SortOrder,
                                    Items: []
                                });                                
                            }

                            this.$scope.Vm.Categories[this.$scope.Vm.Categories.length - 1].Items.push(row);
                    });
                    this.ResetSortMap();
                }

                return [];
            }
            this.$scope.ClearSearch = () => {
                this.$scope.Vm.SearchText = "";
                this.$scope.Vm.Categories = _.clone(this._categoryList);
                this.ResetSortMap();
            }
            this.$scope.ChangeDates(this.$scope.Vm.Dates);
        }

        GetData(dateFrom: Date, dateTo: Date) {
            this._reportLoading = true;

            var viewId = this.$scope.Vm.SelectedView != null ? this.$scope.Vm.SelectedView.ViewId : null;

            this.reportService.GetProductData(viewId, dateFrom, dateTo, Api.Models.ReportType.ProductMix, "")
                .then(data => {
                    this.$scope.Vm.Columns = data.Columns;
                    this._products = <IIndexedProductDetails[]>data.Products;
                    this._categoryList = [];
                    _.forEach(data.Groups,
                        (row: Reporting.Api.Models.IProductGroupDetails) => {
                            this._categoryList.push({
                                GroupId: row.GroupId,
                                GroupDescription: row.GroupDescription,
                                SortOrder: row.SortOrder,
                                Items: []
                            });
                        });

                    var index = 0;

                    _.forEach(data.Products,
                        (row: IIndexedProductDetails) => {
                            var category = _.find(this._categoryList, c => { return c.GroupId === row.GroupId });

                            row.Index = index;
                            category.Items.push(row);
                            index++;
                        });
                    this.$scope.ClearSearch();
                    this.$scope.ShowTotals();                    
                    this.$scope.Vm.ExportCurrentViewUri = this.reportService.GetExportUri(viewId, dateFrom, dateTo, this.ReportType);
                })
                .finally(() => {
                    this._reportLoading = false;
                });
        }

        ResetSortMap() {
            if (this._category == null) {
                return;
            }

            var fr = _.find(this.$scope.Vm.Categories, c => { return c.GroupId === this._category });

            this.$scope.Vm.SortMap = fr.Items;
            this.ResetSortKeys();
            this.$scope.SortBy("code");
        }

        ResetSortKeys() {
            this.$scope.Vm.SortColumnId = null;
            this.$scope.Vm.SortItemDescription = false;
            this.$scope.Vm.SortItemCode = false;
            this.$scope.Vm.SortCategory = false;
            this.$scope.Vm.SortAscending = true;
        }

        SwitchSortOrder() {
            this.$scope.Vm.SortAscending = !this.$scope.Vm.SortAscending;
        }

        GetColumnValueByIndex(column: Reporting.Api.Models.IReportColumnData, index: number) {
            return this.ParseColumnValue(column.Values[index], column.ColumnValueType);
        }

        GetParsedTotalByGroup(column: Reporting.Api.Models.IReportColumnData, group: number): any {
            return this.ParseColumnValue(this.$scope.GetTotalByGroup(column, group), column.ColumnValueType);
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

        SetFavourite(viewId: number) {
            _.each(this.$scope.Vm.Views,
                (view) => {
                    view.IsDefault = (viewId === view.ViewId);
                });
        }
    }

    Core.NG.OperationsReportingProductMixModule.RegisterRouteController("", "Templates/ProductMix.html", ProductMixController
        , Core.NG.$typedScope<IProductMixControllerScope>()
        , Core.$translation
        , Core.$popupMessageService
        , Administration.User.Services.$userSettingService
        , Core.Auth.$authService
        , Core.Constants
        , reportService
        , Core.NG.$state
    );
}