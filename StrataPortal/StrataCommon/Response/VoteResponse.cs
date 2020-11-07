using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Rockend.iStrata.StrataCommon.Response
{
    [DataContract]
    [Serializable]
    public class VoteResponse
    {
        [DataMember]
        public DateTime VotePlaced { get; set; }
    }
}
