using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.Linq.Mapping;
using System.Data.Linq;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table(Name="Contact")]
    public class ContactInfo
    {
        [Column(Name = "lContactID", IsPrimaryKey=true)]
        public int ContactID { get; set; }

        [Column(Name = "sContactType")]
        public string contactType { get; set; }

        [Column(Name = "sName")]
        public string Name { get; set; }

        [Column(Name = "sWebAccessUsername")]
        public string WebAccessUsername { get; set; }

        [Column(Name = "sWebAccessPassword")]
        public string WebAccessPassword { get; set; }

        [Column(Name = "bWebAccessEnabled")]
        public string WebAccessEnabled { get; set; }

    }
}
