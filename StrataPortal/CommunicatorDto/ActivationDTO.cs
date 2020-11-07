using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace CommunicatorDto
{
    /// <summary>
    /// MACHINE/AppKey activation
    /// </summary>
    [DataContract]
    [Serializable]
    public class ActivationDTO
    {
        #region Properties
        [DataMember]
        public int ActivationId { get; set; }

        [DataMember]
        public int AgencyApplicationId { get; set; }

        [DataMember]
        public string MachineName { get; set; }

        [DataMember]
        public bool IsActive { get; set; }

        [DataMember]
        public DateTime Created { get; set; }

        [DataMember]
        public DateTime? Updated { get; set; }

        [DataMember]
        public int ApplicationKey { get; set; }
        #endregion
    }
}
