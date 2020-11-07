using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Serialization;
using Agile.Diagnostics.Logging;

namespace Rockend.iStrata.StrataWebsite.Data
{
    [Serializable]
    public class SessionData
    {
        public const string SessionDataKey = "SessionData";

        /// <summary>
        /// ctor
        /// </summary>
        public SessionData()
        {
            AgencyAccessId = 0;
            IsApplicationKeyRegistered = false;
            ApplicationKey = String.Empty;
        }

        public string ApplicationKey { get; set; }

        public string OriginalApplicationKey { get; set; }

        public bool IsApplicationKeyRegistered { get; set; }

        [XmlIgnore]
        public bool IsApplicationKeyValid 
        {
            get 
            {
                return (!String.IsNullOrEmpty(ApplicationKey))
                    && ApplicationKey.Length > 4
                    && IsApplicationKeyRegistered;
            }
        }

        public int? AgencyAccessId { get; set; }
        
        public int AgencyApplicationId { get; set; }

        public void Reset()
        {
            Logger.Info("--- SessionData.Reset called");

            // also reset the agencyAccessId, use case is one user from agencyA signs in in an internet cafe
            // then another signs in from AgencyB, don't want agencyA branding to appear for the second user (assumes browser remains open of course)
            AgencyAccessId = 0;

            ApplicationKey = String.Empty;

            HttpContext.Current.Session[SessionDataKey] = null;
        }
    }
}