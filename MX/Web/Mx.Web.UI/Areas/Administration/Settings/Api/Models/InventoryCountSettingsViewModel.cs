
namespace Mx.Web.UI.Areas.Administration.Settings.Api.Models
{
    public class InventoryCountSettingsViewModel
    {
        public string PendingColor { get; set; }
        public string OutOfToleranceColor { get; set; }
        public string CountedColor { get; set; }


        public static void ConfigureAutoMapping()
        {

        }
    }
}