using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.Linq.Mapping;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table]
    public class Config
    {
        [Column(Name = "sDatabaseVersion")]
        public string DatabaseVersion { get; set; }

        [Column(Name = "sLicenceCode")]
        public string SerialNumber { get; set; }

        [Column(Name ="sDocumentsDirectory")]
        public string DocumentsDirectory { get; set; }
    }
}
