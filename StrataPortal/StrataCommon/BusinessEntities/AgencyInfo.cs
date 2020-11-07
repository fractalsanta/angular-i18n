using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.Linq.Mapping;
using System.Runtime.Serialization;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table(Name="Agency")]
    [DataContract]
    public class AgencyInfo
    {
        [Column(Name = "lAgencyID")]
        [DataMember]
        public int AgencyID { get; set; }

        [Column(Name = "sClientID")]
        [DataMember]
        public string sClientID { get; set; }

        [Column(Name = "sName")]
        [DataMember]
        public string Name { get; set; }
    }
}
