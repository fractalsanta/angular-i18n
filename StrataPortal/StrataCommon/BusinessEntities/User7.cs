using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table(Name = "tblUser")]
    [DataContract]
    [Serializable]
    public class tblUser7
    {
        [Column(Name = "lUserID")]
        [DataMember]
        public int UserID { get; set; }

        [Column(Name = "sName")]
        [DataMember]
        public string Name { get; set; }

        [Column(Name = "sLogin")]
        [DataMember]
        public string Login { get; set; }

        [Column(Name = "sPasswordKey")]
        [DataMember]
        public string PasswordKey { get; set; }

        [Column(Name = "sWorkPhone")]
        [DataMember]
        public string WorkPhone { get; set; }

        [Column(Name = "sMobilePhone")]
        [DataMember]
        public string MobilePhone { get; set; }

        [Column(Name = "sHomePhone")]
        [DataMember]
        public string HomePhone { get; set; }

        [Column(Name = "sFax")]
        [DataMember]
        public string Fax { get; set; }

        [Column(Name = "sEmail")]
        [DataMember]
        public string Email { get; set; }

        [Column(Name = "bManager")]
        [DataMember]
        public string Manager { get; set; }

        [Column(Name = "bActive")]
        [DataMember]
        public string Active { get; set; }

        [Column(Name = "bOnlineAccessEnabled")]
        [DataMember]
        public string OnlineAccessEnabled { get; set; }

        [Column(Name = "sNotes")]
        [DataMember]
        public string Notes { get; set; }

        [Column(Name = "sOnlineUsername")]
        [DataMember]
        public string OnlineUsername { get; set; }

        [Column(Name = "sOnlinePassword")]
        [DataMember]
        public string OnlinePassword { get; set; }

        [Column(Name = "mHourlyCharge")]
        [DataMember]
        public decimal HourlyCharge { get; set; }

        [Column(Name = "lChargeUnit")]
        [DataMember]
        public int ChargeUnit { get; set; }

        [Column(Name = "sManagerImageFileName")]
        public string ManagerImageFileName { get; set; }

        // New for SM 7
        [Column(Name = "bShowReminders")]
        public string ShowReminders { get; set; }

        [Column(Name = "bShowRemindersDiary")]
        public string ShowRemindersDiary { get; set; }

        [Column(Name = "sDiaryReminderValue1")]
        public string DiaryReminderValue1 { get; set; }

        [Column(Name = "sDiaryReminderValue2")]
        public string DiaryReminderValue2 { get; set; }
    }
}
