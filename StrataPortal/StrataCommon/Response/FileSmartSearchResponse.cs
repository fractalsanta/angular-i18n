using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.Data;

namespace Rockend.iStrata.StrataCommon.Response
{
    [DataContract]
    public class FileSmartSearchResponse
    {
        [DataMember]
        public DataTable DataTable { get; set; }
    }
}
