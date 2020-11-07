using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Rockend.iStrata.StrataWebsite.Data;
using Rockend.iStrata.StrataWebsite.Helpers;
using Rockend.iStrata.StrataWebsite.Model;
using Rockend.WebAccess.Common.ClientMessage;

namespace Rockend.iStrata.StrataWebsite.Controllers
{
    public class MaintenanceController : BaseController
    {
        //
        // GET: /Maintenance/

        public ActionResult Index()
        {
            if (!ShowMaintenanceTab)
            {
                return RedirectToAction("Logout", "Account");
            }

            MaintenanceModel model = new MaintenanceModel();

            model.WorkOrderSummaries = base.UserSession.MaintenanceWorkOrders;
            if (model.WorkOrderSummaries == null)
                model.WorkOrderSummaries = new List<WorkOrderSummary>();

            model.QuoteSummaries = base.UserSession.MaintenanceQuotes;
            if (model.QuoteSummaries == null)
                model.QuoteSummaries = new List<QuoteSummary>();

            return View(model);
        }

        public ActionResult JobDetails(int JobId, string maintType)
        {
            if (!ShowMaintenanceTab)
            {
                return RedirectToAction("Logout", "Account");
            }

            MaintenanceJobDetailModel model = new MaintenanceJobDetailModel();

            var messenger = new StrataHttpMessenger();
            XMLDataResponse response = messenger.GetJobDetails(model.BuildXmlRequest(JobId, maintType));

            model.Populate(response.Data);
            return View(model);
        }

        // The job id & maint type parameters are just to prevent image caching. keeps the url path unique
        [OutputCache(Location = System.Web.UI.OutputCacheLocation.Client, Duration = 100000)]
        public ActionResult MaintenancePhoto(int index, int jobId, string maintType)
        {
            List<byte[]> imageList = Session["MaintImages"] as List<byte[]>;
            Response.Cache.SetCacheability(System.Web.HttpCacheability.Public);
            Response.Cache.SetLastModified(DateTime.Now.AddMinutes(-1));
            return File(imageList[index], "image/jpeg");
        }

        public bool ShowMaintenanceTab 
        { 
            get 
            {
                return MaintenanceHelper.ShowMaintenanceTab(base.AgentContentStrata, base.UserSession);
            } 
        }
    }
}
