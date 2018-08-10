var Inventory;
(function (Inventory) {
    var Count;
    (function (Count) {
        "use strict";
        var ApplyDateOption = (function () {
            function ApplyDateOption() {
            }
            ApplyDateOption.GeneratedDate = "generatedDate";
            ApplyDateOption.CustomDate = "customDate";
            return ApplyDateOption;
        }());
        Count.ApplyDateOption = ApplyDateOption;
        var FinishCountController = (function () {
            function FinishCountController($scope, instance, location, authService, countService, countVarianceService, translationService, finishService, popupMessageService, countType, $modalService, signalR, constants, periodCloseService) {
                var _this = this;
                this.$scope = $scope;
                this.instance = instance;
                this.location = location;
                this.authService = authService;
                this.countService = countService;
                this.countVarianceService = countVarianceService;
                this.translationService = translationService;
                this.finishService = finishService;
                this.popupMessageService = popupMessageService;
                this.countType = countType;
                this.$modalService = $modalService;
                this.signalR = signalR;
                this.constants = constants;
                this.periodCloseService = periodCloseService;
                this._countItemVariances = [];
                this._user = authService.GetUser();
                this._constants = constants;
                this._periodCloseService = periodCloseService;
                var entityId = this.authService.GetUser().BusinessUser.MobileSettings.EntityId;
                var getTranslationsPromise = translationService.GetTranslations().then(function (result) {
                    $scope.Translation = result.InventoryCount;
                });
                var countId = countService.GetCurrentModel().Inventory.Id;
                var getCountItemVariances = function () { return countVarianceService.GetCountItemsVariances(entityId, countId); };
                var getApplyDatePromise = finishService.GetApplyDateByCountType(entityId, Count.Api.Models.CountType[countType]);
                getTranslationsPromise.then(function () {
                    getApplyDatePromise.success(function (applySettings) {
                        getCountItemVariances().then(function (result) {
                            _this._countItemVariances = result.data;
                            _this.Initialize(applySettings);
                        });
                    });
                });
            }
            FinishCountController.prototype.Finish = function (applyDate) {
                var _this = this;
                var dateString = applyDate ? moment(applyDate).seconds(0).format(this.constants.InternalDateTimeFormat) : null, model = this.countService.GetCurrentModel();
                this.finishService.Post({
                    CountId: model.Inventory.Id,
                    ApplyDate: dateString,
                    CountKey: model.Inventory.CountName,
                    EntityId: this.authService.GetUser().BusinessUser.MobileSettings.EntityId,
                    IsSuggestedDate: this.$scope.AllowCustomDate && this.$scope.IsApplyReadonly,
                    CountType: this.countType,
                    ConnectionId: this.signalR.GetConnectionId()
                }).success(function (rs) {
                    if (rs.MonthlyCountAlreadyExists) {
                        _this.MonthlyCountAlreadyExists(rs.ApplyDate);
                    }
                    else if (rs.IsDuplicateApplyDate) {
                        _this.ApplyDateAlreadyExists(rs.ApplyDate);
                    }
                    else {
                        _this.instance.close();
                        _this.location.path("/");
                        _this.popupMessageService.ShowSuccess(_this.$scope.Translation.InventoryCountSubmitSuccess);
                    }
                }).error(function () {
                    _this.instance.dismiss();
                    _this.popupMessageService.ShowError(_this.$scope.Translation.InventoryCountSubmitFail);
                });
            };
            FinishCountController.prototype.Initialize = function (applySettings) {
                var _this = this;
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
                    PeriodClosed: false
                };
                if (applySettings) {
                    var store = moment(applySettings.StoreDateTime);
                    this.$scope.Model.Detail = applySettings.Detail;
                    this.$scope.StoreDateTime = moment(store).toDate();
                    var limit = store.add('m', 5);
                    this.$scope.Model.MaxDate = limit.toDate();
                    this.$scope.Model.ApplyDate = moment(applySettings.ApplyDateTime).toDate();
                    this.$scope.Model.ApplyDateForCountType = moment(applySettings.ApplyDateTime).toDate();
                    this.$scope.AllowCustomDate = applySettings.AllowCustomDate;
                    this.$scope.IsApplyReadonly = applySettings.IsApplyReadOnly;
                    this.$scope.Model.IsLoaded = true;
                }
                this.$scope.Cancel = function () { return _this.instance.dismiss(); };
                this.$scope.Submit = function () {
                    _this.Finish(_this.$scope.Model.ApplyDate);
                };
                this.$scope.OpenApplyDate = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    _this.$scope.Model.ShowApplyDatePopup = !_this.$scope.Model.ShowApplyDatePopup;
                };
                this.$scope.$watch("Model.ApplyDate", function () {
                    _this.$scope.UpdatePeriodClosedStatus(_this.$scope.Model.ApplyDate);
                });
                this.$scope.ChangeOption = function (option) {
                    _this.$scope.Model.ApplyDateRadioBtnValue = option;
                    if (option === ApplyDateOption.GeneratedDate) {
                        _this.$scope.Model.ApplyDate = _this.$scope.Model.ApplyDateForCountType;
                        _this.$scope.IsApplyReadonly = true;
                    }
                    if (option === ApplyDateOption.CustomDate) {
                        _this.$scope.Model.ApplyDate = _this.$scope.StoreDateTime;
                        _this.$scope.IsApplyReadonly = false;
                    }
                };
                this.$scope.PageValid = function () {
                    return _this.$scope.Model.IsLoaded && (_this.$scope.IsApplyReadonly || _this.$scope.Model.MaxDate > _this.$scope.Model.ApplyDate);
                };
                this.$scope.UpdatePeriodClosedStatus = function (currentDate) {
                    _this._periodCloseService.GetPeriodLockStatus(_this._user.BusinessUser.MobileSettings.EntityId, moment(currentDate).format(_this._constants.InternalDateFormat))
                        .success(function (result) {
                        _this.$scope.Model.PeriodClosed = (result.IsClosed && !_this.authService.CheckPermissionAllowance(Core.Api.Models.Task.InventoryCount_CanEditClosedPeriods));
                    });
                };
            };
            FinishCountController.prototype.MonthlyCountAlreadyExists = function (applyDate) {
                this.popupMessageService.ShowError(this.$scope.Translation.APeriodCount
                    + moment(applyDate).format("LLL")
                    + ". "
                    + this.$scope.Translation.CanNotBeFinalized);
            };
            FinishCountController.prototype.ApplyDateAlreadyExists = function (applyDate) {
                this.popupMessageService.ShowError(this.$scope.Translation.DuplicateApplyDate + moment(applyDate).format("LLL"));
            };
            FinishCountController.prototype.GetItemsWithPositiveVarianceCount = function () {
                return _.filter(this._countItemVariances, function (v) { return v.HasVariance && v.VariancePercent > 0; }).length;
            };
            FinishCountController.prototype.GetItemsWithNegativeVarianceCount = function () {
                return _.filter(this._countItemVariances, function (v) { return v.HasVariance && v.VariancePercent < 0; }).length;
            };
            return FinishCountController;
        }());
        Core.NG.InventoryCountModule.RegisterNamedController("FinishCount", FinishCountController, Core.NG.$typedScope(), Core.NG.$modalInstance, Core.NG.$location, Core.Auth.$authService, Count.$countService, Count.Api.$countVarianceService, Core.$translation, Count.Api.$finishService, Core.$popupMessageService, Core.NG.$typedCustomResolve("countType"), Core.NG.$modal, Core.$signalR, Core.Constants, Workforce.PeriodClose.Api.$periodCloseService);
    })(Count = Inventory.Count || (Inventory.Count = {}));
})(Inventory || (Inventory = {}));
