using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using Agile.Diagnostics.Logging;
using Communicator.DAL;
using Rockend.Cms;
using Rockend.Cms.Providers;
using Rockend.iStrata.StrataWebsite.Data;
using CommunicatorDto;

namespace Rockend.iStrata.StrataWebsite.Model
{
    public abstract class ModelBase
    {
        private AgentContentStrataDto agentContent;

        protected const string StrataMasterApplicationCode = "SM";
        protected const string AgentContentSessionKey = "AgentContent";

        /// <summary>
        /// Gets or sets the user session.
        /// </summary>
        /// <value>The user session.</value>
        public UserSession UserSession
        {
            get
            {
                if (HttpContext.Current.Session == null)
                {
                    return null;
                }
                return HttpContext.Current.Session["UserSession"] as UserSession;
            }
        }

        private RockendConfigurationManager communicatorData = new RockendConfigurationManager(new LinqToSqlDataProvider(RestCentral.ConnectionString));

        protected RockendConfigurationManager CommunicatorData
        {
            get { return communicatorData; }
            set { communicatorData = value; }
        }

        /// <summary>
        /// Get the Agent Content
        /// </summary>
        public AgentContentStrataDto AgentContentStrata
        {
            get
            {
                if (agentContent == null)
                {
                    try
                    {
                        agentContent = HttpContext.Current.Session[AgentContentSessionKey] as AgentContentStrataDto;
                    }
                    catch (Exception) { return null; }
                }
                return agentContent;
            }
        }
    }
}
