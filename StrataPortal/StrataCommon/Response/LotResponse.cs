using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using Rockend.iStrata.StrataCommon.BusinessEntities;

namespace Rockend.iStrata.StrataCommon.Response
{
    [DataContract]
    public class LotResponse
    {
        /// <summary>
        /// Used by all versions less than 7.5.
        /// CAREFUL that you always use the same one!
        /// </summary>
        [DataMember]
        public Lot Lot { get; set; }

        /// <summary>
        /// Used by all versions 7.5 and greater
        /// </summary>
        [DataMember]
        public Lot75 Lot75 { get; set; }

        /// <summary>
        /// Safer way of using Lot info
        /// </summary>
        public ILot LotDetail {
            get { return Lot ?? Lot75 as ILot; }
        }

        [DataMember]
        public OwnersCorporation OwnerCorp { get; set; }

        [DataMember]
        public AssociationType AssociationType { get; set; }

        /// <summary>
        /// Used by all versions less than 7.5.
        /// CAREFUL that you always use the same one!
        /// </summary>
        [DataMember]
        public Owner Owner { get; set; }

        /// <summary>
        /// Used by all versions 7.5 and greater
        /// </summary>
        [DataMember]
        public Owner75 Owner75 { get; set; }

        /// <summary>
        /// Safer way of using Owner info
        /// </summary>
        public IOwner OwnerDetail {
            get { return Owner ?? Owner75 as IOwner; }
        }


        [DataMember]
        public Contact OwnerContact { get; set; }

        [DataMember]
        public Contact AgencyContact { get; set; }

        /// <summary>
        /// the 'LevyContact' is actually the TenantContact, can't change because need to be backwards compatible
        /// </summary>
        [DataMember]
        public Contact LevyContact { get; set; }

        /// <summary>
        /// The 'actual' levy contact as defined in the Owner table
        /// </summary>
        /// <remarks>determine by Lot->Owner->LevyContactId </remarks>
//        [DataMember]
//        public Contact LevyContactActual { get; set; }

        [DataMember]
        public StreetAddress MainOCAddress { get; set; }

        [DataMember]
        public string PaidTo { get; set; }

        [DataMember]
        public bool HidePaidTo { get; set; }

        [DataMember]
        public string Arrears { get; set; }

        [DataMember]
        public string InterestDue { get; set; }

        [DataMember]
        public string Warnings { get; set; }

        [DataMember]
        public string LastReceiptDate { get; set; }

        [DataMember]
        public string LastReceiptAmount { get; set; }

        [DataMember]
        public string LastReceiptRecordNo { get; set; }

        [DataMember]
        public string PropertyPhoto { get; set; }

        [DataMember]
        public List<DistributionDetail> DistributionDetails { get; set; }
    }
}
