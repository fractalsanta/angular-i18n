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
    public class OwnersCorporation
    {
        [DataMember]
        [Column(Name = "lOwnersCorporationID")]
        public Int32 OwnersCorporationID { get; set; }

        [DataMember]
        [Column(Name = "sPlanNumber")]
        public string PlanNumber { get; set; }

        [DataMember]
        [Column(Name = "dFirstAGM")]
        public DateTime FirstAGM { get; set; }

        [DataMember]
        [Column(Name = "dLastAGM")]
        public DateTime LastAGM { get; set; }

        [DataMember]
        [Column(Name = "dNextAGMDate")]
        public DateTime NextAGMDate { get; set; }

        [DataMember]
        [Column(Name = "dTaxYearEnd")]
        public DateTime TaxYearEnd { get; set; }

        [DataMember]
        [Column(Name = "dFinancialYearEnd")]
        public DateTime FinancialYearEnd { get; set; }

        [DataMember]
        [Column(Name = "dLastLevyNotice")]
        public DateTime LastLevyNotice { get; set; }

        [DataMember]
        [Column(Name = "dManagementEnded")]
        public DateTime ManagementEnded { get; set; }

        [DataMember]
        [Column(Name = "lUserID")]
        public Int32 UserID { get; set; }

        [DataMember]
        [Column(Name = "sNotes")]
        public string Notes { get; set; }

        [DataMember]
        [Column(Name = "lAssociationTypeID")]
        public Int32 AssociationTypeID { get; set; }

        [DataMember]
        [Column(Name = "sCommunityPlanNumber")]
        public string CommunityPlanNumber { get; set; }

        [DataMember]
        [Column(Name = "sCommunityLotNumber")]
        public string CommunityLotNumber { get; set; }

        [DataMember]
        [Column(Name = "mValuationAmount")]
        public Decimal ValuationAmount { get; set; }

        [DataMember]
        [Column(Name = "dValuation")]
        public DateTime Valuation { get; set; }

        [DataMember]
        [Column(Name = "dBuilt")]
        public DateTime Built { get; set; }

        [DataMember]
        [Column(Name = "dRegistered")]
        public DateTime Registered { get; set; }

        [DataMember]
        [Column(Name = "dNewFeeScheduleApplies")]
        public DateTime NewFeeScheduleApplies { get; set; }

        [DataMember]
        [Column(Name = "mLevyDiscount")]
        public Decimal LevyDiscount { get; set; }

        [DataMember]
        [Column(Name = "mLevyInterest")]
        public Decimal LevyInterest { get; set; }

        [DataMember]
        [Column(Name = "sBuilder")]
        public string Builder { get; set; }

        [DataMember]
        [Column(Name = "sDeveloper")]
        public string Developer { get; set; }

        [DataMember]
        [Column(Name = "sTaxFileNumber")]
        public string TaxFileNumber { get; set; }

        [DataMember]
        [Column(Name = "dManagementCommencement")]
        public DateTime ManagementCommencement { get; set; }

        [DataMember]
        [Column(Name = "lExecutiveCommitteeSize")]
        public Int32 ExecutiveCommitteeSize { get; set; }

        [DataMember]
        [Column(Name = "dLastEGM")]
        public DateTime LastEGM { get; set; }

        [DataMember]
        [Column(Name = "dNextEGMDate")]
        public DateTime NextEGMDate { get; set; }

        [DataMember]
        [Column(Name = "dLastExecutiveMeeting")]
        public DateTime LastExecutiveMeeting { get; set; }

        [DataMember]
        [Column(Name = "dNextExecutiveMeetingDate")]
        public DateTime NextExecutiveMeetingDate { get; set; }

        [DataMember]
        [Column(Name = "lInterestFreePeriods")]
        public Int32 InterestFreePeriods { get; set; }

        [DataMember]
        [Column(Name = "sInterestFreePeriodUnit")]
        public string InterestFreePeriodUnit { get; set; }

        [DataMember]
        [Column(Name = "lMainAddressID")]
        public Int32? MainAddressID { get; set; }

        [DataMember]
        [Column(Name = "bInInitialPeriod")]
        public string InInitialPeriod { get; set; }

        [DataMember]
        [Column(Name = "sABN")]
        public string ABN { get; set; }

        [DataMember]
        [Column(Name = "sGSTstatus")]
        public string GSTstatus { get; set; }

        [DataMember]
        [Column(Name = "sLevyFrequency")]
        public string LevyFrequency { get; set; }

        [DataMember]
        [Column(Name = "sOriginalOwnerType")]
        public string OriginalOwnerType { get; set; }

        [DataMember]
        [Column(Name = "sOriginalOwnerName")]
        public string OriginalOwnerName { get; set; }

        [DataMember]
        [Column(Name = "sOriginalOwnerFirstName")]
        public string OriginalOwnerFirstName { get; set; }

        [DataMember]
        [Column(Name = "sOriginalOwnerOtherNames")]
        public string OriginalOwnerOtherNames { get; set; }

        [DataMember]
        [Column(Name = "sOriginalOwnerTitle")]
        public string OriginalOwnerTitle { get; set; }

        [DataMember]
        [Column(Name = "sOriginalOwnerBuilding")]
        public string OriginalOwnerBuilding { get; set; }

        [DataMember]
        [Column(Name = "sOriginalOwnerStreetNumber")]
        public string OriginalOwnerStreetNumber { get; set; }

        [DataMember]
        [Column(Name = "sOriginalOwnerStreetName")]
        public string OriginalOwnerStreetName { get; set; }

        [DataMember]
        [Column(Name = "sOriginalOwnerTown")]
        public string OriginalOwnerTown { get; set; }

        [DataMember]
        [Column(Name = "sOriginalOwnerState")]
        public string OriginalOwnerState { get; set; }

        [DataMember]
        [Column(Name = "sOriginalOwnerPostCode")]
        public string OriginalOwnerPostCode { get; set; }

        [DataMember]
        [Column(Name = "sOriginalOwnerCountry")]
        public string OriginalOwnerCountry { get; set; }

        [DataMember]
        [Column(Name = "sDeveloperContractWorksInsurance")]
        public string DeveloperContractWorksInsurance { get; set; }

        [DataMember]
        [Column(Name = "bManaged")]
        public string Managed { get; set; }

        [DataMember]
        [Column(Name = "sInterimReportingPeriod")]
        public string InterimReportingPeriod { get; set; }

        [DataMember]
        [Column(Name = "sNextAGMTime")]
        public string NextAGMTime { get; set; }

        [DataMember]
        [Column(Name = "sNextAGMPlace")]
        public string NextAGMPlace { get; set; }

        [DataMember]
        [Column(Name = "sNextEGMTime")]
        public string NextEGMTime { get; set; }

        [DataMember]
        [Column(Name = "sNextEGMPlace")]
        public string NextEGMPlace { get; set; }

        [DataMember]
        [Column(Name = "sNextExecutiveMeetingTime")]
        public string NextExecutiveMeetingTime { get; set; }

        [DataMember]
        [Column(Name = "sNextExecutiveMeetingPlace")]
        public string NextExecutiveMeetingPlace { get; set; }

        [DataMember]
        [Column(Name = "lAutoIncrement")]
        public Int32 AutoIncrement { get; set; }

        [DataMember]
        [Column(Name = "mAutoIncrementFixedRate")]
        public Decimal AutoIncrementFixedRate { get; set; }

        [DataMember]
        [Column(Name = "lDebtCollectorID")]
        public Int32? DebtCollectorID { get; set; }

        [DataMember]
        [Column(Name = "sGSTAccountingMethod")]
        public string GSTAccountingMethod { get; set; }

        [DataMember]
        [Column(Name = "sBodyCorporateName")]
        public string BodyCorporateName { get; set; }

        [DataMember]
        [Column(Name = "bRejectLevyReceipts")]
        public string RejectLevyReceipts { get; set; }

        [DataMember]
        [Column(Name = "lOriginalOwnerContactID")]
        public Int32? OriginalOwnerContactID { get; set; }
    }
}
