using System.Data.Linq.Mapping;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table(Name = "BankAccountMapping")]
    public class BankAccountMapping
    {
        [Column(Name = "lBankAccountMappingID")]
        public int BankAccountMappingID { get; set; }

        [Column(Name = "lBankAccountID")]
        public int BankAccountID { get; set; }

        [Column(Name = "lAccountID")]
        public int AccountID { get; set; }

        [Column(Name = "lOwnersCorporationID")]
        public int OwnersCorporationID { get; set; }

        [Column(Name = "lGroupCodeID")]
        public int GroupCodeID { get; set; }
    }
}