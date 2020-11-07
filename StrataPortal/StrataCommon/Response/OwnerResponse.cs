using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using Rockend.iStrata.StrataCommon.BusinessEntities;

namespace Rockend.iStrata.StrataCommon.Response
{
    [DataContract]
    public class OwnerResponse
    {
        [DataMember]
        public OwnersCorporation OwnersCorporation { get; set; }

        [DataMember]
        public AssociationType AccociationType { get; set; }

        [DataMember]
        public StreetAddress MainOCAddress { get; set; }

        [DataMember]
        public string ManagerPhoto { get; set; }

        [DataMember]
        public string ManagerName { get; set; }

        [DataMember]
        public string ManagerEmail { get; set; }

        [DataMember]
        public List<OwnersLotCorpInfo> Lots { get; set; }

        [DataMember]
        public List<LevyEntitlement> LevyEntitlementList { get; set; }

        [DataMember]
        public List<LotEntitlements> LotEntitlementList { get; set; }

        [DataMember]
        public bool ShowOwnerNameInEntitlements { get; set; }

        [DataMember]
        public bool AllowVoting { get; set; }
    }
}
