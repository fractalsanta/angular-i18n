module Operations.Reporting.StoreSummary {

    class StoreSummaryController implements IReportController{

        public ReportType: Reporting.Api.Models.ReportType;
        private _reportIsBeingLoaded: boolean;

        constructor(
            private $scope: IStoreSummaryControllerScope
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
                    this.$scope.Vm.SortAscending = !this.$scope.Vm.SortAscending;
                } else {
                    this.$scope.Vm.SortColumnId = col.ColumnId;
                }

                this.$scope.Vm.SortMap = _.chain(this.$scope.Vm.SortMap)
                    .sortBy(val => val) // secondary sort on date
                    .sortBy(val => this.GetColumnValueByIndex(col, val)) // primary sort on chosen column
                    .value();

                if (!this.$scope.Vm.SortAscending) {
                    this.$scope.Vm.SortMap.reverse();
                }
            };

            this.$scope.ResetSort = () => {

                if (this.$scope.Vm.SortColumnId === null) {
                    this.$scope.Vm.SortAscending = !this.$scope.Vm.SortAscending;
                }

                this.$scope.Vm.SortColumnId = null;

                this.ResetSortMap();

                if (!this.$scope.Vm.SortAscending) {
                    this.$scope.Vm.SortMap.reverse();
                }
            };

            this.$scope.GetSortedValueByIndex = (column: Reporting.Api.Models.IReportColumnData, index: number): any => {
                return column.Values[index];
            };

            this.$scope.GetSortedRowByIndex = (row: number) => {
                return moment(this.$scope.Vm.ReportData.DateFrom).add({ days: row }).toDate();
            };

            this.$scope.GetView = (view: Reporting.Api.Models.IViewModel) => this.GetView(view);

            this.$scope.ShowManager = () => {
                this.reportService.DateFrom = this.$scope.Vm.DateFrom;
                this.reportService.DateTo = this.$scope.Vm.DateTo;
                this.stateService.go(Core.UiRouterState.ViewManagerStates.ViewManager, { ReportTypeId: Api.Models.ReportType.StoreSummary});
            };

            this.$scope.ReportIsBeingLoaded = () => this._reportIsBeingLoaded;            

            this.$scope.FavouriteClick = (event: Event, view: Reporting.Api.Models.IViewModel): void => {
                if (view.IsDefault) {
                    view.IsDefault = false;
                    this.userSettingService.SetUserSetting(Administration.User.Api.Models.UserSettingEnum.StoreSummaryFavouriteView, "");
                } else {
                    this.SetFavourite(view.ViewId);
                    this.userSettingService.SetUserSetting(Administration.User.Api.Models.UserSettingEnum.StoreSummaryFavouriteView, view.ViewId.toString());
                }
                event.preventDefault();
                event.stopPropagation();
            }

            this.$scope.ExportData = (): void => {

                var result: string = "",
                    index: number = 0,
                    c: number = 0;

                var data = this.$scope.Vm.ReportData;

                //this.$scope.Vm.ReportData

                result += this.EncodeValue(this.$scope.L10N.ColumnDate) + ",";
                result += this.EncodeValue(this.$scope.L10N.ExportStoreName) + ",";

                //Header
                _.each(data.Columns, (column) => {

                    result += this.EncodeValue(this.$scope.L10N[column.ColumnLocalisationKey]) + ",";
                });
                if (result.length > 0) {
                    result = result.substr(0, result.length - 1);
                    result += "\n";
                }

                var entity = data.Entities[0];

                //Rows
                var currentDate = moment(data.DateFrom);
                var dateTo = moment(data.DateTo);
                while (currentDate <= dateTo) {
                    
                    result += this.EncodeValue(currentDate.format("YYYY-MM-DD")) + ",";
                    result += this.EncodeValue(entity.Number + "-" + entity.Name) + ",";

                    for (c = 0; c < data.Columns.length; c++) {
                        var value = data.Columns[c].Values[index];

                        result += this.EncodeValue(value) + ",";
                    }
                    if (result.length > 0) {
                        result = result.substr(0, result.length - 1);
                        result += "\n";
                    }

                    index++;

                    currentDate = currentDate.add("days", 1);
                }
                
                var anchor: HTMLElement = document.createElement('a');
                anchor.setAttribute("style", "display:none");
                anchor.setAttribute("href", 'data:attachment/csv,' + encodeURIComponent(result));
                anchor.setAttribute("download", this.$scope.Vm.ExportFileName);

                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
            }
        }

        Initialise() {

            this._reportIsBeingLoaded = false;
            this.ReportType = Api.Models.ReportType.StoreSummary;
            var canEdit = this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Operations_StoreSummary_CanAccessViewManager);

            this.$scope.Vm = {
                DateFrom: null,
                DateTo: null,                
                SelectedView: null,
                ChangeDates: null,
                Views: null,
                ReportData: null,
                SortMap: [],
                SortColumnId: null,
                SortAscending: true,
                DateColumnType: Api.Models.ReportColumnValueType.Date,
                ShowViewManager: canEdit,
                ExportCurrentViewUri: null,
                ExportFileName: ""
            };
            
            var viewPromise = this.reportService.GetViews(this.ReportType)
                .then(views => {
                this.$scope.Vm.Views = views;
                    return this.userSettingService.GetUserSetting(Administration.User.Api.Models.UserSettingEnum.StoreSummaryFavouriteView);
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
                this.$scope.Vm.DateFrom = this.reportService.DateFrom;
            }

            if (this.reportService.DateTo != null) {
                this.$scope.Vm.DateTo = this.reportService.DateTo;
            }            

            this.$scope.Vm.ChangeDates = (startDate: Date, endDate: Date): void => {

                this.$scope.Vm.DateFrom = startDate;
                this.$scope.Vm.DateTo = endDate;

                viewPromise.then(() => {
                    this.GetData(startDate, endDate);
                });
            };
            
            this.translationService.GetTranslations().then((l10N) => {
                this.$scope.L10N = l10N.OperationsReportingStoreSummary;
                this.popupMessageService.SetPageTitle(this.$scope.L10N.StoreSummary);
            });            
        }

        GetView(view: Reporting.Api.Models.IViewModel) {
            this.$scope.Vm.SelectedView = view;
            this.GetData(this.$scope.Vm.DateFrom, this.$scope.Vm.DateTo);
        }

        GetData(dateFrom: Date, dateTo: Date) {
            this._reportIsBeingLoaded = true;
            var viewId = this.$scope.Vm.SelectedView != null ? this.$scope.Vm.SelectedView.ViewId : null;
            this.reportService.GetReportData(viewId, dateFrom, dateTo, this.ReportType)
                .then(data => {                    
                    this.$scope.Vm.ReportData = data;
                    this.$scope.Vm.ExportFileName = data.ExportFileName;
                    this.ResetSortMap();
                    this.$scope.Vm.ExportCurrentViewUri = this.reportService.GetExportUri(viewId, dateFrom, dateTo, this.ReportType);
                }).finally(() => this._reportIsBeingLoaded = false);
        }

        SetFavourite(viewId: number) {
            _.each(this.$scope.Vm.Views, (view) => {
                 view.IsDefault = view.ViewId === viewId;
            });
        }

        ResetSortMap() {
            this.$scope.Vm.SortMap = _.range(moment(this.$scope.Vm.ReportData.DateTo).diff(moment(this.$scope.Vm.ReportData.DateFrom), "days") + 1);
        }

        GetColumnValueByIndex(column: Reporting.Api.Models.IReportColumnData, index: number) {
            switch (column.ColumnValueType) {
                case Api.Models.ReportColumnValueType.Currency:
                case Api.Models.ReportColumnValueType.Decimal:
                case Api.Models.ReportColumnValueType.Integer:
                case Api.Models.ReportColumnValueType.Percentage:
                case Api.Models.ReportColumnValueType.Date:
                    return parseFloat(column.Values[index]) || 0;
                case Api.Models.ReportColumnValueType.String:
                    return column.Values[index].toString();
                default:
                    return 0;
            }
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

    Core.NG.OperationsReportingStoreSummaryModule.RegisterRouteController("", "Templates/StoreSummary.html", StoreSummaryController
        , Core.NG.$typedScope<IStoreSummaryControllerScope>()
        , Core.$translation
        , Core.$popupMessageService
        , Administration.User.Services.$userSettingService
        , Core.Auth.$authService
        , Core.Constants
        , reportService
        , Core.NG.$state
    );
}