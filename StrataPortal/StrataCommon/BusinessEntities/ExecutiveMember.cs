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
	public class ExecutiveMember
    {
        public override string ToString()
        {
            return string.Format("[{0}] oc:{1} lot:{2} name:{3}"
                , ExecutiveMemberID, OwnersCorporationID, LotID, Name);
        }

		[DataMember]
		[Column(Name = "lExecutiveMemberID")]
		public Int32 ExecutiveMemberID { get; set; }

		[DataMember]
		[Column(Name = "lOwnersCorporationID")]
		public Int32 OwnersCorporationID { get; set; }

		[DataMember]
		[Column(Name = "lLotID")]
		public Int32? LotID { get; set; }

		[DataMember]
		[Column(Name = "lExecutivePositionID")]
		public Int32 ExecutivePositionID { get; set; }

		[DataMember]
		[Column(Name = "sName")]
		public string Name { get; set; }

		[DataMember]
		[Column(Name = "sAddress")]
		public string Address { get; set; }

		[DataMember]
		[Column(Name = "sWorkPhone")]
		public string WorkPhone { get; set; }

		[DataMember]
		[Column(Name = "sHomePhone")]
		public string HomePhone { get; set; }

		[DataMember]
		[Column(Name = "sMobilePhone")]
		public string MobilePhone { get; set; }

		[DataMember]
		[Column(Name = "sEmail")]
		public string Email { get; set; }

		[DataMember]
		[Column(Name = "lOwnerID")]
		public Int32? OwnerID { get; set; }

		[DataMember]
		[Column(Name = "bReceiveReports")]
		public string ReceiveReports { get; set; }

		[DataMember]
		[Column(Name = "sStatus")]
		public string Status { get; set; }

		[DataMember]
		[Column(Name = "lContactID")]
		public Int32 ContactID { get; set; }

	}
}
