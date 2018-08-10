module Operations.Reporting.AreaSummary {

    class AreaSummaryController implements IReportController {

        public ReportType: Reporting.Api.Models.ReportType;
        private _reportIsBeingLoaded: boolean;

        constructor(
            private $scope: IAreaSummaryControllerScope,
            private translationService: Core.ITranslationService,
            private popupMessageService: Core.IPopupMessageService,
            private authService: Core.Auth.IAuthService,
            private reportService: IReportService,
            private userSettingService: Administration.User.Services.IUserSettingsService,
            private stateService: ng.ui.IStateService,
            private entityService: Core.Api.IEntityService,
            private $q: ng.IQService
            ) {

            this.Initialize();

            translationService.GetTranslations().then((l10N) => {
                $scope.L10N = l10N.OperationsReportingAreaSummary;
                popupMessageService.SetPageTitle($scope.L10N.AreaSummary);
            });

            this.$scope.ReportIsBeingLoaded = () => this._reportIsBeingLoaded;

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
                this.$scope.ChangePage(1);
            };

            this.$scope.ResetSort = () => {

                if (this.$scope.Vm.SortColumnId === null) {
                    this.$scope.Vm.SortAscending = !this.$scope.Vm.SortAscending;
                }

                this.$scope.Vm.SortColumnId = null;

                this.ResetSortMap();

                this.$scope.ChangePage(1);
            };

            this.$scope.ShowManager = () => {
                this.reportService.DateFrom = $scope.Vm.Date;
                this.reportService.DateTo = $scope.Vm.Date;
                this.stateService.go(Core.UiRouterState.ViewManagerStates.ViewManager, { ReportTypeId: Api.Models.ReportType.AreaSummary });
            };

            this.$scope.GetSortedRowByIndex = (row: number) => {
                return this.$scope.Vm.ReportData.Entities[row].Name;
            };

            this.$scope.GetSortedValueByIndex = (column: Reporting.Api.Models.IReportColumnData, index: number) => {
                return column.Values[index];
            }

            this.$scope.GetView = (view: Reporting.Api.Models.IViewModel) => this.GetView(view);
            this.$scope.GetArea = (area: Core.Api.Models.IEntityModel) => this.GetArea(area);

            this.$scope.RequiresPaging = (): boolean => {
                if (!$scope.Vm.ReportData) {
                    return false;
                }
                return ($scope.Vm.ReportData.Entities.length > $scope.Vm.PagingOptions.itemsPerPage);
            };

            this.$scope.ChangePage = (page: number): void => {
                $scope.Vm.CurrentPage = page;
                var index = (page - 1) * $scope.Vm.PagingOptions.itemsPerPage;
                $scope.Vm.CurrentPageSortMap = $scope.Vm.SortMap.slice(index, index + $scope.Vm.PagingOptions.itemsPerPage);
            };

            this.$scope.ExportData = (): void => {

                var result: string = "";

                var data = this.$scope.Vm.ReportData;

                result += this.EncodeValue(this.$scope.L10N.ExportStoreName) + ",";
                result += this.EncodeValue(this.$scope.L10N.ColumnDate) + ",";

                //Header
                _.each(data.Columns, (column) => {

                    result += this.EncodeValue(this.$scope.L10N[column.ColumnLocalisationKey]) + ",";
                });
                if (result.length > 0) {
                    result = result.substr(0, result.length - 1);
                    result += "\n";
                }

                //Rows
                _.each($scope.Vm.SortMap, (index) => {

                    var entity = data.Entities[index];
                    var currentDate = moment($scope.Vm.Date);

                    result += this.EncodeValue(entity.Number + "-" + entity.Name) + ",";
                    result += this.EncodeValue(currentDate.format("YYYY-MM-DD")) + ",";

                    _.each(data.Columns, (column) => {

                        result += this.EncodeValue(column.Values[index]) + ",";
                    });
                    if (result.length > 0) {
                        result = result.substr(0, result.length - 1);
                        result += "\n";
                    }
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

        Initialize() {
            this._reportIsBeingLoaded = false;
            this.ReportType = Api.Models.ReportType.AreaSummary;
            var canAccessViewManager = this.authService.CheckPermissionAllowance(Core.Api.Models.Task.Operations_AreaSummary_CanAccessViewManager);

            this.$scope.Vm = {
                Views: null,
                SelectedView: null,
                Date: moment().toDate(),
                ReportData: null,
                Areas: null,
                SelectedArea: null,
                SortMap: null,
                SortAscending: true,
                SortColumnId: null,
                CurrentPage: 1,
                CurrentPageSortMap: null,
                DatePickerOptions: {
                    Date: moment().toDate(),
                    DayOffset: 1,
                    MonthOffset: 0
                },
                PagingOptions: {
                    itemsPerPage: 20,
                    numPages: 5
                },
                ShowViewManager: canAccessViewManager,
                ExportCurrentViewUri: null,
                ExportFileName: ""
            };

            var promises: ng.IPromise<any>[] = [];

            promises.push(this.entityService.GetEntitiesByEntityType(Core.Api.Models.EntityType.Master)
                .success((areas: Core.Api.Models.IEntityModel[]) => {
                    this.$scope.Vm.Areas = areas;
                    if (areas && areas.length > 0) {
                        this.$scope.Vm.SelectedArea = areas[0];
                    }

                }));

            promises.push(this.reportService.GetViews(this.ReportType)
                .then(views => {
                    this.$scope.Vm.Views = views;
                    return this.userSettingService.GetUserSetting(Administration.User.Api.Models.UserSettingEnum.AreaSummaryFavoriteView);
                })
                .then(favorite => {
                    var viewId = Number(favorite);
                    if (favorite) {
                        this.SetFavourite(viewId);
                    } else {
                        this.SetFavourite(-1);
                    }

                    var views = this.$scope.Vm.Views;
                    var defaultView = _.find(views, view => view.IsDefault);
                    if (defaultView == null && views.length > 0) {
                        defaultView = views[0];
                    }

                    this.$scope.Vm.SelectedView = defaultView;
                }));

            this.$q.all(promises).then(() => {
                this.GetData(this.$scope.Vm.DatePickerOptions.Date);
            });
        

            if (this.reportService.DateFrom != null) {
                this.$scope.Vm.Date = this.reportService.DateFrom;
                this.$scope.Vm.DatePickerOptions.Date = this.reportService.DateFrom;
            }

            this.$scope.ChangeDate = (date: Date): void => {
                this.$scope.Vm.Date = date;
                this.GetData(date);
            };

            this.$scope.FavouriteClick = (event: Event, view: Reporting.Api.Models.IViewModel): void => {
                if (view.IsDefault) {
                    view.IsDefault = false;
                    this.userSettingService.SetUserSetting(Administration.User.Api.Models.UserSettingEnum.AreaSummaryFavoriteView, "");
                } else {
                    this.SetFavourite(view.ViewId);
                    this.userSettingService.SetUserSetting(Administration.User.Api.Models.UserSettingEnum.AreaSummaryFavoriteView, view.ViewId.toString());
                }
                event.preventDefault();
                event.stopPropagation();
            }

        }

        GetView(view: Reporting.Api.Models.IViewModel) {
            this.$scope.Vm.SelectedView = view;
            this.GetData(this.$scope.Vm.Date);
        }

        GetArea(area: Core.Api.Models.IEntityModel) {
            this.$scope.Vm.SelectedArea = area;
            this.GetData(this.$scope.Vm.Date);
        }

        SetFavourite(viewId: number) {
            _.each(this.$scope.Vm.Views, (view) => {
                view.IsDefault = view.ViewId === viewId;
            });
        }

        GetData(date: Date) {
            this._reportIsBeingLoaded = true;
            var viewId = this.$scope.Vm.SelectedView != null ? this.$scope.Vm.SelectedView.ViewId : null;
            var entityId = this.$scope.Vm.SelectedArea != null ? this.$scope.Vm.SelectedArea.Id : null;
            this.reportService.GetReportDataForEntity(entityId, viewId, date, date, this.ReportType)
                .then(data => {
                    this.$scope.Vm.ReportData = data;
                    this.$scope.Vm.ExportFileName = data.ExportFileName;
                    this.ResetSortMap();
                    this.$scope.ChangePage(1);
                    this.$scope.Vm.ExportCurrentViewUri = this.reportService.GetExportUriForEntity(entityId, viewId, date, date, this.ReportType);
                }).finally(() => this._reportIsBeingLoaded = false);
        }

        ResetSortMap() {
            if (this.$scope.Vm.ReportData) {
                var sort = _.range(this.$scope.Vm.ReportData.Entities.length);
                if (this.$scope.Vm.SortColumnId) {
                    this.$scope.SortRows(this.$scope.Vm.ReportData.Columns[this.$scope.Vm.SortColumnId - 1]);
                } else {
                    this.$scope.Vm.SortMap = _.chain(sort)
                        .sortBy(val => this.$scope.Vm.ReportData.Entities[val].Name)
                        .value();

                    if (!this.$scope.Vm.SortAscending) {
                        this.$scope.Vm.SortMap.reverse();
                    }
                }
            }
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

    Core.NG.OperationsReportingAreaSummaryModule.RegisterRouteController("", "Templates/AreaSummary.html", AreaSummaryController,
        Core.NG.$typedScope<IAreaSummaryControllerScope>(),
        Core.$translation,
        Core.$popupMessageService,
        Core.Auth.$authService,
        reportService,
        Administration.User.Services.$userSettingService,
        Core.NG.$state,
        Core.Api.$entityService,
        Core.NG.$q
    );
} 