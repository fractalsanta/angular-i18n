using System.Collections.Generic;
using System.Diagnostics;
using System.ServiceModel;
using Rockend.WebAccess.Common;
using Rockend.WebAccess.Common.Helpers;

namespace CommunicatorDto
{
    [ServiceContract]    
    public interface IAppRequest
    {

        [OperationContract]
        AppConnectResponse BeginBenchmarkHistoricalCollection(int applicationKey, string verify);

        /// <summary>
        /// Returns true if the appkey is 'special' for the given type
        /// </summary>
        [OperationContract]
        bool CheckIsSpecialAppKey(int specialTypeId, int appKey);

        /// <summary>
        /// Returns true if can connect to the data source
        /// </summary>
        bool CanConnect { get; }

        /// <summary>
        /// Returns the connection string
        /// </summary>
        string ConnectionString { get; }

        [OperationContract]
        AppConnectResponse ActivateBenchmarkingService(int applicationKey);
        [OperationContract]
        AppConnectResponse DeActivateBenchmarkingService(int applicationKey);

        [OperationContract]
        AgentContentDTO LoadAgencyContent(int agencyApplicationId, string applicationCode);

        [OperationContract]
        AgentContentRestDto LoadAgentContentRest(int agencyApplicationId);

        [OperationContract]
        AgentContentStrataDto LoadAgentContentStrata(int agencyApplicationId);

        /// <summary>
        /// Gets the client content for a client with the given key
        /// </summary>
        [OperationContract]
        AgentContentDTO LoadAgentContent(int AgencyApplicationId);

        /// <summary>
        /// Load data from AgencyApplication store using the serial number and appCode (eg RP) 
        /// to find a match
        /// </summary>
        [OperationContract]
        AgencyApplicationDTO LoadAgencyApplicationDataFromSerialNo(string serialNumber, string applicationCode);

        /// <summary>
        /// Load data from AgencyApplication stored using the application Key
        /// </summary>
        /// <remarks>the appKey is unique</remarks>
        [OperationContract]
        AgencyApplicationDTO LoadAgencyApplicationDataFromKey(int applicationKey);

        /// <summary>
        /// Loads a collection of ServiceAgencyApplication data objects for a list of application keys.
        /// </summary>
        /// <param name="appKeys">List<int> of ApplicationKeys</int></param>
        /// <returns>List<ServiceAgencyApplicationDTO> of ServiceAgencyApplications for the collection of application keys.</returns>
        [OperationContract]
        List<ServiceAgencyApplicationDTO> LoadServiceAgencyApplicationsFromKeys(List<int> appKeys, int serviceId);

        /// <summary>
        /// Saves a collection of ServiceAgencyApplication data objects.
        /// </summary>
        /// <param name="appKeys">List<int> of ApplicationKeys</int></param>
        /// <returns>List<ServiceAgencyApplicationDTO> of ServiceAgencyApplications for the collection of application keys.</returns>
        //[OperationContract]
        //List<AppConnectResponse> SaveServiceAgencyApplications(List<ServiceAgencyApplicationDTO> agencyApplications);

        /// <summary>
        /// LoadActivationsFromKey
        /// </summary>
        [OperationContract]
        List<ActivationDTO> LoadActivationsFromKey(int? appKey);

        /// <summary>
        /// LoadActivationsFromId
        /// </summary>
        [OperationContract]
        List<ActivationDTO> LoadActivationsFromId(int agencyApplicationId);

        /// <summary>
        /// Save the Agent Content 
        /// </summary>
        [OperationContract]
        AppConnectResponse SaveAgencyContent(AgentContentDTO login);

        /// <summary>
        /// Save the Agent Content for REST clients
        /// </summary>
        [OperationContract]
        AppConnectResponse SaveAgentContentRest(AgentContentRestDto content);

        /// <summary>
        /// Save the Agent Content for Strata clients
        /// </summary>
        [OperationContract]
        AppConnectResponse SaveAgentContentStrata(AgentContentStrataDto content);

        /// <summary>
        /// Save an Activation
        /// </summary>
        [OperationContract]
        AppConnectResponse SaveActivation(ActivationDTO activation);

        /// <summary>
        /// Save the ServiceAgencyApplication 
        /// </summary>
        [OperationContract]
        AppConnectResponse SaveServiceAgencyApplication(ServiceAgencyApplicationDTO service);

        /// <summary>
        /// Delete the Agent Content 
        /// </summary>
        [OperationContract]
        AppConnectResponse DeleteAgentContent(AgentContentDTO agentContent);

        /// <summary>
        /// Delete the user login 
        /// </summary>
        [OperationContract]
        AppConnectResponse DeleteUserLogin(UserLoginDTO user);

        /// <summary>
        /// Save a UserLogin
        /// </summary>
        [OperationContract]
        AppConnectResponse SaveUserLogin(UserLoginDTO user);

        [OperationContract]
        void UpdateUserLogin(UserLoginDTO user);

        /// <summary>
        /// Load all UserLogins 
        /// </summary>
        [OperationContract]
        List<UserLoginDTO> GetUserLoginsForKey(int applicationKey);

        /// <summary>
        /// <summary>
        /// Returns true if the a UserLogin exists with the provided details
        /// </summary>
        [OperationContract]
        bool UserLoginExists(int originalUserId, int appKey, int typeId);

        /// <summary>
        /// Returns the UserLogin matching the provided details
        /// </summary>
        [OperationContract]
        UserLoginDTO UserLoginLoad(int originalUserId, int appKey, int typeId);

        /// <summary>
        /// Returns a list of ServiceAgencyApplications for the given key
        /// </summary>
        [OperationContract]
        List<ServiceAgencyApplicationDTO> LoadServiceAgencyApplicationFromKey(int? appKey);

        [OperationContract]
        string GetEnvironment();

        [OperationContract]
        ActionCheckResponse GetActionDetails(ActionCheckRequest request);

        [OperationContract]
        ScheduleResponse GetSchedulesFor(ScheduleRequest request, bool showAll = true);

        [OperationContract]
        UpdateScheduleResponse UpdateSchedule(UpdateScheduleRequest request);

        [OperationContract]
        List<ServiceDto> GetServices();

        // pretty sure this isn't used any more. Delete end of 2015 mw
//        [OperationContract]
//        UpdateResponse LogUpdate(UpdateRequest request);

        [OperationContract]
        UserLoginResponse GetUserLogins(UserLoginRequest request);

        [OperationContract]
        UpdateResponse UpdateApplicationVersion(VersionUpdateRequest request);

        [OperationContract]
        UpdateResponse UpdateFileSmartStatus(List<int> appKeys, bool status);

        //[OperationContract]
        //string UpdateLogin(UserLoginDTO loginDto);

        [OperationContract]
        UpdateResponse SyncRESTUserIDAfterPurge(UserLoginDTO login);

        [OperationContract]
        UpdateResponse SyncRESTUserLogins(int applicationKey, int userType, List<UserLoginSyncDTO> userList);
    }
}
