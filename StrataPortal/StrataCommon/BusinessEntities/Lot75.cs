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
    [Table(Name="Lot")]
    public class Lot75 : ILot
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


        #region new fields from V7.5

        [DataMember]
        [Column(Name = "bUseOwnersLevyEmail")]
        public string UseOwnersLevyEmailValue { get; set; }

        [IgnoreDataMember]
        public bool UseOwnersLevyEmail { get { return (!string.IsNullOrEmpty(UseOwnersLevyEmailValue)) && UseOwnersLevyEmailValue.Equals("Y", StringComparison.InvariantCultureIgnoreCase); } }

        [DataMember]
        [Column(Name = "bUseAgentsLevyEmail")]
        public string UseAgentsLevyEmailValue { get; set; }

        [IgnoreDataMember]
        public bool UseAgentsLevyEmail { get { return (!string.IsNullOrEmpty(UseAgentsLevyEmailValue)) && UseAgentsLevyEmailValue.Equals("Y", StringComparison.InvariantCultureIgnoreCase); } }

        [DataMember]
        [Column(Name = "bUseTenantsLevyEmail")]
        public string UseTenantsLevyEmaiValue { get; set; }

        [IgnoreDataMember]
        public bool UseTenantsLevyEmail { get { return (!string.IsNullOrEmpty(UseTenantsLevyEmaiValue)) && UseTenantsLevyEmaiValue.Equals("Y", StringComparison.InvariantCultureIgnoreCase); } }

        [DataMember]
        [Column(Name = "bUseOwnersNoticeEmail")]
        public string UseOwnersNoticeEmailValue { get; set; }

        [IgnoreDataMember]
        public bool UseOwnersNoticeEmail { get { return (!string.IsNullOrEmpty(UseOwnersNoticeEmailValue)) && UseOwnersNoticeEmailValue.Equals("Y", StringComparison.InvariantCultureIgnoreCase); } }

        [DataMember]
        [Column(Name = "bUseAgentsNoticeEmail")]
        public string UseAgentsNoticeEmailValue { get; set; }

        [IgnoreDataMember]
        public bool UseAgentsNoticeEmail { get { return (!string.IsNullOrEmpty(UseAgentsNoticeEmailValue)) && UseAgentsNoticeEmailValue.Equals("Y", StringComparison.InvariantCultureIgnoreCase); } }

        [DataMember]
        [Column(Name = "bUseTenantsNoticeEmail")]
        public string UseTenantsNoticeEmailValue { get; set; }

        [IgnoreDataMember]
        public bool UseTenantsNoticeEmail { get { return (!string.IsNullOrEmpty(UseTenantsNoticeEmailValue)) && UseTenantsNoticeEmailValue.Equals("Y", StringComparison.InvariantCultureIgnoreCase); } }

        [DataMember]
        [Column(Name = "bUseOwnersCorrespondenceEmail")]
        public string UseOwnersCorrespondenceEmailValue { get; set; }

        [IgnoreDataMember]
        public bool UseOwnersCorrespondenceEmail { get { return (!string.IsNullOrEmpty(UseOwnersCorrespondenceEmailValue)) && UseOwnersCorrespondenceEmailValue.Equals("Y", StringComparison.InvariantCultureIgnoreCase); } }

        [DataMember]
        [Column(Name = "bUseAgentsCorrespondenceEmail")]
        public string UseAgentsCorrespondenceEmailValue { get; set; }

        [IgnoreDataMember]
        public bool UseAgentsCorrespondenceEmail { get { return (!string.IsNullOrEmpty(UseAgentsCorrespondenceEmailValue)) && UseAgentsCorrespondenceEmailValue.Equals("Y", StringComparison.InvariantCultureIgnoreCase); } }

        [DataMember]
        [Column(Name = "bUseTenantsCorrespondenceEmail")]
        public string UseTenantsCorrespondenceEmailValue { get; set; }

        [IgnoreDataMember]
        public bool UseTenantsCorrespondenceEmail { get { return (!string.IsNullOrEmpty(UseTenantsCorrespondenceEmailValue)) && UseTenantsCorrespondenceEmailValue.Equals("Y", StringComparison.InvariantCultureIgnoreCase); } }

        #endregion // new fields from V7.5


    }
}
