module Inventory.Count {
    "use strict";

    interface IViewModel {
        ApplyDate: Date;
        // TODO
        // check year-format property existance
        DateOptions: any; // ng.ui.bootstrap.IDatepickerConfig;
        DayCloseDate: string;
        ItemsToCount: number;
        LargePositiveVarianceItems: number;
        LargeNegativeVarianceItems: number;
        ApplyDateForCountType: Date;
        Detail: string;
        ApplyDateRadioBtnValue: string;
        MaxDate: Date;
        ShowApplyDatePopup: boolean;
        IsLoaded: boolean;
        PeriodClosed: boolean;
    }

    interface IFinishCountScope extends ng.IScope {
        Model: IViewModel;
        Cancel(): void;
        Submit(): void;
        SetDate(date: Date): void;
        PageValid(): boolean;
        ValidateDate(value: Date): boolean;
        Translation: Api.Models.IL10N;
       
        OpenApplyDate($event: Event): void;
        ChangeOption(option: string): void;
        AllowCustomDate: boolean;
        IsApplyReadonly: boolean;     
        UpdatePeriodClosedStatus(currentDate: Date): void;  
        StoreDateTime: Date;
    }

    export class ApplyDateOption {
        static GeneratedDate = "generatedDate";
        static CustomDate = "customDate";
    }

    class FinishCountController {

        private _countItemVariances: Api.Models.ICountItemVariance[];
        private _user: Core.Auth.IUser;
        private _constants: Core.IConstants;
        private _periodCloseService: Workforce.PeriodClose.Api.IPeriodCloseService  

        constructor(private $scope: IFinishCountScope
            , private instance: ng.ui.bootstrap.IModalServiceInstance
            , private location: ng.ILocationService
            , private authService: Core.Auth.IAuthService
            , private countService: ICountService
            , private countVarianceService: Api.ICountVarianceService
            , private translationService: Core.ITranslationService
            , private finishService: Api.IFinishService
            , private popupMessageService: Core.IPopupMessageService
            , private countType: string
            , private $modalService: ng.ui.bootstrap.IModalService
            , private signalR: Core.ISignalRService
            , private constants: Core.IConstants
            , private periodCloseService: Workforce.PeriodClose.Api.IPeriodCloseService            
            ) {

            this._countItemVariances = [];
            this._user = authService.GetUser();
            this._constants = constants;
            this._periodCloseService = periodCloseService;
            var entityId = this.authService.GetUser().BusinessUser.MobileSettings.EntityId;

            var getTranslationsPromise = translationService.GetTranslations().then((result: Core.Api.Models.ITranslations): void => {
                $scope.Translation = result.InventoryCount;
            });

            var countId = countService.GetCurrentModel().Inventory.Id;
            var getCountItemVariances = () => countVarianceService.GetCountItemsVariances(entityId, countId);

            var getApplyDatePromise = finishService.GetApplyDateByCountType(entityId, Api.Models.CountType[countType]);                

            getTranslationsPromise.then(() => {
                getApplyDatePromise.success(applySettings => {
                    getCountItemVariances().then((result) => {
                        this._countItemVariances = result.data;
                        this.Initialize(applySettings);
                    });
                });
            });                       

        }

        Finish(applyDate: Date): void {
            var dateString = applyDate ? moment(applyDate).seconds(0).format(this.constants.InternalDateTimeFormat) : null,
                model = this.countService.GetCurrentModel();

            this.finishService.Post({
                CountId: model.Inventory.Id,
                ApplyDate: dateString,
                CountKey: model.Inventory.CountName,
                EntityId: this.authService.GetUser().BusinessUser.MobileSettings.EntityId,
                IsSuggestedDate: this.$scope.AllowCustomDate && this.$scope.IsApplyReadonly,
                CountType: this.countType,
                ConnectionId: this.signalR.GetConnectionId()
            }).success((rs: Api.Models.IApplyCount): void => {
                    if (rs.MonthlyCountAlreadyExists) {
                        this.MonthlyCountAlreadyExists(rs.ApplyDate);
                    } else if (rs.IsDuplicateApplyDate) {
                        this.ApplyDateAlreadyExists(rs.ApplyDate);
                    } else {
                        this.instance.close();
                        this.location.path("/");
                        this.popupMessageService.ShowSuccess(this.$scope.Translation.InventoryCountSubmitSuccess);
                    }
                }).error((): void => {
                    this.instance.dismiss();
                    this.popupMessageService.ShowError(this.$scope.Translation.InventoryCountSubmitFail);
                });
        }

        private Initialize(applySettings: Api.Models.IApplyDateSettings) {

            this.$scope.Model = {
                ApplyDate: new Date(),
                MaxDate: moment().add("day", 1).toDate(),
                DateOptions: {
                    "year-format": "'yy'"
                },
                ItemsToCount: this.countService.GetItemsToCount(),
                LargePositiveVarianceItems: this.GetItemsWithPositiveVarianceCount(),
                LargeNegativeVarianceItems: this.GetItemsWithNegativeVarianceCount(),
                ApplyDateForCountType: new Date(),
                DayCloseDate: "",
                Detail: "",
                ApplyDateRadioBtnValue: ApplyDateOption.GeneratedDate,
                ShowApplyDatePopup: false,
                IsLoaded: false,
                PeriodClosed:false
            };

            if (applySettings) {
                var store = moment(applySettings.StoreDateTime);
                this.$scope.Model.Detail = applySettings.Detail;
                this.$scope.StoreDateTime = moment(store).toDate();
                var limit = store.add('m',5);
                this.$scope.Model.MaxDate = limit.toDate();
                this.$scope.Model.ApplyDate = moment(applySettings.ApplyDateTime).toDate();
                this.$scope.Model.ApplyDateForCountType = moment(applySettings.ApplyDateTime).toDate();
                this.$scope.AllowCustomDate = applySettings.AllowCustomDate;
                this.$scope.IsApplyReadonly = applySettings.IsApplyReadOnly;
                this.$scope.Model.IsLoaded = true;                
            }

            this.$scope.Cancel = (): void => this.instance.dismiss();

            this.$scope.Submit = (): void => {
                this.Finish(this.$scope.Model.ApplyDate);
            };

            this.$scope.OpenApplyDate = ($event: Event): void => {
                $event.preventDefault();
                $event.stopPropagation();                
                this.$scope.Model.ShowApplyDatePopup = !this.$scope.Model.ShowApplyDatePopup;               
            };

            this.$scope.$watch("Model.ApplyDate", () => {               

                    this.$scope.UpdatePeriodClosedStatus(this.$scope.Model.ApplyDate);
               
            });
            

            this.$scope.ChangeOption = (option: string): void => {    
                    
                this.$scope.Model.ApplyDateRadioBtnValue = option; 
               
                if (option === ApplyDateOption.GeneratedDate) {
                    this.$scope.Model.ApplyDate = this.$scope.Model.ApplyDateForCountType;
                    this.$scope.IsApplyReadonly = true;
                }

                if (option === ApplyDateOption.CustomDate) {
                    this.$scope.Model.ApplyDate = this.$scope.StoreDateTime;
                    this.$scope.IsApplyReadonly = false;
                }
            };

            this.$scope.PageValid = (): boolean => {
                return this.$scope.Model.IsLoaded && (this.$scope.IsApplyReadonly || this.$scope.Model.MaxDate > this.$scope.Model.ApplyDate);
            };

            this.$scope.UpdatePeriodClosedStatus = (currentDate: Date): void => {
               
                this._periodCloseService.GetPeriodLockStatus(this._user.BusinessUser.MobileSettings.EntityId, moment(currentDate).format(this._constants.InternalDateFormat))
                    .success((result) => {

                        this.$scope.Model.PeriodClosed = (result.IsClosed && !this.authService.CheckPermissionAllowance(Core.Api.Models.Task.InventoryCount_CanEditClosedPeriods));

                    });
            };

        }

        private MonthlyCountAlreadyExists(applyDate: string): void {
            this.popupMessageService.ShowError(this.$scope.Translation.APeriodCount
                                             + moment(applyDate).format("LLL")
                                             + ". "
                                             + this.$scope.Translation.CanNotBeFinalized);
        }

        private ApplyDateAlreadyExists(applyDate: string): void {
            this.popupMessageService.ShowError(this.$scope.Translation.DuplicateApplyDate + moment(applyDate).format("LLL"));
        }

        private GetItemsWithPositiveVarianceCount(): number {
            return _.filter(this._countItemVariances, v => v.HasVariance && v.VariancePercent > 0).length;
        }

        private GetItemsWithNegativeVarianceCount(): number {
            return _.filter(this._countItemVariances, v => v.HasVariance && v.VariancePercent < 0).length;
        }

    }

    Core.NG.InventoryCountModule.RegisterNamedController("FinishCount", FinishCountController
        , Core.NG.$typedScope<IFinishCountScope>()
        , Core.NG.$modalInstance
        , Core.NG.$location
        , Core.Auth.$authService
        , $countService
        , Api.$countVarianceService
        , Core.$translation
        , Api.$finishService
        , Core.$popupMessageService
        , Core.NG.$typedCustomResolve<string>("countType")
        , Core.NG.$modal
        , Core.$signalR
        , Core.Constants
        , Workforce.PeriodClose.Api.$periodCloseService        
        );
}
