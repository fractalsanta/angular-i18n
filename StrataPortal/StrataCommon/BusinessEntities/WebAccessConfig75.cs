using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.Data.Linq.Mapping;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table(Name="WebAccessConfig")]
    [DataContract]
    [Serializable]
    public class WebAccessConfig75
    {
        [Column(Name = "bShowOwnerName")]
        [DataMember]
        public string ShowOwnerName { get; set; }

        [Column(Name = "bRMShowExecComm")]
        [DataMember]
        public string RMShowExecComm { get; set; }

        [Column(Name = "bRMShowOwner")]
        [DataMember]
        public string RMShowOwner { get; set; }


        #region new fields from V7.5

        [DataMember]
        [Column(Name = "bShowAdditionalDetails")]
        public string ShowAdditionalDetailsValue { get; set; }

        [IgnoreDataMember]
        public bool ShowAdditionalDetails { get { return (!string.IsNullOrEmpty(ShowAdditionalDetailsValue)) && ShowAdditionalDetailsValue.Equals("Y", StringComparison.InvariantCultureIgnoreCase); } }

        [DataMember]
        [Column(Name = "bShowAdditionalDetailsNotes")]
        public string ShowAdditionalDetailsNotesValue { get; set; }

        [IgnoreDataMember]
        public bool ShowAdditionalDetailsNotes { get { return (!string.IsNullOrEmpty(ShowAdditionalDetailsNotesValue)) && ShowAdditionalDetailsNotesValue.Equals("Y", StringComparison.InvariantCultureIgnoreCase); } }
 
        #endregion
    }
}
