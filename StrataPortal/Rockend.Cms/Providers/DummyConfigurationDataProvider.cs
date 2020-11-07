using System;
using System.Collections.Generic;
using Communicator.DAL;

namespace Rockend.Cms.Providers
{
    public class DummyConfigurationDataProvider : IConfigurationDataProvider
    {
        public AgentContent LoadAgentContent(int agencyApplicationId)
        {
            if (agencyApplicationId < 0)
                throw new Exception("key cannot be < 0 when loading client content from RockendCms.");
            return (agencyApplicationId == 0)
                       ? AgentContent.Testing.GetDevine()
                       : AgentContent.GetDefault();
        }

        public AgencyApplication LoadAgencyApplicationData(string serialNumber, string applicationCode)
        {
            throw new NotImplementedException();
        }

        public AgencyApplication LoadAgencyApplicationData(int applicationKey)
        {
            throw new NotImplementedException();
        }

        public List<Activation> LoadActivationsFromKey(int? appKey)
        {
            throw new NotImplementedException();
        }

        public List<Activation> LoadActivationsFromId(int agencyApplicationId)
        {
            throw new NotImplementedException();
        }

        public void Save(AgentContent login)
        {
            throw new NotImplementedException();
        }

        public void Save(Activation activation)
        {
            throw new NotImplementedException();
        }

        public void Save(ServiceAgencyApplication service)
        {
            throw new NotImplementedException();
        }

        public void Delete(AgentContent agentContent)
        {
            throw new NotImplementedException();
        }

        public void Delete(UserLogin user)
        {
            throw new NotImplementedException();
        }

        public bool CanConnect
        {
            get { throw new NotImplementedException(); }
        }

        public string ConnectionString
        {
            get { throw new NotImplementedException(); }
        }

        public void Save(UserLogin user)
        {
            throw new NotImplementedException();
        }

        public List<UserLogin> GetUserLoginsFor(int applicationKey)
        {
            throw new NotImplementedException();
        }

        public List<UserLogin> GetUserLoginsFor(RestCentral context, int applicationKey)
        {
            throw new NotImplementedException();
        }

        public bool UserLoginExists(int id, int appKey, int typeId, RestCentral context)
        {
            throw new NotImplementedException();
        }

        public bool UserLoginExists(int id, int appKey, int typeId)
        {
            throw new NotImplementedException();
        }

        public UserLogin UserLoginLoad(int originalUserId, int appKey, int typeId, RestCentral context)
        {
            throw new NotImplementedException();
        }

        public UserLogin UserLoginLoad(int originalUserId, int appKey, int typeId)
        {
            throw new NotImplementedException();
        }

        public List<ServiceAgencyApplication> LoadServiceAgencyApplicationFromKey(int? appKey)
        {
            throw new NotImplementedException();
        }

        public ServiceAgencyApplication LoadServiceAgencyApplicationByServiceKey(int appKey, int serviceKey)
        {
            throw new NotImplementedException();
        }


        public global::CommunicatorDto.AgentContentRestDto LoadAgentContentRest(int agencyApplicationId)
        {
            throw new NotImplementedException();
        }


        public global::CommunicatorDto.AgentContentStrataDto LoadAgentContentStrata(int agencyApplicationId)
        {
            throw new NotImplementedException();
        }
    }
}