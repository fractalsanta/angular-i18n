using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.Data.Linq.Mapping;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table]
    [DataContract]
    [Serializable]
    public class WebAccessConfig
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
    }
}
