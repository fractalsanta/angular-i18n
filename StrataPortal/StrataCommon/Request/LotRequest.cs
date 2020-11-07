using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Rockend.iStrata.StrataCommon.Response;
using System.Runtime.Serialization;

namespace Rockend.iStrata.StrataCommon.Request
{
    [DataContract]
    public class LotRequest
    {
        [DataMember]
        public int LotID { get; set; }

        [DataMember]
        public bool IsGeneral { get; set; }

        [DataMember]
        public bool IsAgent { get; set; }

        [DataMember]
        public bool IsLevy { get; set; }
    }
}
