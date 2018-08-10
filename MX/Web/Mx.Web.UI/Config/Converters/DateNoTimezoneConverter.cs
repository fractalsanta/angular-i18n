
namespace Mx.Web.UI.Config.Converters
{
    public class DateNoTimezoneConverter : Newtonsoft.Json.Converters.IsoDateTimeConverter
    {
        public DateNoTimezoneConverter()
        {
            this.DateTimeFormat = "yyyy'-'MM'-'dd";
        }
    }
}