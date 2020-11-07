using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.Data.Linq;
using System.Data;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [DataContract]
    public class ExecutiveDescription
    {
        [DataMember]
        public int ExecMemberID { get; set; }

        [DataMember]
        public string Name { get; set; }

        [DataMember]
        public string Position { get; set; }

        [DataMember]
        public bool DoesExecMemberOwnTheLot { get; set; }

        [DataMember]
        public int LotID { get; set; }

        [DataMember]
        public int ContactID { get; set; }

    }
}

