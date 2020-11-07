using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Rockend.iStrata.StrataCommon.BusinessEntities
{
    /// <summary>
    /// New table in 7.5
    /// </summary>
	[DataContract]
	[Table(Name="ContactDetails")]
	public class ContactDetail
    {
        public override string ToString()
        {
            return string.Format("[{0}] {1} {2} {3}", ContactDetailID, ContactID, Type, Value);
        }

        [DataMember]
		[Column(Name = "lContactDetailsID", IsPrimaryKey=true)]
		public int ContactDetailID { get; set; }

        [DataMember]
        [Column(Name = "lContactID")]
        public int ContactID { get; set; }


		[DataMember]
		[Column(Name = "sType")]
		public string Type { get; set; }

        [DataMember]
        [Column(Name = "sNotes")]
        public string Notes { get; set; }

        [DataMember]
        [Column(Name = "sValue")]
        public string Value { get; set; }


        [DataMember]
        [Column(Name = "bEmailLevies")]
        public string EmailLeviesValue { get; set; }

        [IgnoreDataMember]
        public bool EmailLevies { get { return (!string.IsNullOrEmpty(EmailLeviesValue)) && EmailLeviesValue.Equals("Y", StringComparison.InvariantCultureIgnoreCase); } }


        [DataMember]
        [Column(Name = "bEmailMeetingDocs")]
        public string EmailMeetingDocsValue { get; set; }

        [IgnoreDataMember]
        public bool EmailMeetingDocs { get { return (!string.IsNullOrEmpty(EmailMeetingDocsValue)) && EmailMeetingDocsValue.Equals("Y", StringComparison.InvariantCultureIgnoreCase); } }

        [DataMember]
        [Column(Name = "bEmailCorrespondence")]
        public string EmailCorrespondenceValue { get; set; }

        [IgnoreDataMember]
        public bool EmailCorrespondence { get { return (!string.IsNullOrEmpty(EmailCorrespondenceValue)) && EmailCorrespondenceValue.Equals("Y", StringComparison.InvariantCultureIgnoreCase); } }
    }
}
