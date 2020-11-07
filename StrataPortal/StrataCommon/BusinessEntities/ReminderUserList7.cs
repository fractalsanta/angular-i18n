using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Text;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table(Name = "ReminderUserList")]
    public class ReminderUserList7
    {
        [Column(Name = "lReminderUserListID")]
        public Int32 ReminderUserListID { get; set; }

        [Column(Name = "lUserId")]
        public Int32 UserId { get; set; }

        [Column(Name = "lReminderID")]
        public Int32 ReminderID { get; set; }

        [Column(Name = "sReminderValue1")]
        public string ReminderValue1 { get; set; }

        [Column(Name = "sReminderValue2")]
        public string ReminderValue2 { get; set; }
    }
}
