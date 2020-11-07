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
	public class Owner : IOwner
	{
		[DataMember]
		[Column(Name = "lOwnerID")]
		public Int32 OwnerID { get; set; }

		[DataMember]
		[Column(Name = "lLotID")]
		public Int32 LotID { get; set; }

		[DataMember]
		[Column(Name = "sOwnerType")]
		public string OwnerType { get; set; }

		[DataMember]
		[Column(Name = "sNameOnTitle")]
		public string NameOnTitle { get; set; }

		[DataMember]
		[Column(Name = "lOwnerContactID")]
		public Int32 OwnerContactID { get; set; }

		[DataMember]
		[Column(Name = "lLevyContactID")]
		public Int32 LevyContactID { get; set; }

		[DataMember]
		[Column(Name = "lNoticeContactID")]
		public Int32 NoticeContactID { get; set; }

		[DataMember]
		[Column(Name = "sChequeDrawer")]
		public string ChequeDrawer { get; set; }

		[DataMember]
		[Column(Name = "sChequeBranch")]
		public string ChequeBranch { get; set; }

		[DataMember]
		[Column(Name = "sChequeBank")]
		public string ChequeBank { get; set; }

		[DataMember]
		[Column(Name = "sChequeBSB")]
		public string ChequeBSB { get; set; }

		[DataMember]
		[Column(Name = "dDateOfEntry")]
		public DateTime DateOfEntry { get; set; }

		[DataMember]
		[Column(Name = "sCompanyNominee")]
		public string CompanyNominee { get; set; }

		[DataMember]
		[Column(Name = "bOriginalOwner")]
		public string OriginalOwner { get; set; }

		[DataMember]
		[Column(Name = "dProxyExpiryDate")]
		public DateTime ProxyExpiryDate { get; set; }

		[DataMember]
		[Column(Name = "dPurchase")]
		public DateTime Purchase { get; set; }

		[DataMember]
		[Column(Name = "bNotifyPaymentToDebtCollector")]
		public string NotifyPaymentToDebtCollector { get; set; }

		[DataMember]
		[Column(Name = "bReferToDebtCollector")]
		public string ReferToDebtCollector { get; set; }

        [Column(Name = "sLevyIssue")]
        public string LevyIssue { get; set; }
	}
}
