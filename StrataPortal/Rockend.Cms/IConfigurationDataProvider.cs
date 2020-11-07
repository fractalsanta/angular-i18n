using System.Collections.Generic;
using Communicator.DAL;
using CommunicatorDto;

namespace Rockend.Cms
{
    /// <summary>
    /// Interface for cms implementations
    /// </summary>
    public interface IConfigurationDataProvider
    {
        /// <summary>
        /// Gets the client content for a client with the given key
        /// </summary>
        AgentContent LoadAgentContent(int agencyApplicationId);

        /// <summary>
        /// Gets the client content for a client with the given key
        /// </summary>
        AgentContentRestDto LoadAgentContentRest(int agencyApplicationId);

        /// <summary>
        /// Gets the client content for a client with the given key
        /// </summary>
        AgentContentStrataDto LoadAgentContentStrata(int agencyApplicationId);

        /// <summary>
        /// Load data from AgencyApplication store using the serial number and appCode (eg RP) 
        /// to find a match
        /// </summary>
        AgencyApplication LoadAgencyApplicationData(string serialNumber, string applicationCode);
        
        /// <summary>
        /// Load data from AgencyApplication stored using the application Key
        /// </summary>
        /// <remarks>the appKey is unique</remarks>
        AgencyApplication LoadAgencyApplicationData(int applicationKey);
        
        /// <summary>
        /// LoadActivationsFromKey
        /// </summary>
        List<Activation> LoadActivationsFromKey(int? appKey);

        /// <summary>
        /// LoadActivationsFromId
        /// </summary>
        List<Activation> LoadActivationsFromId(int agencyApplicationId);

        /// <summary>
        /// Save the Agent Content 
        /// </summary>
        void Save(AgentContent login);

        /// <summary>
        /// Save an Activation
        /// </summary>
        void Save(Activation activation);

        /// <summary>
        /// Save the ServiceAgencyApplication 
        /// </summary>
        void Save(ServiceAgencyApplication service);

        /// <summary>
        /// Delete the Agent Content 
        /// </summary>
        void Delete(AgentContent agentContent);
        
        /// <summary>
        /// Delete the user login 
        /// </summary>
        void Delete(UserLogin user);

        /// <summary>
        /// Returns true if can connect to the data source
        /// </summary>
        bool CanConnect { get; }

        /// <summary>
        /// Returns the connection string
        /// </summary>
        string ConnectionString { get; }

        /// <summary>
        /// Save a UserLogin
        /// </summary>
        void Save(UserLogin user);

        /// <summary>
        /// Load all UserLogins 
        /// </summary>
        List<UserLogin> GetUserLoginsFor(int applicationKey);

        /// <summary>
        /// Load all UserLogins with provided context.
        /// </summary>
        List<UserLogin> GetUserLoginsFor(RestCentral context, int applicationKey);

        /// <summary>
        /// Returns true if the a UserLogin exists with the provided details
        /// </summary>
        bool UserLoginExists(int originalUserId, int appKey, int typeId, RestCentral context);
        /// <summary>
        /// Returns true if the a UserLogin exists with the provided details
        /// </summary>
        bool UserLoginExists(int originalUserId, int appKey, int typeId);

        /// <summary>
        /// Returns the UserLogin matching the provided details
        /// </summary>
        UserLogin UserLoginLoad(int originalUserId, int appKey, int typeId, RestCentral context);

        /// <summary>
        /// Returns the UserLogin matching the provided details
        /// </summary>
        UserLogin UserLoginLoad(int originalUserId, int appKey, int typeId);

        /// <summary>
        /// Returns a list of ServiceAgencyApplications for the given key
        /// </summary>
        List<ServiceAgencyApplication> LoadServiceAgencyApplicationFromKey(int? appKey);

        ServiceAgencyApplication LoadServiceAgencyApplicationByServiceKey(int appKey, int serviceKey);
    }
}
