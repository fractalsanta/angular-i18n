using System.Data.Linq.Mapping;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table]
    public class KeyType
    {
        [Column(Name = "lKeyTypeID", IsPrimaryKey = true)]
        public int KeyTypeID { get; set; }

        [Column(Name = "sDescription")]
        public string Description { get; set; }

    }
}