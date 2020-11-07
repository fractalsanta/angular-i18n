using System;
using System.Data.Linq.Mapping;
using System.Runtime.Serialization;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    public interface IOwner
    {
        [DataMember]
        [Column(Name = "lOwnerID")]
        Int32 OwnerID { get; set; }

        [DataMember]
        [Column(Name = "lLotID")]
        Int32 LotID { get; set; }

        [DataMember]
        [Column(Name = "sOwnerType")]
        string OwnerType { get; set; }

        [DataMember]
        [Column(Name = "sNameOnTitle")]
        string NameOnTitle { get; set; }

        [DataMember]
        [Column(Name = "lOwnerContactID")]
        Int32 OwnerContactID { get; set; }

        [DataMember]
        [Column(Name = "lLevyContactID")]
        Int32 LevyContactID { get; set; }

        [DataMember]
        [Column(Name = "lNoticeContactID")]
        Int32 NoticeContactID { get; set; }

        [DataMember]
        [Column(Name = "sChequeDrawer")]
        string ChequeDrawer { get; set; }

        [DataMember]
        [Column(Name = "sChequeBranch")]
        string ChequeBranch { get; set; }

        [DataMember]
        [Column(Name = "sChequeBank")]
        string ChequeBank { get; set; }

        [DataMember]
        [Column(Name = "sChequeBSB")]
        string ChequeBSB { get; set; }

        [DataMember]
        [Column(Name = "dDateOfEntry")]
        DateTime DateOfEntry { get; set; }

        [DataMember]
        [Column(Name = "sCompanyNominee")]
        string CompanyNominee { get; set; }

        [DataMember]
        [Column(Name = "bOriginalOwner")]
        string OriginalOwner { get; set; }

        [DataMember]
        [Column(Name = "dProxyExpiryDate")]
        DateTime ProxyExpiryDate { get; set; }

        [DataMember]
        [Column(Name = "dPurchase")]
        DateTime Purchase { get; set; }

        [DataMember]
        [Column(Name = "bNotifyPaymentToDebtCollector")]
        string NotifyPaymentToDebtCollector { get; set; }

        [DataMember]
        [Column(Name = "bReferToDebtCollector")]
        string ReferToDebtCollector { get; set; }
    }
}