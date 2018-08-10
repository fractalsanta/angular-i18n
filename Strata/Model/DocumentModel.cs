using System;
using System.Data;

namespace Rockend.iStrata.StrataWebsite.Model
{
    public class DocumentModel
    {
        public int DocumentId { get; set; }
        public int FolderId { get; set; }
        public int LibraryId { get; set; }
        public string DocumentType { get; set; }
        public string PlanNumber { get; set; }
        public DateTime Date { get; set; }

        public static DocumentModel BuildFromDataRow(DataRow row)
        {
            DocumentModel model = new DocumentModel();

            model.DocumentId = int.Parse(row["DocumentId"].ToString());
            model.FolderId = int.Parse(row["FolderId"].ToString());
            model.LibraryId = int.Parse(row["LibraryId"].ToString());
            model.DocumentType = row["Doc Type"].ToString();
            model.PlanNumber = row["Plan Number"].ToString();
            model.Date = DateTime.Parse(row["Date"].ToString());

            return model;
        }
    }
}