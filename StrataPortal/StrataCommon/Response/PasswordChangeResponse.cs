using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace Rockend.iStrata.StrataCommon.Response
{
    [DataContract]
    public class PasswordChangeResponse
    {
        [DataMember]
        public bool Result { get; set; }

        [DataMember]
        public string ResultText { get; set; }
    }
}
