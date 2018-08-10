using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Rockend.iStrata.StrataWebsite.Helpers;
using Rockend.iStrata.StrataCommon.Response;
using Rockend.iStrata.StrataWebsite.Model;
using Common.Web.Server;
using Rockend.iStrata.StrataCommon;

namespace Rockend.iStrata.StrataWebsite.Controllers
{
    public class DocumentsController : BaseController
    {
        //
        // GET: /DocsOnPortal/
        [AuthorizeStrata(Users = RoleInfo.RoleNameOwnerAndExec)]
        public ActionResult Index()
        {
            if (!base.UserSession.HasFileSmartEnabled)
                return RedirectToAction("Logout", "Account");

            var messenger = new StrataHttpMessenger();
            DocumentsModel model = new DocumentsModel();

            FileSmartSearchResponse response = messenger.FSDocumentSearch(model.BuildXmlSearchRequest());

            model.BuildDocumentModels(response.DataTable);

            return View(model);
        }

        [AuthorizeStrata(Users = RoleInfo.RoleNameOwnerAndExec)]
        public ActionResult GetDocument(int folderId, int libraryId, int documentId)
        {
            if (!base.UserSession.HasFileSmartEnabled)
                return RedirectToAction("Logout", "Account");

            var messenger = new StrataHttpMessenger();
            DocumentRetrievalModel model = new DocumentRetrievalModel();
            FileSmartDownloadResponse response = messenger.FSGetDocument(model.BuildRequest(libraryId, folderId, documentId));

            var randomFileName = IOHelper.GetRandomFileName();
            var filename = string.Format("{0}.{1}", randomFileName, response.FileExtension);

            if (response.FileExtension != null && response.FileExtension.ToLower().Equals("pdf"))
            {
                return File(response.FileContents, "application/pdf", filename);
            }
            else
            {
                return File(response.FileContents, "application/octet-stream", filename);
            }
        }
    }
}
