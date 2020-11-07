using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace Rockend.iStrata.StrataCommon.Response
{
    [DataContract]
    public class FileSmartDownloadResponse
    {
        [DataMember]
        public byte[] FileContents { get; set; }

        [DataMember]
        public string FileExtension { get; set; }
    }
}
