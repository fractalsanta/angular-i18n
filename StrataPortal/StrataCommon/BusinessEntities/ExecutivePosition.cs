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
	public class ExecutivePosition
	{
		[DataMember]
		[Column(Name = "lExecutivePositionID")]
		public Int32 ExecutivePositionID { get; set; }

		[DataMember]
		[Column(Name = "sName")]
		public string Name { get; set; }

		[DataMember]
		[Column(Name = "sDescription")]
		public string Description { get; set; }

	}
}
