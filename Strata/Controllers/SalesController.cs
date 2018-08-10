using System.Web.Mvc;

namespace Rockend.iStrata.StrataWebsite.Controllers
{
    public class SalesController : Controller
    {
        //
        // GET: /Sales/

        public ActionResult Index()
        {
            return Redirect("Demo");
        }

        public ActionResult Demo()
        {
            return View();
        }
    }
}
