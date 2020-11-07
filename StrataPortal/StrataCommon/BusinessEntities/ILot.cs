using System;
using System.Data.Linq.Mapping;
using System.Runtime.Serialization;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    public interface ILot
    {
        [DataMember]
        [Column(Name = "lLotID")]
        Int32 LotID { get; set; }

        [DataMember]
        [Column(Name = "lOwnersCorporationID")]
        Int32 OwnersCorporationID { get; set; }

        [DataMember]
        [Column(Name = "lCurrentOwnerID")]
        Int32? CurrentOwnerID { get; set; }

        [DataMember]
        [Column(Name = "lLotNumber")]
        Int32 LotNumber { get; set; }

        [DataMember]
        [Column(Name = "lUnitNumber")]
        Int32 UnitNumber { get; set; }

        [DataMember]
        [Column(Name = "sUnitNumberPrefix")]
        string UnitNumberPrefix { get; set; }

        [DataMember]
        [Column(Name = "sUnitNumberSuffix")]
        string UnitNumberSuffix { get; set; }

        [DataMember]
        [Column(Name = "lAgentContactID")]
        Int32 AgentContactID { get; set; }

        [DataMember]
        [Column(Name = "sReceiptMessage")]
        string ReceiptMessage { get; set; }

        [DataMember]
        [Column(Name = "sScreenMessage")]
        string ScreenMessage { get; set; }

        [DataMember]
        [Column(Name = "sAdditionalLotNumbers")]
        string AdditionalLotNumbers { get; set; }

        [DataMember]
        [Column(Name = "dSectionCertificateIssued")]
        DateTime SectionCertificateIssued { get; set; }

        [DataMember]
        [Column(Name = "lStreetAddressID")]
        Int32 StreetAddressID { get; set; }

        [DataMember]
        [Column(Name = "bOwnerOccupied")]
        string OwnerOccupied { get; set; }

        [DataMember]
        [Column(Name = "sTenantNotes")]
        string TenantNotes { get; set; }

        [DataMember]
        [Column(Name = "sNotes")]
        string Notes { get; set; }

        [DataMember]
        [Column(Name = "sLotRefNumber")]
        string LotRefNumber { get; set; }

        [DataMember]
        [Column(Name = "lTenantContactID")]
        Int32 TenantContactID { get; set; }

        [DataMember]
        [Column(Name = "sLotNumberPrefix")]
        string LotNumberPrefix { get; set; }

        [DataMember]
        [Column(Name = "sLotNumberSuffix")]
        string LotNumberSuffix { get; set; }

        [DataMember]
        [Column(Name = "bNonLotOwner")]
        string NonLotOwner { get; set; }
    }
}