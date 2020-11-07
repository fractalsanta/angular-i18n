using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.Data.Linq.Mapping;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table]
    [DataContract]
    [Serializable]
    public class WebAccessActivity
    {
        public WebAccessActivity()
        {
            ActionName = string.Empty;
            RequestData = string.Empty;
            RequestTime = DateTime.MinValue;
            RequestID = Guid.NewGuid();
        }

        [Column(Name = "lWebAccessActivityID", IsPrimaryKey = true)]
        [DataMember]
        public int WebAccessActivityID { get; set; }

        [Column(Name = "lOwnersCorporationID")]
        [DataMember]
        public int OwnersCorporationID { get; set; }

        [Column(Name = "lContactID")]
        [DataMember]
        public int ContactID { get; set; }

        [Column(Name = "sActionName")]
        [DataMember]
        public string ActionName { get; set; }

        [Column(Name = "sRequestData")]
        [DataMember]
        public string RequestData { get; set; }

        [Column(Name = "dRequestTime")]
        [DataMember]
        public DateTime RequestTime { get; set; }

        [Column(Name = "lRequestID")]
        [DataMember]
        public Guid RequestID { get; set; }
    }
}
