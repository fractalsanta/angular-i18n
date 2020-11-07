using System;
using System.Collections.Generic;
using System.Data.Linq;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.Data.Linq.Mapping;
using Rockend.iStrata.StrataCommon.Helpers;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table]
    [DataContract]
    [Serializable]
    public class AuditTrail
    {
        [Column(Name = "lAuditTrailID", IsPrimaryKey = true)]
        [DataMember]
        public int AuditTrailID { get; set; }

        [Column(Name="dChange")]
        [DataMember]
        public DateTime DateChanged { get; set; }

        [Column(Name = "lUserID")]
        [DataMember]
        public int? UserID { get; set; }

        [Column(Name = "sTable")]
        [DataMember]
        public string Table { get; set; }

        [Column(Name = "sField")]
        [DataMember]
        public string Field { get; set; }

        [Column(Name = "lRecordID")]
        [DataMember]
        public int RecordID { get; set; }

        [Column(Name = "sOldValue")]
        [DataMember]
        public string OldValue { get; set; }

        [Column(Name = "sNewValue")]
        [DataMember]
        public string NewValue { get; set; }

        [Column(Name = "sAction")]
        [DataMember]
        public string Action { get; set; }

        [Column(Name ="lOwnersCorporationID")]
        [DataMember]
        public int OwnersCorporationID { get; set; }

        [Column(Name = "sOldGST")]
        [DataMember]
        public string OldGST { get; set; }

        [Column(Name = "sNewGST")]
        [DataMember]
        public string NewGST { get; set; }

        [Column(Name = "sFurtherInfo")]
        [DataMember]
        public string FurtherInfo { get; set; }

    }
}
