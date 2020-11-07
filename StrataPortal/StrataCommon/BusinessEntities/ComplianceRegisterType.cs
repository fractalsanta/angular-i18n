using System.Data.Linq.Mapping;
namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    [Table(Name="ComplianceRegisterType")]
    public partial class ComplianceRegisterType
    {
        [Column(Name = "lComplianceRegisterTypeID", IsPrimaryKey = true)]
        public int ComplianceRegisterTypeID { get; set; }

        [Column(Name = "sDescription")]
        public string Description { get; set; }

        [Column(Name = "bDisplayDetailOnScreens")]
        public string DisplayDetailOnScreens { get; set; }

        [Column(Name = "bDisplayDetailOnReports")]
        public string DisplayDetailOnReports { get; set; }

        [Column(Name = "bDisplayWarningOnOCScreen")]
        public string DisplayWarningOnOCScreen { get; set; }

        // This is added in V6.5 if you need it, create a 65 model and handle appropriately
        //[Column(Name = "sMessage")]
        //public string Message { get; set; }
    }
}
