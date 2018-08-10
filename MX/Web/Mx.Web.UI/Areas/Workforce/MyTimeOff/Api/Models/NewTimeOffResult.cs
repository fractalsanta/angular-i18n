using System;

namespace Mx.Web.UI.Areas.Workforce.MyTimeOff.Api.Models
{
    public class NewTimeOffResult
    {
        public Int32 Id { get; set; }
        public Boolean Successful { get; set; }
        public String Message { get; set; }
    }
}