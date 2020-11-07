using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using Rockend.iStrata.StrataCommon.BusinessEntities;

namespace Rockend.iStrata.StrataCommon.Response
{
    [DataContract]
    public class ExecutiveResponse
    {
        [DataMember]
        public ExecutiveMember ExecutiveMember { get; set; }

        [DataMember]
        public ExecutivePosition ExecutivePosition { get; set; }

        [DataMember]
        public Contact Contact { get; set; }

        [DataMember]
        public Lot Lot { get; set; }

        [DataMember]
        public OwnersCorporation OwnersCorporation { get; set; }

        [DataMember]
        public AssociationType AssociationType { get; set; }

        [DataMember]
        public StreetAddress MainOCAddress { get; set; }

        [DataMember]
        public List<ExecutiveInfo> ExecutiveInfo { get; set; }
    }
}
