using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [DataContract]
    public class OwnersLotCorpInfo
    {
        [DataMember]
        public int LotNumber { get; set; }

        [DataMember]
        public int UnitNumber { get; set; }

        [DataMember]
        public string Owner { get; set; }
    }
}
