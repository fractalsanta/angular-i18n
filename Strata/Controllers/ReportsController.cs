using System;
using System.IO;
using System.Linq;
using System.Web.Mvc;
using Agile.Diagnostics.Logging;
using Common.Web.Server;
using Rockend.iStrata.StrataCommon;
using Rockend.iStrata.StrataCommon.Request;
using Rockend.iStrata.StrataCommon.Response;
using Rockend.iStrata.StrataWebsite.Helpers;
using Rockend.iStrata.StrataWebsite.Model;
using System.Collections.Generic;

namespace Rockend.iStrata.StrataWebsite.Controllers
{
    /// <summary>
    /// Controller for the report parameters and display pages.
    /// </summary>
    [AuthorizeStrata(Users = RoleInfo.RoleNameOwnerAndExec)]
    public class ReportsController : BaseController
    {
        /// <summary>
        /// Downloads the specified file.
        /// </summary>
        /// <param name="fileName">Friendly name of the file that the client will use locally.</param>
        /// <param name="reference">The reference of the file on the server side.</param>
        /// <returns>BinaryFileResult for the file.</returns>
        public ActionResult Download(string fileName, string reference)
        {
            var result = new BinaryFileResult();
            result.ContentType = "application/pdf";
            result.FileName = fileName;
            result.LocalPath = Session.GetFilePath("Strata", reference);
            result.IsAttachment = true;
            return result;
        }

        [HttpPost]
        public ActionResult StartGetReport(string notUsed)
        {
            Logger.Debug("StartGetReport...do nothing: {0}", notUsed);
            Response.AddHeader("Content-Type", "application/json; charset=utf-8");

            return new JsonResult
            {
                Data = new { success = true }
            };
        }

        public ActionResult Index(int index)
        {
            var lot = UserSession.LotNames[index];
            
            ReportsModel model = new ReportsModel();
            
            model.PlanId = lot.PlanId;
            model.CurrentLotIndex = index;
            model.OwnerId = UserSession.LotOwners[index].Id;

            return View(model);
        }

        public ActionResult ReportParameters(string reportName, int planId)
        {
            ReportParametersModel rpm = new ReportParametersModel(base.Messenger, base.UserSession, reportName, planId);
            return View(rpm);
        }

        // These action names match the individual report names from the strata db

        #region rptFinancialPosition


        private void CheckModelStateError()
        {
            var errorMessage = TempData["ErrorMessage"] as string;
            if (!string.IsNullOrEmpty(errorMessage))
                ModelState.AddModelError("error", errorMessage);
        }

        #endregion

        #region rptFinancialPerformance

        [AcceptVerbs(HttpVerbs.Get)]
        public ActionResult rptFinancialPerformanceRun(int planId, int comparativePeriod)
        {
            Logger.Debug("rptFinancialPerformanceRun({0}, {1})", planId, comparativePeriod);

            UserSession.EnsureReportAccess("rptFinancialPerformance", planId);
            var request = new ReportRequest
            {
                MainCommand = "rptFinancialPerformance",
                Parameter0 = "1",
                Parameter1 = planId.ToString(),
                Parameter2 = comparativePeriod.ToString()
            };
            return HandleReportResponse(GetReport(request));
        }

        #endregion

        #region rptBudget

        [AcceptVerbs(HttpVerbs.Get)]
        public ActionResult rptBudgetRun(int budgetIndex, int planId)
        {
            Logger.Debug("rptBudgetRun({0})", budgetIndex);

            if (UserSession.Budgets == null)
            {
                BudgetReportResponse response = Messenger.GetBudgetInfo(UserSession.OwnersCorpNames.Select(d => d.Id));
                UserSession.Budgets = ReportHelper.CreateBudgetList(response.BudgetList, UserSession.OwnersCorpNames);
            }

            List<BudgetDropdownItem> tmpList = new List<BudgetDropdownItem>();
            tmpList.AddRange(UserSession.Budgets);
            tmpList.RemoveAll(b => b.OwnersCorpId != planId);

            var request = new ReportRequest
            {
                MainCommand = "rptBudget",
                Parameter0 = "0",
                Parameter1 = tmpList[budgetIndex].OwnersCorpId.ToString(),
                Parameter2 = tmpList[budgetIndex].Id.ToString()
            };

            UserSession.EnsureReportAccess("rptBudget", tmpList[budgetIndex].OwnersCorpId);
            
            return HandleReportResponse(GetReport(request));
        }

        #endregion

        #region rptCurrentOwnerAccount


        [AcceptVerbs(HttpVerbs.Get)]
        public ActionResult rptCurrentOwnerAccountRun(int planId, int ownerId)
        {
            Logger.Debug("rptCurrentOwnerAccountRun({0})", planId);

            if (UserSession.LotOwners.FirstOrDefault(l => l.Id == ownerId) == null)
            {
                return null;
            }
            
            UserSession.EnsureReportAccess("rptCurrentOwnerAccount", planId);

            var request = new ReportRequest
            {
                MainCommand = "rptCurrentOwnerAccount",
                Parameter0 = ownerId.ToString(),
                Parameter1 = planId.ToString()
            };

            return HandleReportResponse(GetReport(request));
        }

        #endregion

        #region rptInvestments

        [AcceptVerbs(HttpVerbs.Get)]
        public ActionResult GetParameterlessReport(string reportName, int planId)
        {
            UserSession.EnsureReportAccess(reportName, planId);

            var request = new ReportRequest
            {
                MainCommand = reportName,
                Parameter0 = "1",
                Parameter1 = planId.ToString()
            };
            return HandleReportResponse(GetReport(request));
        }

        #endregion
        
        private ActionResult HandleReportResponse(ReportResponse response)
        {
            if (response == null || response.pdfFile == null || response.pdfFile.Length == 0)
            {
                string url = string.Empty;

                if (Request != null && Request.UrlReferrer != null)
                {
                    url = string.Concat("http://", Request.UrlReferrer.Authority, Request.UrlReferrer.LocalPath);

                    if (string.IsNullOrWhiteSpace(Request.UrlReferrer.Query))
                    {
                        url = string.Concat(url, "?found=false");
                    }
                    else
                    {
                        url = string.Concat(url, Request.UrlReferrer.Query, "&found=false");
                    }
                    return Redirect(url);
                }

                return RedirectToAction("Index", "Reports", new { found = "false", index = 0 });
            }

            if (response == null)
            {
                Logger.Warning("Failed to retrieve report");
                if (Request == null || Request.UrlReferrer == null)
                    return RedirectToAction("Logout", "Account");

                return Redirect(Request.UrlReferrer.ToString());
            }

            return GetFileStreamResult(response);
        }

        private ReportResponse GetReport(ReportRequest reportRequest)
        {
            try
            {
                var processResponse = Messenger.GetReport(reportRequest);

                if (processResponse == null || processResponse.pdfFile == null)
                {
                    Logger.Warning("Failed to retrieve report");
                    return null;
                }
                return processResponse;
            }
            catch (Exception ex)
            {
                Logger.Error(ex);
                ModelState.AddModelError("error", ex.Message);
                ViewBag.ErrorMessage = ex.Message;
                TempData["ErrorMessage"] = ex.Message;
                return null;
            }
        }

        private FileStreamResult GetFileStreamResult(ReportResponse getResponse)
        {
            var randomFileName = IOHelper.GetRandomFileName();
            var filename = string.Format("{0}.pdf", randomFileName);

            Response.AddHeader("Content-Length", getResponse.pdfFile.Length.ToString());
            Response.AddHeader("Content-Disposition", "attachment; filename= " + Server.HtmlEncode(filename));

            var stream = new MemoryStream(getResponse.pdfFile);
            var result = new FileStreamResult(stream, "application/pdf");
            return result;
        }
    }
}
