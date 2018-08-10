using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Areas.Inventory.Production.Api.Models
{
    [Translation("PrepAdjust")]
    public class L10N
    {
        public virtual string Production
        {
            get { return "Production"; }
        }

        public virtual string PrepAdjustment
        {
            get { return "Prep Adjustment"; }
        }
        public virtual string Finish
        {
            get { return "Finish"; }
        }

        public virtual string AddNewItems
        {
            get { return "Add new prep item(s)"; }
        }
        public virtual string Description
        {
            get { return "Description"; }
        }
        public virtual string ItemCode
        {
            get { return "Code"; }
        }
        public virtual string Outer
        {
            get { return "Outer"; }
        }
        public virtual string Inner
        {
            get { return "Inner"; }
        }
        public virtual string Unit
        {
            get { return "Unit"; }
        }
        public virtual string Cost
        {
            get { return "Cost"; }
        }
        public virtual string PageTitle
        {
            get { return "Prep Adjustment"; }
        }
        public virtual string AddNewItemToBegin
        {
            get { return "'Add new prep item' to begin prep adjustment entry"; }
        }
        public virtual string FinishAdjustment
        {
            get { return "Finish Prep Adjustment"; }
        }
        public virtual string ItemsBeingModified
        {
            get { return "Items being modified:"; }
        }
        public virtual string Cancel
        {
            get { return "Cancel"; }
        }
        public virtual string AdjustmentSubmit
        {
            get { return "Submit"; }
        }
        public virtual string AdjustmentSubmitSuccess
        {
            get { return "Prep Adjustment Successfully Submitted"; }
        }
        public virtual string AdjustmentSubmitFail
        {
            get { return "Prep Adjustment Failed Submit"; }
        }

        public virtual string SearchPrepAdjustItemTitle
        {
            get { return "Search For Items"; }
        }
        public virtual string SearchPrepAdjustItemNoRecordsFound
        {
            get { return "No items match your criteria"; }
        }
        public virtual string Search
        {
            get { return "Search"; }
        }
        public virtual string Submit
        {
            get { return "Submit"; }
        }
        public virtual string Code
        {
            get { return "Code"; }
        }
        public virtual string DescriptionCode
        {
            get { return "Description (Code)"; }
        }
        public virtual string ToggleFavorite
        {
            get { return "Toggle Favorite"; }
        }
    }
}
