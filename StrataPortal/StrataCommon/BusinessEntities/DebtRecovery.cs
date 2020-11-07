using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{

    [Table(Name="DebtRecovery")]
    public partial class DebtRecovery
    {
        [Column(Name = "lDebtRecoveryID", IsPrimaryKey = true)]
        public int DebtRecoveryID { get; set; }

        [Column(Name = "sName")]
        public string Name { get; set; }

        [Column(Name = "sDescription")]
        public string Description { get; set; }

        [Column(Name = "lOrderNumber")]
        public int OrderNumber { get; set; }

        [Column(Name = "lMinArrearsDays")]
        public int MinArrearsDays { get; set; }

        [Column(Name = "mMinArrearsAmount")]
        public decimal MinArrearsAmount { get; set; }

        [Column(Name = "lFeeID")]
        public int FeeID { get; set; }

        [Column(Name = "sLetterTemplate")]
        public string LetterTemplate { get; set; }

        [Column(Name = "bExcludeWhenCurrentLevies")]
        public string ExcludeWhenCurrentLevies { get; set; }

        [Column(Name = "bNotify")]
        public string Notify { get; set; }

        [Column(Name = "bClearOnSettlement")]
        public string ClearOnSettlement { get; set; }

        [Column(Name = "bAssignDebtCollector")]
        public string AssignDebtCollector { get; set; }

        [Column(Name = "bSendSMS")]
        public string SendSMS { get; set; }

        [Column(Name = "sSMSTemplate")]
        public string SMSTemplate { get; set; }

        [Column(Name = "sDRNEmailTemplate")]
        public string DRNEmailTemplate { get; set; }
    }
}
