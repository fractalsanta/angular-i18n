using System;
using System.Data;
using System.Security.Policy;
using Rockend.iStrata.StrataWebsite.Helpers;

namespace Rockend.iStrata.StrataWebsite.Model
{
    public class DocumentModel
    {
        public int DocumentId { get; set; }
        public int FolderId { get; set; }
        public int LibraryId { get; set; }
        public string DocumentType { get; set; }
        public string PlanNumber { get; set; }
        /// <summary>
        /// Description is available from FS v6.5.x (null everywhere else)
        /// </summary>
        public string Description { get; set; }
        public DateTime Date { get; set; }

        public static DocumentModel BuildFromDataRow(DataRow row)
        {
            var model = new DocumentModel();

            model.DocumentId = int.Parse(row["DocumentId"].ToString());
            model.FolderId = int.Parse(row["FolderId"].ToString());
            model.LibraryId = int.Parse(row["LibraryId"].ToString());
            model.DocumentType = row.SafeGetRowString("Doc Type");
            model.PlanNumber = row.SafeGetRowString("Plan Number");
            model.Date = DateTime.Parse(row["Date"].ToString());

            model.Description = row.SafeGetRowString("Portal Description");

            return model;
        }

    }
}