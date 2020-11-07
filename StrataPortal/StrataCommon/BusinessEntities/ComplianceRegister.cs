using System;
using System.Data.Linq.Mapping;
namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table(Name="ComplianceRegister")]
    public partial class ComplianceRegister
    {
        [Column(Name = "lComplianceRegisterID", IsPrimaryKey = true)]
        public int ComplianceRegisterID { get; set; }

        [Column(Name = "lOwnersCorporationID")]
        public int OwnersCorporationID { get; set; }

        [Column(Name = "lCreditorID")]
        public int? CreditorID { get; set; }

        [Column(Name = "lComplianceRegisterTypeID")]
        public int ComplianceRegisterTypeID { get; set; }

        [Column(Name = "sInspectionRequired")]
        public string InspectionRequired { get; set; }

        [Column(Name = "dLastInspection")]
        public DateTime LastInspection { get; set; }

        [Column(Name = "dInspectionDue")]
        public DateTime InspectionDue { get; set; }

        [Column(Name = "sContactName")]
        public string ContactName { get; set; }

        [Column(Name = "sMobile")]
        public string Mobile { get; set; }

        [Column(Name = "sTelephone1")]
        public string Telephone1 { get; set; }

        [Column(Name = "sTelephone2")]
        public string Telephone2 { get; set; }

        [Column(Name = "sNotes")]
        public string Notes { get; set; }

        // This is added in V6.5 if you need it, create a 65 model and handle appropriately
        //[Column(Name = "sMessage")]
        //public string Message { get; set; }

    }
}
