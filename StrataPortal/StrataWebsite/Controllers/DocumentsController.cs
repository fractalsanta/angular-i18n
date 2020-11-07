using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Rockend.Azure.Helpers;
using Rockend.iStrata.StrataWebsite.Helpers;
using Rockend.iStrata.StrataCommon.Response;
using Rockend.iStrata.StrataWebsite.Model;
using Rockend.iStrata.StrataCommon;
using Agile.Diagnostics.Loggers;
using Agile.Diagnostics.Logging;
using Rockend.Web;

namespace Rockend.iStrata.StrataWebsite.Controllers
{
    public class DocumentsController : BaseController
    {
        //
        // GET: /DocsOnPortal/
        [AuthorizeStrata(Users = RoleInfo.RoleNameOwnerAndExec)]
        public ActionResult Index()
        {
            if (base.UserSession == null || !base.UserSession.HasFileSmartEnabled)
            {
                return RedirectToAction("Logout", "Account");
            }                

            var messenger = new StrataHttpMessenger();
            DocumentsModel model = new DocumentsModel();

            FileSmartSearchResponse response = new FileSmartSearchResponse();

            response = messenger.FSDocumentSearch(model.BuildXmlSearchRequest());                

            model.BuildDocumentModels(response.DataTable);

            return View(model);
        }

        [AuthorizeStrata(Users = RoleInfo.RoleNameOwnerAndExec)]
        [FileDownload()]
        public ActionResult GetDocument(int folderId, int libraryId, int documentId)
        {
            if (base.UserSession == null || !base.UserSession.HasFileSmartEnabled)
            {
                return RedirectToAction("Logout", "Account");
            }              

            try
            {
                var messenger = new StrataHttpMessenger();
                DocumentRetrievalModel model = new DocumentRetrievalModel();
                FileSmartDownloadResponse response = messenger.FSGetDocument(model.BuildRequest(libraryId, folderId, documentId));              

                var randomFileName = IOHelper.GetRandomFileName();
                var filename = string.Format("{0}.{1}", randomFileName, response.FileExtension);

                if (response.FileContents != null)
                {
                    if (response.FileExtension != null && response.FileExtension.ToLower().Equals("pdf"))
                    {
                        return File(response.FileContents, "application/pdf", filename);
                    }
                    else
                    {
                        return File(response.FileContents, "application/octet-stream", filename);
                    }
                }
                else
                {
                    // Checking for the case that file is returned empty (reason could be time out because file is too big), message could be changed later. 

                    Logger.Warning("Documents/GetDocument");
                    Logger.Error("File download failed!");

                    TempData["Error"] = true;
                    TempData["ErrorMessage"] = "The file download was unsuccessful. Please try again later.";

                    return RedirectToAction("Index");
                }
            }
            catch (Exception ex)
            {
                Logger.Warning("Documents/GetDocument");

                if (ex != null)
                {
                    Logger.Error(ex);                    
                }

                TempData["Error"] = true;
                TempData["ErrorMessage"] = "The file download was unsuccessful. Please try again later.";

                return RedirectToAction("Index");
            }
        }
    }
}
