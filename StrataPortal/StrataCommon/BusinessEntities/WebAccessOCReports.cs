using System;
using System.Data.Linq.Mapping;
using System.Runtime.Serialization;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table]
    [DataContract]
    [Serializable]
    public class WebAccessOCReports
    {
        [Column(Name = "lWebAccessOCReportsID")]
        [DataMember]
        public int WebAccessOCReportsID { get; set; }

        [Column(Name = "lWebAccessReportsID")]
        [DataMember]
        public int WebAccessReportsID {get; set;}

        [Column(Name = "lOwnersCorporationID")]
        [DataMember]
        public int OwnersCorporationID { get; set; }

        [Column(Name = "bOwnerReport")]
        [DataMember]
        public string OwnerReport { get; set; }

        [Column(Name = "bExecComMemberReport")]
        [DataMember]
        public string ExecComMemberReport { get; set; }
    }
}
