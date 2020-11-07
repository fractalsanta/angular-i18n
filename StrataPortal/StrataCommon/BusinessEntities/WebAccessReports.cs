using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.Linq.Mapping;
using System.Runtime.Serialization;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table]
    [DataContract]
    [Serializable]
    public class WebAccessReports
    {
        public override string ToString()
        {
            return string.Format("[{0}] {1}", WebAccessReportsID, ReportName);
        }

        [Column(Name = "lWebAccessReportsID")]
        [DataMember]
        public int WebAccessReportsID { get; set; }

        [Column(Name = "bIsAllowed")]
        [DataMember]
        public string IsAllowed { get; set; }

        [Column(Name = "bIsOwnerCorpSpecific")]
        [DataMember]
        public string IsOwnerCorpSpecific { get; set; }

        [Column(Name="bUseForExecComMembers")]
        [DataMember]
        public string UseForExecComMembers { get; set; }

        [Column(Name="bUseForOwners")]
        [DataMember]
        public string UseForOwners { get; set; }

        [Column(Name="bUseTerminology")]
        [DataMember]
        public string UseTerminology { get; set; }

        [Column(Name="sApprovedOwnerCorpIDs")]
        [DataMember]
        public string ApprovedOwnerCorpIDs { get; set; }

        [Column(Name="sInternalName")]
        [DataMember]
        public string InternalName { get; set; }

        [Column(Name="sParameters")]
        [DataMember]
        public string ReportParameters { get; set; }

        [Column(Name="sReportName")]
        [DataMember]
        public string ReportName { get; set; }

    }
}
