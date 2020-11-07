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
	[Table]
	public class UnitEntitlement
	{
		[DataMember]
		[Column(Name = "lUnitEntitlementID")]
		public Int32 UnitEntitlementID { get; set; }

		[DataMember]
		[Column(Name = "lUnitEntitlementSetID")]
		public Int32 UnitEntitlementSetID { get; set; }

		[DataMember]
		[Column(Name = "lLotID")]
		public Int32 LotID { get; set; }

		[DataMember]
		[Column(Name = "lEntitlement")]
		public Double Entitlement { get; set; }

		[DataMember]
		[Column(Name = "fFractionalEntitlement")]
		public Single FractionalEntitlement { get; set; }

	}
}
