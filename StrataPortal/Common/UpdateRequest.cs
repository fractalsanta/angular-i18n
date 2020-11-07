using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Rockend.WebAccess.Common
{
    [DataContract]
    public class UpdateRequest
    {
        [DataMember]
        public string ApplicationCode { get; set; }

        [DataMember]
        public string Identifier { get; set; }

        [DataMember]
        public DateTime UpdatedAt { get; set; }

        [DataMember]
        public string Note { get; set; }
    }
}
