using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Mx.Web.UI.Config.Converters
{
    public class DateTimeConverter : Newtonsoft.Json.Converters.IsoDateTimeConverter
    {
        public DateTimeConverter()
        {
            this.DateTimeFormat = "yyyy-MM-ddTHH:mm:ss";
        }
    }
}