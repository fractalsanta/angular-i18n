using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Rockend.iStrata.StrataCommon.Response;
using System.Runtime.Serialization;
using System.Data.Linq.Mapping;

namespace Rockend.iStrata.StrataCommon.Request
{
    [DataContract]
    [Table(Name="WebAccessRequest")]
    public class ReportRequest
    {
        [DataMember]
        [Column(Name="lWebAccessRequestID", IsPrimaryKey=true)]
        public int WebAccessRequestID { get; set; }

        [DataMember]
        [Column(Name="bStrataLaunchConfirmed")]
        public string StrataLaunchConfirmed { get; set; }

        [DataMember]
        [Column(Name="lProgressCounter")]
        public int ProgressCounter { get; set; }

        [DataMember]
        [Column(Name="bTaskIsFinished")]
        public string TaskIsFinished { get; set; }

        [DataMember]
        [Column(Name="bErrorsOccured")]
        public string ErrorsOccured { get; set; }

        [DataMember]
        [Column(Name="sMainCommand")]
        public string MainCommand { get; set; }

        [DataMember]
        [Column(Name="sParameter0")]
        public string Parameter0 { get; set; }

        [DataMember]
        [Column(Name="sParameter1")]
        public string Parameter1 { get; set; }

        [DataMember]
        [Column(Name="sParameter2")]
        public string Parameter2 { get; set; }

        [DataMember]
        [Column(Name="sParameter3")]
        public string Parameter3 { get; set; }

        [DataMember]
        [Column(Name="sParameter4")]
        public string Parameter4 { get; set; }

        [DataMember]
        [Column(Name="sParameter5")]
        public string Parameter5 { get; set; }

        [DataMember]
        [Column(Name="sParameter6")]
        public string Parameter6 { get; set; }

        [DataMember]
        [Column(Name="sParameter7")]
        public string Parameter7 { get; set; }

        [DataMember]
        [Column(Name="sParameter8")]
        public string Parameter8 { get; set; }

        [DataMember]
        [Column(Name="sParameter9")]
        public string Parameter9 { get; set; }

        [DataMember]
        [Column(Name="sDataText", UpdateCheck=UpdateCheck.Never)]
        public string DataText { get; set; }

        [DataMember]
        [Column(Name = "sErrorText", UpdateCheck = UpdateCheck.Never)]
        public string ErrorText { get; set; }

        [DataMember]
        [Column(Name = "sPDFFullFilename", UpdateCheck = UpdateCheck.Never)]
        public string PDFFullFilename { get; set; }

        [DataMember]
        [Column(Name="sUsername")]
        public string Username { get; set; }

        [DataMember]
        [Column(Name="dTimeStamp")]
        public DateTime TimeStamp { get; set; }
    }
}
