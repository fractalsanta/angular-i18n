using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.Data;
using System.Data.Linq;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [DataContract]
    public class LotInfo
    {
        [DataMember]
        public int LotID { get; set; }

        [DataMember]
        public int OwnerCorpID { get; set; }

        [DataMember]
        public int ContactID { get; set; }

        [DataMember]
        public int OwnerID { get; set; }

        [DataMember]
        public string OwnerCorpType { get; set; }

        [DataMember]
        public string OwnerCorpName { get; set; }

        [DataMember]
        public string UnitName { get; set; }

        [DataMember]
        public int LotNumber { get; set; }

        [DataMember]
        public string LotAddressLine1 { get; set; }

        [DataMember]
        public string OwnerNameOnTitle { get; set; }

        [DataMember]
        public ContactInfo LotContact { get; set; }

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
