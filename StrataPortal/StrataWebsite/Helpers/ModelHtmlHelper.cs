using Rockend.iStrata.StrataCommon.BusinessEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace Rockend.iStrata.StrataWebsite.Helpers
{
    public static class ModelHtmlHelper
    {
        public static HtmlString HtmlFor(this HtmlHelper htmlHelper, ContactDetail detail)
        {
            if (detail == null)
                return new HtmlString("");

            return new HtmlString(string.Format("<div class=\"label\"></div> <div class=\"value\">{0} {1}</div><div class=\"clear\"></div>",
                detail.Value ?? "", string.IsNullOrEmpty(detail.Notes) ? "" : "(" + detail.Notes + ")"));
        }
    }
}
