using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Runtime.Serialization;

namespace Rockend.WebAccess.Common.ClientMessage
{
    [DataContract]
    public class DownloadFileResponse
    {
        /// <summary>
        /// ctor
        /// </summary>
        public DownloadFileResponse()
        {            
        }

        [DataMember]
        public byte[] FileContent { get; set; }

        [DataMember]
        public string FileName { get; set; }

        [DataMember]
        public bool Success { get; set; }

        [DataMember]
        public Exception Error { get; set; }
        
        public static DownloadFileResponse BuildFailed(string fileName, Exception ex)
        {
            return new DownloadFileResponse 
            {
                FileName = fileName,
                Success = false,
                Error = ex
            };
        }

        public DownloadFileResponse(string filename, byte[] content)
        {
            FileName = filename;
            FileContent = content;
            Success = (content != null);
        }
    }
}
