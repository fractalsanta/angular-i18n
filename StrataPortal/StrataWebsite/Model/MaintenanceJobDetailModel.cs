using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.SessionState;
using System.Xml.Linq;
using Agile.Diagnostics.Logging;
using Rockend.iStrata.StrataWebsite.Data;
using Rockend.iStrata.StrataWebsite.Helpers;
using Rockend.WebAccess.Common.Helpers;

namespace Rockend.iStrata.StrataWebsite.Model
{
    public class MaintenanceJobDetailModel : ModelBase
    {
        public string StatusHeader { get; set; }
        public int OwnersCorporationID { get; set; }
        public string PlanNumber { get; set; }
        public string DiarySubject { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; }
        public int OrderNumber { get; set; }
        public string TradieName { get; set; }
        public decimal AmountQuoted { get; set; }
        public string ReportedBy { get; set; }
        public DateTime DateReported { get; set; }
        public decimal AmountInvoiced { get; set; }
        public string JobNumber { get; set; }
        public string Manager { get; set; }
        public List<Invoice> Invoices { get; set; }
        public int ImageCount { get; set; }
        public bool IsQuote { get; set; }
        public List<string> ImageDescriptions;
        public string MaintType { get; set; }
        public int JobId { get; set; }
        
        public string StatusString
        {
            get
            {
                if (StatusHeader == "Work Order")
                {
                    return MaintenanceHelper.GetWorkOrderStatus(Status);
                }
                else if (StatusHeader == "Quote")
                {
                    return MaintenanceHelper.GetQuoteStatus(Status);
                }
                return Status;
            }
        }

        internal XElement BuildXmlRequest(int workOrderId, string jobType)
        {
            XElement request = new XElement("Request");
            request.Add(XMLDataHelper.CreateXElement("JobId", workOrderId.ToString()));
            request.Add(XMLDataHelper.CreateXElement("maintType", jobType.ToString()));
            request.Add(XMLDataHelper.CreateXElement("includeImages", base.AgentContentStrata.ShowMaintenanceImages.ToString()));

            this.JobId = workOrderId;
            this.MaintType = jobType;

            return request;
        }

        internal void Populate(string xml)
        {
            XElement xmlElement = XElement.Parse(xml);
            StatusHeader = XMLDataHelper.GetValueFromXml<string>(xmlElement, "StatusHeader");
            OwnersCorporationID = XMLDataHelper.GetValueFromXml<int>(xmlElement, "OwnersCorporationID");
            PlanNumber = XMLDataHelper.GetValueFromXml<string>(xmlElement, "PlanNumber");
            DiarySubject = XMLDataHelper.GetValueFromXml<string>(xmlElement, "DiarySubject");
            OrderDate = XMLDataHelper.GetValueFromXml<DateTime>(xmlElement, "OrderDate");
            Status = XMLDataHelper.GetValueFromXml<string>(xmlElement, "Status");
            OrderNumber = XMLDataHelper.GetValueFromXml<int>(xmlElement, "OrderNumber");
            TradieName = XMLDataHelper.GetValueFromXml<string>(xmlElement, "TradieName");
            AmountQuoted = XMLDataHelper.GetValueFromXml<decimal>(xmlElement, "AmountQuoted");
            ReportedBy = XMLDataHelper.GetValueFromXml<string>(xmlElement, "ReportedBy");
            DateReported = XMLDataHelper.GetValueFromXml<DateTime>(xmlElement, "DateReported");
            AmountInvoiced = XMLDataHelper.GetValueFromXml<decimal>(xmlElement, "AmountInvoiced");
            JobNumber = XMLDataHelper.GetValueFromXml<string>(xmlElement, "JobNumber");
            Manager = XMLDataHelper.GetValueFromXml<string>(xmlElement, "Manager");
            Invoices = GetInvoices(xmlElement.Element("Invoices")); // XMLDataHelper.GetValueFromXml<string>(xmlElement, "StatusHeader");
            IsQuote = XMLDataHelper.GetValueFromXml<string>(xmlElement, "JobType") == "Quote";

            GetImages(xmlElement.Element("Images"));
        }

        private void GetImages(XElement xml)
        {
            var images = xml.Elements("Image");

            List<byte[]> maintImages = new List<byte[]>();
            ImageDescriptions = new List<string>();

            foreach (XElement imageElement in images)
            {
                try
                {
                    string desc = XMLDataHelper.GetValueFromXml<string>(imageElement, "Description");
                    XElement imgData = imageElement.Element("Picture");
                    if (imgData == null) continue;

                    maintImages.Add(Convert.FromBase64String(imgData.Value));
                    ImageDescriptions.Add(desc);

                    HttpContext.Current.Session["MaintImages"] = maintImages;
                }
                catch (Exception ex)
                {
                    Logger.Error(ex, "Error getting image form Xml");
                }
            }

            ImageCount = maintImages.Count;             
        }

        

        private List<Invoice> GetInvoices(XElement xml)
        {
            if (xml == null)
            {
                return new List<Invoice>();
            }

            List<Invoice> invoices = new List<Invoice>();

            foreach (XElement invoiceElement in xml.Elements("Invoice"))
            {
                invoices.Add(new Invoice(XMLDataHelper.GetValueFromXml<string>(invoiceElement, "RefNumber"),
                    XMLDataHelper.GetValueFromXml<string>(invoiceElement, "Description")));
            }

            return invoices;
        }
    }

    public class Invoice
    {
        public Invoice(string refNumber, string desc)
        {
            RefNumber = refNumber;
            Description = desc;
        }

        public string RefNumber { get; set; }
        public string Description { get; set; }
    }
}