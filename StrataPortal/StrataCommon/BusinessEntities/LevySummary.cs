using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Text;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table(Name = "tblLevySummary")]
    public class LevySummary
    {
        [Column(Name = "lLevySummaryID", IsPrimaryKey = true)]
        public int LevySummaryID { get; set; }

        [Column(Name = "mAdminAmount")]
        public decimal AdminAmount { get; set; }

        [Column(Name = "mAdminGST")]
        public decimal AdminGST { get; set; }

        [Column(Name = "mSinkAmount")]
        public decimal SinkAmount { get; set; }

        [Column(Name = "mSinkGST")]
        public decimal SinkGST { get; set; }

        [Column(Name = "lOtherFundID")]
        public int? OtherFundID { get; set; }

        [Column(Name = "mOtherAmount")]
        public decimal OtherAmount { get; set; }

        [Column(Name = "mOtherGST")]
        public decimal OtherGST { get; set; }

        [Column(Name = "lUnitEntitlementSetID")]
        public int? UnitEntitlementSetID { get; set; }

        [Column(Name = "lOwnersCorporationID")]
        public int OwnersCorporationID { get; set; }

        [Column(Name = "lNumberOfLevies")]
        public int NumberOfLevies { get; set; }

        [Column(Name = "dDatePosted")]
        public DateTime DatePosted { get; set; }

        [Column(Name = "sImportKey")]
        public string ImportKey { get; set; }

        [Column(Name = "sLevyType")]
        public string LevyType { get; set; }

        [Column(Name = "sDescription")]
        public string Description { get; set; }

        [Column(Name = "sStatus")]
        public string Status { get; set; }

        [Column(Name = "dLevyDetermination")]
        public DateTime LevyDetermination { get; set; }

        [Column(Name = "mAdminDetermined")]
        public decimal AdminDetermined { get; set; }

        [Column(Name = "mSinkingDetermined")]
        public decimal SinkingDetermined { get; set; }

        [Column(Name = "sReasonCancelled")]
        public string ReasonCancelled { get; set; }

        [Column(Name = "dTimePosted")]
        public DateTime TimePosted { get; set; }

        [Column(Name = "mLevyDiscount")]
        public decimal LevyDiscount { get; set; }

        [Column(Name = "lGroupCodeID")]
        public int GroupCodeID { get; set; }
    }
}
