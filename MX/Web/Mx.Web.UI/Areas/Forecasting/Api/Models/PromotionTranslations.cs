using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    [Translation("ForecastingPromotions")]
    public class PromotionTranslations
    {
        public virtual string PageTitle { get { return "Forecasting - Promotions"; } }
        public virtual string PleaseSelectOrCreateAPromotion { get { return "Please select or create a promotion"; } }
        public virtual string Search { get { return "Search..."; } }
        public virtual string SelectDates { get { return "Select Dates"; } }
        public virtual string AddPromotion { get { return "Add Promotion"; } }
        public virtual string ListColumnDescription { get { return "Description"; } }
        public virtual string ListColumnPeriod { get { return "Period"; } }
        public virtual string ListColumnStatus { get { return "Status"; } }
        public virtual string NoPromotions { get { return "No promotions match your criteria."; } }
        // PromotionTimeline.Uninitialized  is not supposed to appear in UI
        public virtual string TimelineCompleted { get { return "Completed"; } }
        public virtual string TimelineInProgress { get { return "In Progress"; } }
        public virtual string TimelinePending { get { return "Pending"; } }
        public virtual string Back { get { return "Back"; } }
        public virtual string Actions { get { return "Actions"; } }
        public virtual string Save { get { return "Save"; } }
        public virtual string Delete { get { return "Delete"; } }
        public virtual string Description { get { return "Description"; } }
        public virtual string LimitedTimeOffer { get { return "Limited Time Offer"; } }
        public virtual string Period { get { return "Period"; } }
        public virtual string PromotionalItems { get { return "Promotional Items"; } }
        public virtual string ImpactedItems { get { return "Impacted Items"; } }
        public virtual string Add { get { return "Add"; } }
        public virtual string DescriptionCode { get { return "Description (Code)"; } }
        public virtual string Adjustment { get { return "Adjustment"; } }
        public virtual string Zones { get { return "Zones"; } }
        public virtual string PleaseAddItem { get { return "Please add at least one promotional item"; } }
        public virtual string PleaseSelectZone { get { return "Please select at least one zone"; } }
        public virtual string PleaseSelectStore { get { return "Please select at least one store"; } }
        public virtual string AddPromotionalItems { get { return "Add Promotional Items"; } }
        public virtual string AddImpactedItems { get { return "Add Impacted Items"; } }
        public virtual string DeletePromotion { get { return "Delete Promotion"; } }
        public virtual string DeletePromotionConfirmation { get { return "Are you sure you want to delete this promotion? Forecasts existing during the promotional period will be regenerated."; } }
        public virtual string PromotionDeleted { get { return "Promotion has been deleted"; } }
        public virtual string CreatePromotion { get { return "Create Promotion"; } }
        public virtual string UpdatePromotion { get { return "Update Promotion"; } }
        public virtual string SavePromotionConfirmation { get { return "This promotion will overwrite forecasts which may exist during the promotional period."; } }
        public virtual string PromotionCreated { get { return "Promotion has been created"; } }
        public virtual string PromotionUpdated { get { return "Promotion has been updated"; } }
        public virtual string DiscardPromotion { get { return "Discard Promotion"; } }
        public virtual string DiscardPromotionConfirmation { get { return "Navigating away from this page will cause your edits to not be saved. Do you want to continue?"; } }
        public virtual string Confirm { get { return "Confirm"; } }
        public virtual string Cancel { get { return "Cancel"; } }
        public virtual string ConfirmPromotion { get { return "Confirm Promotion"; } }
        public virtual string OverlapConfirmation { get { return "These items already exist in other promotions during the selected promotional period. Please confirm you want to include these items in"; } }
        public virtual string OverwriteManagerForecast { get { return "Overwrite Manager Forecast"; } }
        public virtual string Stores { get { return "Stores"; } }
    }
}