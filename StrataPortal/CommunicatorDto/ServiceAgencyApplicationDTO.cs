using System;
using System.Collections.Generic;
using System.Runtime.Serialization;


namespace CommunicatorDto
{
    [DataContract]
    [Serializable]
    public class ServiceAgencyApplicationDTO
    {
        #region Properties
        
        // Service data
        [DataMember]
        public int ServiceAgencyApplicationId { get; set; }

        [DataMember]
        public int ServiceId { get; set; }

        [DataMember]
        public bool IsActive { get; set; }

        // Agency Application data
        [DataMember]
        public int AgencyApplicationId { get; set; }

        [DataMember]
        public int ApplicationKey { get; set; }

        [DataMember]
        public string SerialNumber { get; set; }

        [DataMember]
        public string Description { get; set; }

        #endregion
    }
}
