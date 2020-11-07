using System;
using System.Runtime.Serialization;

namespace CommunicatorDto
{
    [DataContract]
    [Serializable]
    public class AgencyApplicationDTO
    {
        #region Properties
        [DataMember]
        public int AgencyApplicationId { get; set; }

        [DataMember]
        public int? AgencyAccessId { get; set; }

        [DataMember]
        public string ApplicationCode { get; set; }

        [DataMember]
        public int? ApplicationKey { get; set; }

        [DataMember]
        public string SerialNumber { get; set; }

        [DataMember]
        public string Description { get; set; }

        [DataMember]
        public DateTime? Listened { get; set; }

        [DataMember]
        public AgencyAccessDTO AgencyAccess { get; set; }

        //private EntitySet<Activation> _Activation;
        //private EntitySet<ServiceAgencyApplication> _ServiceAgencyApplication;
        //private EntitySet<Rmh_WebRequest> _Rmh_WebRequest;
        //private EntityRef<AgencyAccess> _AgencyAccess;
        
        #endregion
    }
}
