using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Diagnostics;
using System.Runtime.Serialization;
using Rockend.iStrata.StrataCommon.Request;

namespace Rockend.iStrata.StrataCommon.Response
{
    [Serializable]
    public class StrataMasterNotReadyException : Exception
    {
        public StrataMasterNotReadyException() : base() { }
        public StrataMasterNotReadyException(string message) : base(message) { }
        public StrataMasterNotReadyException(SerializationInfo info, StreamingContext context) : base(info, context) { }
        public StrataMasterNotReadyException(string message, Exception innerException) : base(message, innerException) { }
    }

    [DataContract]
    public class ReportResponse
    {
        #region Properties
        [DataMember]
        public Byte[] pdfFile { get; set; }
        #endregion
    }
}
