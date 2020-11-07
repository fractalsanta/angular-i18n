using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Rockend.WebAccess.Common
{
    [DataContract]
    public class ActionCheckResponse
    {
        [DataMember]
        public string AssemblyName { get; set; }

        [DataMember]
        public string ClassName { get; set; }
    }
}
