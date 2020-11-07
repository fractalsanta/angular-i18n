using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Text;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table]
    public class RMImage
    {
        [Column(Name = "lRMImageID", IsPrimaryKey = true)]
        public int RMImageID { get; set; }

        [Column(Name = "lRMID")]
        public int RMID { get; set; }

        [Column(Name = "lOwnersCorporationID")]
        public int OwnersCorporationID { get; set; }

        [Column(Name = "sImageFileName")]
        public string ImageFileName { get; set; }
        
        [Column(Name = "sDescription")]
        public string Description { get; set; }
        
        [Column(Name = "bIsQuote")]
        public string IsQuote { get; set; }
        
        [Column(Name = "bIsWorkOrder")]
        public string IsWorkOrder { get; set; }
    }
}
