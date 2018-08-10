using System;
using System.Collections.Generic;
using System.Data;
using System.Xml.Linq;
using Rockend.WebAccess.Common.Helpers;
using System.Linq;
using System.Text;

namespace Rockend.iStrata.StrataWebsite.Model
{
    public class DocumentsModel : ModelBase
    {
        public List<DocumentModel> Documents;

        public XElement BuildXmlSearchRequest()
        {
            UserSession session = base.UserSession;

            XElement requestXml = new XElement("RequestData");
            requestXml.Add(XMLDataHelper.CreateXElement("UserType", session.Role == StrataCommon.Role.Owner ? "Owner" : "Executive"));

            if (session.Role == StrataCommon.Role.Owner)
            {
                XElement names = new XElement("OwnerNames");
                session.LotNamesOnTitle.ForEach(n => names.Add(XMLDataHelper.CreateXElement("Name", n)));                
                requestXml.Add(names);
            }

            StringBuilder lotIds = new StringBuilder();

            foreach (DropdownItem item in session.LotNames)
            {
                lotIds.Append(item.Id);
                lotIds.Append(",");
            }

            string lotIdString = lotIds.ToString().TrimEnd(new char [] {','});

            requestXml.Add(XMLDataHelper.CreateXElement("FileSmartUserName", base.AgentContentStrata.AgentContent.FileSmartUserName));
            requestXml.Add(XMLDataHelper.CreateXElement("FileSmartPassword", base.AgentContentStrata.AgentContent.FileSmartPassword));
            requestXml.Add(XMLDataHelper.CreateXElement("LotIds", lotIdString));
            
            string plans = string.Empty;
            session.PlanNumbers.Distinct().ToList().ForEach(p => { plans = string.Concat(plans, "|", p.Trim()); });
            plans = plans.TrimEnd(new[] { '|' }).TrimStart(new[] { '|' });
            requestXml.Add(XMLDataHelper.CreateXElement("PlanNumbersList", plans));
            
            return requestXml;
        }

        internal void BuildDocumentModels(System.Data.DataTable dataTable)
        {
            this.Documents = new List<DocumentModel>();

            if (dataTable == null)
                return;

            foreach (DataRow row in dataTable.Rows)
            {
                this.Documents.Add(DocumentModel.BuildFromDataRow(row));
            }

            this.Documents = this.Documents.OrderByDescending(d => d.Date).ToList();
        }
    }
}