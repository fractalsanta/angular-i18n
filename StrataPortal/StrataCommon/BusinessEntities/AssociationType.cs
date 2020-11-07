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
	public class AssociationType
	{
		[DataMember]
		[Column(Name = "lAssociationTypeID")]
		public Int32 AssociationTypeID { get; set; }

		[DataMember]
		[Column(Name = "sName")]
		public string Name { get; set; }

		[DataMember]
		[Column(Name = "sStatusCertificateName")]
		public string StatusCertificateName { get; set; }

		[DataMember]
		[Column(Name = "sTemplatePath")]
		public string TemplatePath { get; set; }

		[DataMember]
		[Column(Name = "sState")]
		public string State { get; set; }

	}
}
