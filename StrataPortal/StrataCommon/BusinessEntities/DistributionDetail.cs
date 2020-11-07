using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    /// <summary>
    /// Details for the Document Distribution section on the portal
    /// Can be derived from Contact OR ContactDetail
    /// </summary>
    [DataContract]
    public class DistributionDetail
    {
        public override string ToString()
        {
            return string.Format("Type:{0} Name:{1} DeliveryType:{2} Email:{3} IsPrimaryContact:{4}"
                , Type, Name, DeliveryType, Email, IsPrimaryContact);
        }

        /// <summary>
        /// Levies, Meetings or Correspondence
        /// </summary>
        [DataMember]
        public string Type { get; set; }

        [DataMember]
        public string Name { get; set; }

        [DataMember]
        public int Order { get; set; }

        /// <summary>
        /// P (print) or E (email)
        /// </summary>
        [DataMember]
        public string DeliveryType { get; set; }

        /// <summary>
        /// Null unless DeliveryType is email
        /// </summary>
        [DataMember]
        public string Email { get; set; }

        [DataMember]
        public bool IsPrimaryContact { get; set; }


        [DataMember]
        public int ContactId { get; set; }



        public static DistributionDetail Build(string type
            , string name
            , string email
            , int contactId
            , string deliveryType = DeliveryTypes.Print
            , bool isPrimaryContact = false)
	    {
	        var detail = new DistributionDetail
	        {
	            Type = type,
                Name = name,
                ContactId = contactId,
                DeliveryType = deliveryType,
                Order = isPrimaryContact ? 0 : 1, // always 0 or 1 for now
                IsPrimaryContact = isPrimaryContact,
                Email = (deliveryType == DeliveryTypes.Print) 
                    ? null
                    : email
	        };
	        return detail;
	    }
    }

    public static class DistributionDetailTypes
    {
        public const string Levies = "Levies";
        public const string Meetings = "Meetings";
        public const string Correspondence = "Correspondence";
    }


    public static class DeliveryTypes
    {
        public const string Email = "E";
        public const string Print = "P";
    }
}
