using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Text;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table(Name = "ReminderUserManager")]
    public class ReminderUserManager7
    {
        [Column(Name = "lReminderUserManagerID")]
        public Int32 ReminderUserManagerID { get; set; }

        [Column(Name = "lUserId")]
        public Int32 UserId { get; set; }

        [Column(Name = "lManagerID")]
        public Int32 ManagerID { get; set; }
    }
}
