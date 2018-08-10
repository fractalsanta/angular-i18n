var Forecasting;
(function (Forecasting) {
    "use strict";
    var PromotionDetailsController = (function () {
        function PromotionDetailsController(scope, routeParams, modalService, stateService, promotionService, translationService, popupMessageService, confirmationService, constants) {
            var _this = this;
            this.scope = scope;
            this.routeParams = routeParams;
            this.modalService = modalService;
            this.stateService = stateService;
            this.promotionService = promotionService;
            this.translationService = translationService;
            this.popupMessageService = popupMessageService;
            this.confirmationService = confirmationService;
            this.constants = constants;
            this._today = null;
            this.Initialize(routeParams);
            this.scope.IsNew = function () {
                return !_this.scope.Vm.Promotion || _this.scope.Vm.Promotion.Id === 0;
            };
            this.scope.IsLoaded = function () {
                return _this.Today() != null;
            };
            this.scope.CanSave = function () {
                return _this.scope.Vm.Form && _this.scope.Vm.Form.$dirty && _this.scope.Vm.Form.$valid;
            };
            this.scope.CanDelete = function () {
                return !_this.scope.IsNew() && _this.scope.Vm.Promotion.Timeline === Forecasting.Api.Enums.PromotionTimeline.Pending;
            };
            this.scope.CanEditName = function () {
                return true;
            };
            this.scope.CanEditStartDate = function () {
                return _this.scope.CanEditZones();
            };
            this.scope.CanEditEndDate = function () {
                return _this.scope.CanEditLTO();
            };
            this.scope.CanEditLTO = function () {
                return _this.scope.Vm.Promotion.Timeline !== Forecasting.Api.Enums.PromotionTimeline.Completed;
            };
            this.scope.CanEditOverwrite = function () {
                return _this.scope.CanEditZones();
            };
            this.scope.CanEditItems = function () {
                return _this.scope.CanEditZones();
            };
            this.scope.CanEditZones = function () {
                return _this.scope.Vm.Promotion.Timeline === Forecasting.Api.Enums.PromotionTimeline.Pending;
            };
            this.scope.CanEditStores = function () {
                return _this.scope.CanEditZones();
            };
            this.scope.CanSwitchToStores = function () {
                return _this.scope.CanEditZones();
            };
            this.scope.Back = function () {
                _this.stateService.go("^");
            };
            this.scope.Save = function () {
                if (_this.scope.Vm.Promotion.Timeline === Forecasting.Api.Enums.PromotionTimeline.Completed) {
                    _this.promotionService.Upsert(_this.scope.Vm.Promotion, false)
                        .success(function (result) {
                        _this.OnSaved(false);
                    });
                }
                else {
                    var isNew = _this.scope.IsNew();
                    _this.confirmationService.Confirm({
                        Title: isNew ? _this.scope.L10N.CreatePromotion : _this.scope.L10N.UpdatePromotion,
                        Message: _this.scope.L10N.SavePromotionConfirmation,
                        ConfirmationType: Core.ConfirmationTypeEnum.Positive,
                        ConfirmText: _this.scope.L10N.Save
                    }).then(function () {
                        _this.promotionService.Upsert(_this.scope.Vm.Promotion, true)
                            .success(function (result) {
                            if (result.Overlaps && result.Overlaps.length) {
                                _this.ConfirmOverlaps(result.Overlaps).then(function () {
                                    _this.promotionService.Upsert(_this.scope.Vm.Promotion, false)
                                        .success(function (result) {
                                        _this.OnSaved(isNew);
                                    });
                                });
                            }
                            else {
                                _this.OnSaved(isNew);
                            }
                        });
                    });
                }
            };
            this.scope.Delete = function () {
                _this.confirmationService.Confirm({
                    Title: _this.scope.L10N.DeletePromotion,
                    Message: _this.scope.L10N.DeletePromotionConfirmation,
                    ConfirmationType: Core.ConfirmationTypeEnum.Danger,
                    ConfirmText: _this.scope.L10N.Delete
                }).then(function () {
                    _this.promotionService.Delete(_this.scope.Vm.Promotion.Id).success(function () {
                        _this.scope.Back();
                        _this.popupMessageService.ShowSuccess(_this.scope.L10N.PromotionDeleted);
                    });
                });
            };
            this.scope.ToggleZone = function (zoneId) {
                var index = _this.scope.Vm.Promotion.Zones.indexOf(zoneId);
                if (index == -1) {
                    _this.scope.Vm.Promotion.Zones.push(zoneId);
                }
                else {
                    _this.scope.Vm.Promotion.Zones.splice(index, 1);
                }
                _this.scope.Vm.Form.$setDirty();
            };
            this.scope.AddItems = function (impacted) {
                var addItemModel = {
                    ExistingCodes: _.map(_this.scope.Vm.Promotion.Items, function (item) { return item.ItemCode; }),
                    Title: impacted ? _this.scope.L10N.AddImpactedItems : _this.scope.L10N.AddPromotionalItems
                };
                modalService.open({
                    templateUrl: "/Areas/Inventory/Templates/AddItems.html",
                    controller: "Forecasting.AddItemsControllerPromotionDetails",
                    resolve: {
                        addItemModel: function () { return addItemModel; }
                    }
                }).result.then(function (items) {
                    angular.forEach(items, function (item) {
                        _this.scope.Vm.Promotion.Items.push({
                            Id: item.Id,
                            ItemCode: item.Code,
                            Description: item.Name,
                            AdjustmentPercent: 0,
                            Impacted: impacted
                        });
                    });
                    _this.scope.Vm.Form.$setDirty();
                });
            };
            this.scope.DeleteItem = function (item) {
                _this.scope.Vm.Promotion.Items.splice(_this.scope.Vm.Promotion.Items.indexOf(item), 1);
                _this.scope.Vm.Form.$setDirty();
            };
            this.scope.OpenDateRange = function () {
                _this.OpenDateRangeDialog({
                    StartDate: moment(_this.scope.Vm.Promotion.StartDate).toDate(),
                    EndDate: moment(_this.scope.Vm.Promotion.EndDate).toDate()
                }).then(function (result) {
                    var startMoment = moment(result.StartDate);
                    var endMoment = moment(result.EndDate);
                    if (!moment(_this.scope.Vm.Promotion.StartDate).isSame(startMoment)
                        || !moment(_this.scope.Vm.Promotion.EndDate).isSame(endMoment)) {
                        _this.scope.Vm.Form.$setDirty();
                        _this.scope.Vm.Promotion.StartDate = startMoment.format(_this.constants.InternalDateFormat);
                        _this.scope.Vm.Promotion.EndDate = endMoment.format(_this.constants.InternalDateFormat);
                    }
                });
            };
            this._stateChangeStartUnsubscribe = this.scope.$on("$stateChangeStart", function (e, toState, toParams, fromState, fromParams) {
                _this.OnNavigateStart(e, function () { return stateService.go(toState.name, toParams); });
            });
        }
        PromotionDetailsController.prototype.Initialize = function (routeParams) {
            var _this = this;
            this.translationService.GetTranslations().then(function (l10NData) {
                _this.scope.L10N = l10NData.ForecastingPromotions;
            });
            this.scope.Vm = {
                Promotion: null,
                Zones: null,
                TreeData: null,
                TreeConfig: {
                    core: {
                        themes: {
                            icons: false
                        },
                        strings: {
                            "Loading ...": " "
                        }
                    },
                    plugins: ["checkbox", "sort"],
                    checkbox: {
                        keep_selected_style: false
                    }
                },
                TreeEvents: {
                    select_node: function (event, args) {
                        _this.OnTreeSelectionChanged(_this.scope.Vm.Tree.jstree(true).get_bottom_selected());
                    },
                    deselect_node: function (event, args) {
                        _this.OnTreeSelectionChanged(_this.scope.Vm.Tree.jstree(true).get_bottom_selected());
                    }
                }
            };
            var id = Number(routeParams.Id);
            this.GetData(id);
        };
        PromotionDetailsController.prototype.Today = function () {
            return this._today;
        };
        PromotionDetailsController.prototype.Tomorrow = function () {
            return moment(this.Today()).add({ days: 1 });
        };
        PromotionDetailsController.prototype.GetData = function (id) {
            var _this = this;
            this.promotionService.GetFormData(id).success(function (result) {
                _this.scope.Vm.Promotion = result.Promotion;
                _this.scope.Vm.Zones = result.Zones;
                _this.scope.Vm.TreeData = result.Entities;
                _this._today = moment(result.Today);
                if (id === 0) {
                    _this.scope.Vm.Promotion = {
                        Id: 0,
                        Name: "",
                        StartDate: _this.Tomorrow().format(_this.constants.InternalDateFormat),
                        EndDate: _this.Tomorrow().add({ days: 1 }).format(_this.constants.InternalDateFormat),
                        UseZones: true,
                        LimitedTimeOffer: false,
                        OverwriteManager: false,
                        Status: Forecasting.Api.Enums.PromotionStatus.Active,
                        Timeline: Forecasting.Api.Enums.PromotionTimeline.Pending,
                        Items: [],
                        Entities: [],
                        Zones: []
                    };
                }
                angular.forEach(_this.scope.Vm.TreeData, function (node) {
                    node.state = {
                        opened: node.data <= Core.Api.Models.EntityType.Principle,
                        disabled: !_this.scope.CanEditStores(),
                        selected: node.data == Core.Api.Models.EntityType.Store &&
                            _.contains(_this.scope.Vm.Promotion.Entities, Number(node.id))
                    };
                });
            });
        };
        PromotionDetailsController.prototype.OpenDateRangeDialog = function (range) {
            var _this = this;
            var minMax = {
                StartDate: this.scope.Vm.Promotion.Timeline === Forecasting.Api.Enums.PromotionTimeline.Pending
                    ? this.Tomorrow().toDate()
                    : this.Today().toDate(),
                EndDate: new Date(3000, 1, 1)
            };
            var dialog = this.modalService.open({
                templateUrl: "/Areas/Core/Templates/mx-date-range.html",
                controller: "Core.DateRangeController",
                windowClass: "wide-sm",
                resolve: {
                    dateRange: function () { return range; },
                    minMaxDateRange: function () { return minMax; },
                    dateRangeOptions: function () {
                        return { SetDefaultDates: true, DisableStartDate: !_this.scope.CanEditStartDate() };
                    }
                }
            });
            return dialog.result;
        };
        PromotionDetailsController.prototype.ConfirmOverlaps = function (overlaps) {
            var _this = this;
            var dialog = this.modalService.open({
                templateUrl: "Areas/Forecasting/Templates/PromotionOverlapDialog.html",
                controller: "Forecasting.PromotionOverlapController",
                resolve: {
                    L10N: function () { return _this.scope.L10N; },
                    Overlaps: function () { return overlaps; },
                    PromotionName: function () { return _this.scope.Vm.Promotion.Name; }
                }
            });
            return dialog.result;
        };
        PromotionDetailsController.prototype.OnSaved = function (created) {
            this.scope.Vm.Form.$setPristine();
            this.scope.Back();
            this.popupMessageService.ShowSuccess(created ? this.scope.L10N.PromotionCreated : this.scope.L10N.PromotionUpdated);
        };
        PromotionDetailsController.prototype.OnNavigateStart = function (e, proceed) {
            var _this = this;
            if (this.scope.Vm.Form && this.scope.Vm.Form.$dirty) {
                this.confirmationService.Confirm({
                    Title: this.scope.L10N.DiscardPromotion,
                    Message: this.scope.L10N.DiscardPromotionConfirmation,
                    ConfirmationType: Core.ConfirmationTypeEnum.Positive,
                    ConfirmText: this.scope.L10N.Confirm
                }).then(function () {
                    _this._stateChangeStartUnsubscribe();
                    proceed();
                });
                e.preventDefault();
            }
        };
        PromotionDetailsController.prototype.OnTreeSelectionChanged = function (ids) {
            this.scope.Vm.Promotion.Entities = _.map(ids, function (id) { return Number(id); });
            this.scope.Vm.Form.$setDirty();
        };
        return PromotionDetailsController;
    }());
    Forecasting.PromotionDetailsController = PromotionDetailsController;
    Forecasting.promotionDetailsController = Core.NG.ForecastingModule.RegisterNamedController("PromotionDetailsController", PromotionDetailsController, Core.NG.$typedScope(), Core.NG.$typedStateParams(), Core.NG.$modal, Core.NG.$state, Forecasting.Services.$promotionService, Core.$translation, Core.$popupMessageService, Core.$confirmationService, Core.Constants);
    Core.NG.ForecastingModule.RegisterNamedController("AddItemsControllerPromotionDetails", Inventory.AddItemsController, Core.NG.$typedScope(), Core.NG.$modalInstance, Forecasting.Services.$promotionService, Core.$translation, Core.NG.$typedCustomResolve("addItemModel"));
})(Forecasting || (Forecasting = {}));
