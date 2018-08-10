using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Linq;
using Rockend.WebAccess.Common.Helpers;

namespace Rockend.iStrata.StrataWebsite.Model
{
    public class DocumentRetrievalModel : ModelBase
    {
        public XElement BuildRequest(int libraryId, int folderId, int documentId)
        {
            return new XElement("RequestData",
                    XMLDataHelper.CreateXElement("libraryid", libraryId.ToString()),
                    XMLDataHelper.CreateXElement("folderid", folderId.ToString()),
                    XMLDataHelper.CreateXElement("documentid", documentId.ToString()),
                    XMLDataHelper.CreateXElement("username", base.AgentContentStrata.AgentContent.FileSmartUserName),
                    XMLDataHelper.CreateXElement("password", base.AgentContentStrata.AgentContent.FileSmartPassword));
        }
    }
}