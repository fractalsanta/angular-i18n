using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.Linq;
using Rockend.iStrata.StrataCommon.BusinessEntities;
using System.Runtime.Serialization;
using Rockend.iStrata.StrataCommon.Request;
using System.Data;

namespace Rockend.iStrata.StrataCommon.Response
{
    [Serializable]
    public class LoginException : Exception
    {
        public LoginException() : base() { }
        public LoginException(string message) : base(message) { }
        public LoginException(SerializationInfo info, StreamingContext context) : base(info, context) { }
        public LoginException(string message, Exception innerException) : base(message, innerException) { }
    }

    [DataContract]
    public class LoginResponse
    {
        #region Properties

        /// <summary>
        /// List of contacts for this login
        /// </summary>
        [DataMember]
        public List<int> ContactIDList { get; set; }

        /// <summary>
        /// List of reports available
        /// </summary>
        [DataMember]
        public Dictionary<int, List<WebAccessReports>> ReportList { get; set; }

        [DataMember]
        public List<ReportDataContainer> ReportPermissions { get; set; }

        [DataMember]
        public List<WebAccessReports> Reports { get; set; }

        /// <summary>
        /// List of meetings available
        /// </summary>
        [DataMember]
        public Dictionary<int, List<MeetingResponse>> MeetingList { get; set; }

        [DataMember]
        public string MaintenanceXml { get; set; }

        /// <summary>
        /// Agency information
        /// </summary>
        [DataMember]
        public AgencyInfo StrataAgency { get; set; }

        /// <summary>
        /// Gives the Strata Master DB
        /// </summary>
        [DataMember]
        public string StrataConfig { get; set; } // DB Version

        /// <summary>
        /// Current executive member ID
        /// </summary>
        [DataMember]
        public int CurrentExecMemberID { get; set; }

        /// <summary>
        /// A list of owner lots (plus contact information for the lot)
        /// </summary>
        [DataMember]
        public List<LotInfo> LotList { get; set; }

        [DataMember]
        public Role UserRole { get; set; }

        /// <summary>
        /// Indicates if this login is an executime member
        /// </summary>
        public bool IsExecMember
        {
            get { return (UserRole == Role.ExecutiveMember); }
        }

        /// <summary>
        /// Indicates if this login is an owner
        /// </summary>
        public bool IsOwner
        {
            get { return (UserRole == Role.Owner || LotList.Count > 0); }
        }

        /// <summary>
        /// Main contact for this login
        /// </summary>
        [DataMember]
        public ContactInfo MainContact { get; set; }

        /// <summary>
        /// List of executive members for this login
        /// </summary>
        [DataMember]
        public List<ExecutiveDescription> ExecutiveMembers { get; set; }

        /// <summary>
        /// List of terminology for the agency
        /// </summary>
        [DataMember]
        public TerminologyDictionary Terminology { get; set; }

        #endregion
    }
}
