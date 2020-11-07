using System.Collections.Generic;
using System.Drawing;
using Agile.Diagnostics.Logging;
using Communicator.DAL.Properties;
using Communicator.DAL;
using Communicator.ImageHelper;
using System.Linq;
using CommunicatorDto;
using Rockend.Common;
using RwacUtility.Objects;

namespace Rockend.Cms
{
    /// <summary>
    /// A very simple CMS implementation for Communicator
    /// </summary>
    public class RockendConfigurationManager 
    {
        private readonly IConfigurationDataProvider provider;
        public const int DefaultAgencyAccessId = 0;
        
        /// <summary>
        /// Constructor, inject the provider, uses default CacheItemPolicy (60 minute sliding expiry) 
        /// </summary>
        public RockendConfigurationManager(IConfigurationDataProvider configurationDataProvider)
        {
            provider = configurationDataProvider;
        }

        /// <summary>
        /// Get the provider 
        /// </summary>
        public IConfigurationDataProvider Provider
        {
            get { return provider; }
        }

        
        /// <summary>
        /// Load AgentContent from the EF Context
        /// </summary>
        public AgencyApplication LoadAgencyApplicationData(string serialNumber, string applicationCode)
        {
            return Provider.LoadAgencyApplicationData(serialNumber, applicationCode);
        }

        /// <summary>
        /// Load AgentContent from the EF Context
        /// </summary>
        public AgencyApplication LoadAgencyApplicationData(int applicationKey)
        {
            return Provider.LoadAgencyApplicationData(applicationKey);
        }

        /// <summary>
        /// Loads a service for an agency.
        /// </summary>
        /// <param name="appKey">Agency's application key.</param>
        /// <param name="serviceKey">Service key to load.</param>
        /// <returns>Service object</returns>
        public ServiceAgencyApplication LoadAgentServicesByServiceKey(int appKey, int serviceKey)
        {
            return Provider.LoadServiceAgencyApplicationByServiceKey(appKey, serviceKey);
        }

        /// <summary>
        /// Get the Agents content data, returns null if not found
        /// </summary>
        private AgentContentRestDto LoadAgentContentRest(int agencyApplicationId)
        {
            var content = Provider.LoadAgentContentRest(agencyApplicationId);
            return content;
        }

        private AgentContentStrataDto LoadAgentContentStrata(int agencyApplicationId)
        {
            var content = Provider.LoadAgentContentStrata(agencyApplicationId);

            if (content == null)
            {
                return GetDefaultAgentContentStrata(0, null, string.Empty);
            }

            return content;
        }

        private const string DefaultButtonColor = "#CCCCCC";
        private const string DefaultButtonTextColor = "#000000";
        public const string DefaultTopText = "Sydneys Premier Agency";

        /// <summary>
        /// Get the Agents customised content, returns default content if not found
        /// </summary>
        public virtual AgentContentRestDto GetAgentContent(int agencyApplicationId, string applicationCode, Bitmap defaultBanner = null, string defaultText = null)
        {
            if(agencyApplicationId > 0)
            {
                var content = LoadAgentContentRest(agencyApplicationId);

                if (content != null)
                    return content;
            }

            if(agencyApplicationId > 0) // -1 is normal if the agency has never saved any customizations
                Logger.Debug(@"Failed to find AgentContent for AgencyApplicationId [{0}], returning defaults.", agencyApplicationId);

            return GetDefaultAgentContentRest(agencyApplicationId, defaultBanner, defaultText);  
        }

        /// <summary>
        /// Get the Agents customised content, returns default content if not found
        /// </summary>
        public virtual AgentContentStrataDto GetAgentContentStrata(int agencyApplicationId, Bitmap defaultBanner = null, string defaultText = null)
        {
            if (agencyApplicationId > 0)
            {
                var content = LoadAgentContentStrata (agencyApplicationId);

                if (content != null)
                    return content;
            }

            if(agencyApplicationId > 0) // -1 is normal if the agency has never saved any customizations
                Logger.Debug(@"Failed to find AgentContent for AgencyApplicationId [{0}], returning defaults.", agencyApplicationId);
    
            return GetDefaultAgentContentStrata(agencyApplicationId, defaultBanner, defaultText);
        }

        private static AgentContentRestDto GetDefaultAgentContentRest(int agencyAccessId, Bitmap defaultBanner, string defaultText)
        {
            if (defaultBanner == null)
                defaultBanner = Resources.banner;
            if (string.IsNullOrEmpty(defaultText))
            {
                defaultText = DefaultTopText;
            }

            var agentContentRest = new AgentContentRestDto();

            var content = new AgentContent
                          {
                              LoginPageTopText = defaultText,
                              AgencyAccessId = agencyAccessId,
                              IncExpReportsOn = false,
                              OwnerReportsOn = false,
                              ButtonColor = DefaultButtonColor,
                              ButtonTextColor = DefaultButtonTextColor
                          };
            agentContentRest.AgentContent = content.ToDto();

            return agentContentRest;
        }

        private static AgentContentStrataDto GetDefaultAgentContentStrata (int agencyAccessId, Bitmap defaultBanner, string defaultText)
        {
            if (defaultBanner == null)
                defaultBanner = Resources.bannerStrata;
            if (string.IsNullOrEmpty(defaultText))
            {
                defaultText = DefaultTopText;
            }

            var strataContent = new AgentContentStrataDto();
            strataContent.AgentContent = new AgentContentDTO
            {
                Banner = defaultBanner.ToByteArrayJpeg(),
                LoginPageTopText = defaultText,
                AgencyAccessId = agencyAccessId,
                IncExpReportsOn = false,
                OwnerReportsOn = false,
                ButtonColor = DefaultButtonColor,
                ButtonTextColor = DefaultButtonTextColor,
                IsContactEmailMandatory = false
            };
            
            return strataContent;
        }

        public void Save(AgentContent agentContent)
        {
            Provider.Save(agentContent);
        }

        private ICentralRepository centralRepo;

        private ICentralRepository CentralRepo
        {
            get { return centralRepo ?? (centralRepo = SimpleContainer.GetInstance<ICentralRepository>()); }
        }


        private RestCentral context;
        /// <summary>
        /// Gets a persistent Context to the RestCentral db.
        /// </summary>
        private RestCentral Context
        {
            get
            {
                if (context == null)
                    context = CentralRepo.GetRESTCentralContext() as RestCentral;
                return context; 
            }
        }


        public List<UserLogin> GetAgentsExistingLogins(int applicationKey)
        {
            // need to use our own Persistent context so saving changes is easy
            return Provider.GetUserLoginsFor(Context, applicationKey);
        }

        
        /// <summary>
        /// Save
        /// </summary>
        public void Save(UserLogin user)
        {
            Provider.Save(user);
        }

        /// <summary>
        /// Save all changes to the User Logins
        /// </summary>
        public void SaveUserLogins()
        {
            Context.SubmitChanges();
        }



    }
}
