using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CommunicatorDto
{
    [DataContract]
    [Serializable]
    public class AgencyAccessDTO
    {
        public override string ToString()
        {
            return string.Format("[{0}] {1} | {2}", AgencyAccessId, ClientCode, Name);
        }

        [DataMember]
        public int AgencyAccessId { get; set; }

        [DataMember]
        public string ClientCode { get; set; }

        [DataMember]
        public Guid AgencyGuid { get; set; }

        [DataMember]
        public string Name { get; set; }
    }
}
