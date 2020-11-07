using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [DataContract]
    public class LevyEntitlement
    {
        [DataMember]
        public string SetName { get; set; }

        [DataMember]
        public string Total { get; set; }

        [DataMember]
        public string EntitlementType { get; set; }

        [DataMember]
        public string Description { get; set; }
    }

    [DataContract]
    public class LotEntitlements
    {
        [DataMember]
        public string LotNumber { get; set; }

        [DataMember]
        public string UnitNumber { get; set; }

        [DataMember]
        public string Owner { get; set; }

        [DataMember]
        public List<Entitlement> EntitlementList { get; set; }
    }

    [DataContract]
    public class Entitlement
    {
        [DataMember]
        public string Name { get; set; }

        [DataMember]
        public string Amount { get; set; }
    }

}
