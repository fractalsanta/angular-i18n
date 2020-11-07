using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.Data;
using System.Data.Linq;
using System.Data.Linq.Mapping;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
	[DataContract]
    [Table(Name = "UnitEntitlementSet")]
	public class UnitEntitlementSet85
	{
		[DataMember]
		[Column(Name = "lUnitEntitlementSetID")]
		public Int32 UnitEntitlementSetID { get; set; }

		[DataMember]
		[Column(Name = "lOwnersCorporationID")]
		public Int32 OwnersCorporationID { get; set; }

		[DataMember]
		[Column(Name = "sName")]
		public string Name { get; set; }

		[DataMember]
		[Column(Name = "lTotalEntitlements")]
		public Double TotalEntitlements { get; set; }

		[DataMember]
		[Column(Name = "lEntitlementTypeID")]
		public Int32 EntitlementTypeID { get; set; }

		[DataMember]
		[Column(Name = "sDescription")]
		public string Description { get; set; }

        #region new field from V8.5

        [DataMember]
        [Column(Name = "bShowOnPortals")]
        public string ShowOnPortals { get; set; }

        #endregion

    }
}
