using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [DataContract]
    public class ExecutiveInfo
    {
        [DataMember]
        public string Position { get; set; }

        [DataMember]
        public string Lot { get; set; }

        [DataMember]
        public string Unit { get; set; }

        [DataMember]
        public string Name { get; set; }

        [DataMember]
        public string Address { get; set; }

        [DataMember]
        public string Phone { get; set; }

        [DataMember]
        public string LotNumberPrefix { get; set; }

        [DataMember]
        public string LotNumberSuffix { get; set; }

        [DataMember]
        public string UnitNumberPrefix { get; set; }

        [DataMember]
        public string UnitNumberSuffix { get; set; }
    }
}
