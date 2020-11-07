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
	public class StreetAddress
	{
		[DataMember]
		[Column(Name = "lStreetAddressID")]
		public Int32 StreetAddressID { get; set; }

		[DataMember]
		[Column(Name = "lOwnersCorporationID")]
		public Int32 OwnersCorporationID { get; set; }

		[DataMember]
		[Column(Name = "sBuildingName")]
		public string BuildingName { get; set; }

		[DataMember]
		[Column(Name = "sStreetNumberPrefix")]
		public string StreetNumberPrefix { get; set; }

		[DataMember]
		[Column(Name = "lStreetNumber")]
		public Int32 StreetNumber { get; set; }

		[DataMember]
		[Column(Name = "sStreetNumberSuffix")]
		public string StreetNumberSuffix { get; set; }

		[DataMember]
		[Column(Name = "sStreet")]
		public string Street { get; set; }

		[DataMember]
		[Column(Name = "sTown")]
		public string Town { get; set; }

		[DataMember]
		[Column(Name = "sState")]
		public string State { get; set; }

		[DataMember]
		[Column(Name = "sPostcode")]
		public string Postcode { get; set; }

	}
}
