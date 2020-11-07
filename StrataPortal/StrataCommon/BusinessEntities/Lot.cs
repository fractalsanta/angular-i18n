using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.Data;
using System.Data.Linq;
using System.Data.Linq.Mapping;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [DataContract]
    [Table]
    public class Lot : ILot
    {
        public override string ToString()
        {
            return string.Format("[{0}] oc:{1} lot:{2} unit:{3} owner:{4}"
                , LotID, OwnersCorporationID, LotNumber, UnitNumber, (CurrentOwnerID.HasValue) ? CurrentOwnerID.Value.ToString() : "");
        }

        [DataMember]
        [Column(Name = "lLotID")]
        public Int32 LotID { get; set; }

        [DataMember]
        [Column(Name = "lOwnersCorporationID")]
        public Int32 OwnersCorporationID { get; set; }

        [DataMember]
        [Column(Name = "lCurrentOwnerID")]
        public Int32? CurrentOwnerID { get; set; }

        [DataMember]
        [Column(Name = "lLotNumber")]
        public Int32 LotNumber { get; set; }

        [DataMember]
        [Column(Name = "lUnitNumber")]
        public Int32 UnitNumber { get; set; }

        [DataMember]
        [Column(Name = "sUnitNumberPrefix")]
        public string UnitNumberPrefix { get; set; }

        [DataMember]
        [Column(Name = "sUnitNumberSuffix")]
        public string UnitNumberSuffix { get; set; }

        [DataMember]
        [Column(Name = "lAgentContactID")]
        public Int32 AgentContactID { get; set; }

        [DataMember]
        [Column(Name = "sReceiptMessage")]
        public string ReceiptMessage { get; set; }

        [DataMember]
        [Column(Name = "sScreenMessage")]
        public string ScreenMessage { get; set; }

        [DataMember]
        [Column(Name = "sAdditionalLotNumbers")]
        public string AdditionalLotNumbers { get; set; }

        [DataMember]
        [Column(Name = "dSectionCertificateIssued")]
        public DateTime SectionCertificateIssued { get; set; }

        [DataMember]
        [Column(Name = "lStreetAddressID")]
        public Int32 StreetAddressID { get; set; }

        [DataMember]
        [Column(Name = "bOwnerOccupied")]
        public string OwnerOccupied { get; set; }

        [DataMember]
        [Column(Name = "sTenantNotes")]
        public string TenantNotes { get; set; }

        [DataMember]
        [Column(Name = "sNotes")]
        public string Notes { get; set; }

        [DataMember]
        [Column(Name = "sLotRefNumber")]
        public string LotRefNumber { get; set; }

        [DataMember]
        [Column(Name = "lTenantContactID")]
        public Int32 TenantContactID { get; set; }

        [DataMember]
        [Column(Name = "sLotNumberPrefix")]
        public string LotNumberPrefix { get; set; }

        [DataMember]
        [Column(Name = "sLotNumberSuffix")]
        public string LotNumberSuffix { get; set; }

        [DataMember]
        [Column(Name = "bNonLotOwner")]
        public string NonLotOwner { get; set; }

        [Column(Name = "dStatusCertificateIssued")]
        public DateTime StatusCertificateIssued { get; set; }
    }
}
