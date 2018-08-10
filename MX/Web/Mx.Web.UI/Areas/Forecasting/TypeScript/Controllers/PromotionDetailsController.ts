module Forecasting {
    "use strict";

    export class PromotionDetailsController {
        private _today: Moment = null;
        private _stateChangeStartUnsubscribe: Function; 

        constructor(private scope: IPromotionDetailsControllerScope
            , private routeParams: IPromotionRouteParams
            , private modalService: ng.ui.bootstrap.IModalService
            , private stateService: ng.ui.IStateService
            , private promotionService: Services.IPromotionService
            , private translationService: Core.ITranslationService
            , private popupMessageService: Core.IPopupMessageService
            , private confirmationService: Core.IConfirmationService
            , private constants: Core.IConstants
        ) {
            this.Initialize(routeParams);

            this.scope.IsNew = (): boolean => {
                return !this.scope.Vm.Promotion || this.scope.Vm.Promotion.Id === 0;
            };

            this.scope.IsLoaded = (): boolean => {
                return this.Today() != null;
            };

            this.scope.CanSave = (): boolean => {
                return this.scope.Vm.Form && this.scope.Vm.Form.$dirty && this.scope.Vm.Form.$valid;
            };

            this.scope.CanDelete = (): boolean => {
                return !this.scope.IsNew() && this.scope.Vm.Promotion.Timeline === Api.Enums.PromotionTimeline.Pending;
            };

            this.scope.CanEditName = (): boolean => {
                return true;
            }

            this.scope.CanEditStartDate = (): boolean => {
                return this.scope.CanEditZones();
            }

            this.scope.CanEditEndDate = (): boolean => {
                return this.scope.CanEditLTO();
            }

            this.scope.CanEditLTO = (): boolean => {
                return this.scope.Vm.Promotion.Timeline !== Api.Enums.PromotionTimeline.Completed;
            }

            this.scope.CanEditOverwrite = (): boolean => {
                return this.scope.CanEditZones();
            }

            this.scope.CanEditItems = (): boolean => {
                return this.scope.CanEditZones();
            };

            this.scope.CanEditZones = (): boolean => {
                return this.scope.Vm.Promotion.Timeline === Api.Enums.PromotionTimeline.Pending;
            }

            this.scope.CanEditStores = (): boolean => {
                return this.scope.CanEditZones();
            };

            this.scope.CanSwitchToStores = (): boolean => {
                return this.scope.CanEditZones();
            };

            this.scope.Back = (): void => {
                this.stateService.go("^");
            };

            this.scope.Save = (): void => {
                if (this.scope.Vm.Promotion.Timeline === Api.Enums.PromotionTimeline.Completed) {
                    // only name is editable on a completed promotion, and no any regeneraion 
                    // is supposed to happen for it, so no need for confirmation
                    this.promotionService.Upsert(this.scope.Vm.Promotion, false)
                        .success((result: Api.Models.IPromotionResult) => {
                            this.OnSaved(false);
                        });
                } else {
                    var isNew: boolean = this.scope.IsNew();

                    this.confirmationService.Confirm(<Core.IConfirmation> {
                        Title: isNew ? this.scope.L10N.CreatePromotion : this.scope.L10N.UpdatePromotion,
                        Message: this.scope.L10N.SavePromotionConfirmation,
                        ConfirmationType: Core.ConfirmationTypeEnum.Positive,
                        ConfirmText: this.scope.L10N.Save
                    }).then(() => {
                        // check for overlaps on first call to Upsert()
                        this.promotionService.Upsert(this.scope.Vm.Promotion, true)
                            .success((result: Api.Models.IPromotionResult) => {
                                if (result.Overlaps && result.Overlaps.length) {
                                    // if there are overlaps confirm them with user (promo hasn't been saved yet)
                                    this.ConfirmOverlaps(result.Overlaps).then(() => {
                                        // if overlaps have been confirmed don't check for overlaps on second call to Upsert()
                                        this.promotionService.Upsert(this.scope.Vm.Promotion, false)
                                            .success((result: Api.Models.IPromotionResult) => {
                                                this.OnSaved(isNew);
                                            });
                                    });
                                } else {
                                    // if no overlaps returned then promo has been saved on first call to Upsert()
                                    this.OnSaved(isNew);
                                }
                            });
                    });
                }
            };

            this.scope.Delete = (): void => {
                this.confirmationService.Confirm(<Core.IConfirmation> {
                    Title: this.scope.L10N.DeletePromotion,
                    Message: this.scope.L10N.DeletePromotionConfirmation,
                    ConfirmationType: Core.ConfirmationTypeEnum.Danger,
                    ConfirmText: this.scope.L10N.Delete
                }).then(() => {
                    this.promotionService.Delete(this.scope.Vm.Promotion.Id).success(() => {
                        this.scope.Back();
                        this.popupMessageService.ShowSuccess(this.scope.L10N.PromotionDeleted);
                    });
                });
            };

            this.scope.ToggleZone = (zoneId: number): void => {
                var index = this.scope.Vm.Promotion.Zones.indexOf(zoneId);
                if (index == -1) {
                    this.scope.Vm.Promotion.Zones.push(zoneId);
                } else {
                    this.scope.Vm.Promotion.Zones.splice(index, 1);
                }
                this.scope.Vm.Form.$setDirty();
            };

            this.scope.AddItems = (impacted: boolean): void => {
                var addItemModel = <Inventory.IAddItemModel> {
                    ExistingCodes: _.map(this.scope.Vm.Promotion.Items, (item) => item.ItemCode),
                    Title: impacted ? this.scope.L10N.AddImpactedItems : this.scope.L10N.AddPromotionalItems
                };

                modalService.open({
                    templateUrl: "/Areas/Inventory/Templates/AddItems.html",
                    controller: "Forecasting.AddItemsControllerPromotionDetails",
                    resolve: {
                        addItemModel: () => { return addItemModel; }
                    }
                }).result.then((items: Inventory.IAddItem[]) => {
                    angular.forEach(items, (item: Inventory.IAddItem) => {
                        this.scope.Vm.Promotion.Items.push(<Api.Models.IPromotionSalesItem> {
                            Id: item.Id,
                            ItemCode: item.Code,
                            Description: item.Name,
                            AdjustmentPercent: 0,
                            Impacted: impacted
                        });
                    });
                    this.scope.Vm.Form.$setDirty();
                });
            }

            this.scope.DeleteItem= (item: Api.Models.IPromotionSalesItem): void => {
                this.scope.Vm.Promotion.Items.splice(this.scope.Vm.Promotion.Items.indexOf(item), 1);
                this.scope.Vm.Form.$setDirty();
            }

            this.scope.OpenDateRange = (): void => {
                this.OpenDateRangeDialog({
                    StartDate: moment(this.scope.Vm.Promotion.StartDate).toDate(), 
                    EndDate: moment(this.scope.Vm.Promotion.EndDate).toDate()
                }).then((result: Core.IDateRange): void => {
                    var startMoment = moment(result.StartDate);
                    var endMoment = moment(result.EndDate);
                    if (!moment(this.scope.Vm.Promotion.StartDate).isSame(startMoment)
                        || !moment(this.scope.Vm.Promotion.EndDate).isSame(endMoment)) {
                        this.scope.Vm.Form.$setDirty();
                        this.scope.Vm.Promotion.StartDate = startMoment.format(this.constants.InternalDateFormat);
                        this.scope.Vm.Promotion.EndDate = endMoment.format(this.constants.InternalDateFormat);
                    }
                });
            };

            this._stateChangeStartUnsubscribe = this.scope.$on("$stateChangeStart", (e: ng.IAngularEvent, toState: ng.ui.IState, toParams: any, fromState: ng.ui.IState, fromParams: any): void => {
                this.OnNavigateStart(e, () => stateService.go(toState.name, toParams));
            });
        }

        private Initialize(routeParams: IPromotionRouteParams): void {
            this.translationService.GetTranslations().then((l10NData: Core.Api.Models.ITranslations): void => {
                this.scope.L10N = l10NData.ForecastingPromotions;
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
                            "Loading ...": " " // shown next to the rolling gear when tree is loading
                        }
                    },
                    plugins: ["checkbox", "sort"],
                    checkbox: {
                        keep_selected_style: false
                    }
                },
                TreeEvents: {
                    select_node: (event: any, args: any) => {
                        this.OnTreeSelectionChanged(this.scope.Vm.Tree.jstree(true).get_bottom_selected());
                    },
                    deselect_node: (event: any, args: any) => {
                        this.OnTreeSelectionChanged(this.scope.Vm.Tree.jstree(true).get_bottom_selected());
                    }
                }
            };

            var id = Number(routeParams.Id);
            this.GetData(id);
        }

        public Today(): Moment {
            return this._today;
        }

        private Tomorrow(): Moment {
            return moment(this.Today()).add({ days: 1 });
        }

        private GetData(id: number): void {
            this.promotionService.GetFormData(id).success((result: Api.Models.IPromotionFormData): void => {
                this.scope.Vm.Promotion = result.Promotion;
                this.scope.Vm.Zones = result.Zones;
                this.scope.Vm.TreeData = result.Entities;
                this._today = moment(result.Today);

                if (id === 0) {
                    this.scope.Vm.Promotion = {
                        Id: 0,
                        Name: "",
                        StartDate: this.Tomorrow().format(this.constants.InternalDateFormat),
                        EndDate: this.Tomorrow().add({ days: 1 }).format(this.constants.InternalDateFormat),
                        UseZones: true,
                        LimitedTimeOffer: false,
                        OverwriteManager: false,
                        Status: Api.Enums.PromotionStatus.Active,
                        Timeline: Api.Enums.PromotionTimeline.Pending,
                        Items: [],
                        Entities: [],
                        Zones: []
                    };
                }

                angular.forEach(this.scope.Vm.TreeData, (node: ngJsTree.Node) => {
                    node.state = {
                        // expand top 2 levels (third level is auto expanded if it has selected entities)
                        opened: node.data <= Core.Api.Models.EntityType.Principle,
                        disabled: !this.scope.CanEditStores(),
                        selected: node.data == Core.Api.Models.EntityType.Store &&
                            _.contains(this.scope.Vm.Promotion.Entities, Number(node.id))
                    };
                });
            });
        }

        private OpenDateRangeDialog(range: Core.IDateRange): ng.IPromise<any> {
            var minMax: Core.IDateRange = <Core.IDateRange> {
                StartDate: this.scope.Vm.Promotion.Timeline === Api.Enums.PromotionTimeline.Pending
                    ? this.Tomorrow().toDate()
                    : this.Today().toDate(),
                EndDate: new Date(3000, 1, 1)
            };
            var dialog = this.modalService.open(<ng.ui.bootstrap.IModalSettings> {
                templateUrl: "/Areas/Core/Templates/mx-date-range.html",
                controller: "Core.DateRangeController",
                windowClass: "wide-sm",
                resolve: {
                    dateRange: (): Core.IDateRange => { return range; },
                    minMaxDateRange: (): Core.IDateRange => { return minMax; },
                    dateRangeOptions: (): Core.IDateRangeOptions => {
                        return <Core.IDateRangeOptions> { SetDefaultDates: true, DisableStartDate: !this.scope.CanEditStartDate() };
                    }
                }
            });
            return dialog.result;
        }

        private ConfirmOverlaps(overlaps: Api.Models.IPromotionOverlap[]): ng.IPromise<void> {
            var dialog = this.modalService.open({
                templateUrl: "Areas/Forecasting/Templates/PromotionOverlapDialog.html",
                controller: "Forecasting.PromotionOverlapController",
                resolve: {
                    L10N: () => { return this.scope.L10N; },
                    Overlaps: () => { return overlaps; },
                    PromotionName: () => { return this.scope.Vm.Promotion.Name; }
                }
            });
            return dialog.result;
        }

        private OnSaved(created: boolean): void {
            this.scope.Vm.Form.$setPristine();
            this.scope.Back();
            this.popupMessageService.ShowSuccess(created ? this.scope.L10N.PromotionCreated : this.scope.L10N.PromotionUpdated);
        }

        private OnNavigateStart(e: ng.IAngularEvent, proceed: () => void): void {
            if (this.scope.Vm.Form && this.scope.Vm.Form.$dirty) {
                this.confirmationService.Confirm(<Core.IConfirmation> {
                    Title: this.scope.L10N.DiscardPromotion,
                    Message: this.scope.L10N.DiscardPromotionConfirmation,
                    ConfirmationType: Core.ConfirmationTypeEnum.Positive,
                    ConfirmText: this.scope.L10N.Confirm
                }).then(() => {
                    this._stateChangeStartUnsubscribe();
                    proceed();
                });
                e.preventDefault();
            }
        }

        private OnTreeSelectionChanged(ids: string[]): void {
            this.scope.Vm.Promotion.Entities = _.map(ids, (id) => Number(id));
            this.scope.Vm.Form.$setDirty();
        }
    }

    export var promotionDetailsController = Core.NG.ForecastingModule.RegisterNamedController("PromotionDetailsController"
        , PromotionDetailsController
        , Core.NG.$typedScope<IPromotionDetailsControllerScope>()
        , Core.NG.$typedStateParams<IPromotionRouteParams>()
        , Core.NG.$modal
        , Core.NG.$state
        , Services.$promotionService
        , Core.$translation
        , Core.$popupMessageService
        , Core.$confirmationService
        , Core.Constants
        );

    Core.NG.ForecastingModule.RegisterNamedController("AddItemsControllerPromotionDetails"
        , Inventory.AddItemsController
        , Core.NG.$typedScope<Inventory.IAddItemsControllerScope>()
        , Core.NG.$modalInstance
        , Services.$promotionService
        , Core.$translation
        , Core.NG.$typedCustomResolve<any>("addItemModel")
        );
} 