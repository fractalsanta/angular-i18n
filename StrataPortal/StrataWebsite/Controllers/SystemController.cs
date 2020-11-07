using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Web.Mvc;
using Agile.Diagnostics.Logging;

namespace Communicator.Web.Controllers
{
    public class SystemController : Controller
    {
        public ActionResult Version()
        {

            try
            {
                return Content(string.Format("version: {0}", typeof(SystemController).Assembly.GetName().Version));
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "GetVersion");
                return Content(ex.Message);
            }
        }
    }
}
