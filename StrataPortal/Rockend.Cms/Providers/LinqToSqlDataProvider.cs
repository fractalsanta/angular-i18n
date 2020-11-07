using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Linq;
using System.Linq;
using System.Reflection;
using Agile.Diagnostics.Logging;
using Communicator.DAL;
using Communicator.DAL.Entities;
using CommunicatorDto;

namespace Rockend.Cms.Providers
{
    /// <summary>
    /// A LinqToSql provider
    /// </summary>
    public class LinqToSqlDataProvider : IConfigurationDataProvider
    {
        private readonly string connectionString;
        /// <summary>
        /// Get the RestCentral connection string
        /// </summary>
        public string ConnectionString
        {
            get { return connectionString; }
        }

        /// <summary>
        /// ctor
        /// </summary>
        public LinqToSqlDataProvider(string connectionString)
        {
            this.connectionString = connectionString;            
        }

        public List<SpecialAppKey> LoadAllSpecialAppKeys()
        {
            using (var context = new RestCentral(ConnectionString))
            {
                try
                {
                    return context.GetTable<SpecialAppKey>().ToList();
                }
                catch (Exception ex)
                {
                    Logger.Error(ex, MethodBase.GetCurrentMethod().Name);
                    // just an empty list is fine when an error has occurred.
                    return new List<SpecialAppKey>();
                }
            }
        }

        /// <summary>
        /// Load AgentContent from the EF Context
        /// </summary>
        public AgentContent LoadAgentContent(int agencyApplicationId)
        {
            Logger.Debug(@"LoadAgentContent for AgencyApplicationId:{0}", agencyApplicationId);

            using (var db = new RestCentral(ConnectionString))
            {
                try
                {
                    var agentContent = (from content in db.AgentContents
                                        where content.AgencyApplicationId == agencyApplicationId 
                                        select content).FirstOrDefault();

                    Logger.Debug(@"AgentContent AgencyApplicationId:{0} {1} found in database", agencyApplicationId, (agentContent == null) ? "NOT" : "was");
                    return agentContent;
                }
                catch (Exception ex)
                {
                    Logger.Error(ex, "L2S LoadAgentContent");
                    return null;
                }
            }
        }

        public AgencyApplication CreateAgencyApplication(int agencyAccessId
            , string appCode, int appKey
            , string serialNumber, string description)
        {
            var app = new AgencyApplication
            {
                AgencyAccessID = agencyAccessId
                , ApplicationCode = appCode
                , ApplicationKey = appKey
                , SerialNumber = serialNumber
                , Description = description
            };

            using (var context = new RestCentral(ConnectionString))
            {
                context.AgencyApplications.InsertOnSubmit(app);
                context.SubmitChanges();
            }
            Logger.Debug("saved new AgencyApplication [id:{0}]", app.AgencyApplicationID);
            return app;
        }

        public Activation CreateActivation(AgencyApplication agencyApplication, string machineName)
        {
            return CreateActivation(agencyApplication.AgencyApplicationID, machineName);
        }

        public Activation CreateActivation(int agencyApplicationId, string machineName, bool isActive = true)
        {
            var activation = new Activation
            {
                MachineName = machineName,
                IsActive = isActive,
                Created = DateTime.Now,
                AgencyApplicationID = agencyApplicationId
            };

            Logger.Debug(@"ACT save to the db");
            using (var context = new RestCentral(ConnectionString))
            {
                context.Activation.InsertOnSubmit(activation);
                context.SubmitChanges();
            }
            Logger.Debug("saved new Activation [id:{0}]", activation.AgencyApplicationID);
            return activation;
        }

        public ServiceAgencyApplication CreateServiceAgencyApplication(int agencyApplicationID, int serviceID)
        {
            var rmhServiceAgencyApplication = new ServiceAgencyApplication
            {
                ServiceID = serviceID,
                AgencyApplicationID = agencyApplicationID,
                IsActive = true
            };

            Logger.Debug(@"SAA save to the db");
            using (var context = new RestCentral(ConnectionString))
            {
                context.ServiceAgencyApplications.InsertOnSubmit(rmhServiceAgencyApplication);
                context.SubmitChanges();
            }
            Logger.Debug("saved new ServiceAgencyApplication [id:{0}]", rmhServiceAgencyApplication.ServiceAgencyApplicationID);

            return rmhServiceAgencyApplication;
        }

        public AgencyApplication LoadAgencyApplicationData(int applicationKey)
        {

#if DEBUG
            Logger.Info(@"LoadAgencyApplicationData AppKey:{0} | {1}", applicationKey, ConnectionString);
#endif

            using (var db = new RestCentral(ConnectionString))
            {
                try
                {
                    var agencyApp = (from agencyApplication in db.AgencyApplications
                                     where agencyApplication.ApplicationKey == applicationKey
                                     select agencyApplication).FirstOrDefault();
                    if (agencyApp == null)
                        Logger.Info(@"LoadAgencyApplicationData FAILED to find match, AppKey:{0}", applicationKey);

                    return agencyApp;
                }
                catch (Exception ex)
                {
                    Logger.Error(ex, "L2S LoadAgencyApplicationData");
                    return null;
                }
            }
        }

        /// <summary>
        /// Write activations to the log.
        /// </summary>
        private static void LogActivations(AgencyApplication agencyApp)
        {
            var activations = agencyApp.Activations;
            if (activations == null) 
                return;

            foreach (Activation activation in activations)
            {
                if (activation == null)
                    continue;
                Logger.Debug("{0} {1} {2}", activation.ActivationId, activation.AgencyApplicationID, activation.MachineName);
            }
        }

        /// <summary>
        /// Load AgentContent from the EF Context
        /// </summary>
        public AgencyApplication LoadAgencyApplicationData(string serialNumber, string applicationCode)
        {
            Logger.Debug(@"L2S-LoadAgencyApplicationData sn:{0} appCode:{1}", serialNumber, applicationCode);

            using (var db = new RestCentral(ConnectionString))
            {
                try
                {
                    var agencyApp = (from agencyApplication in db.AgencyApplications
                                        where agencyApplication.SerialNumber == serialNumber
                                            && agencyApplication.ApplicationCode == applicationCode
                                        select agencyApplication).FirstOrDefault();

                    if (agencyApp != null)
                        Logger.Debug(@"L2S.LoadAgencyApplicationData found match ApplicationKey:{0}", agencyApp.ApplicationKey);
                    else
                        Logger.Debug(@"L2S.LoadAgencyApplicationData FAILED to find match, sn:{0} appCode:{1}", serialNumber, applicationCode);

                    return agencyApp;
                }
                catch (Exception ex)
                {
                    Logger.Error(ex, "L2S - LoadAgencyApplicationData");
                    return null;
                }
            }
        }


        /// <summary>
        /// Save NOT available with this context
        /// </summary>
        public void Save(AgentContent login)
        {
            using (var context = new RestCentral(ConnectionString))
            {
                try
                {
                    if (login.AgentContentId == 0)
                    {
                        Logger.Debug("Adding AgentContent for id:{0} to context", login.AgencyAccessId);
                        context.AgentContents.InsertOnSubmit(login);
                    }
                    else
                    {
                        login.UpdatedDate = DateTime.Now;
                        context.AgentContents.Attach(login);
                        context.Refresh(RefreshMode.KeepCurrentValues, login);
                    }

                    context.SubmitChanges();
                }
                catch (Exception ex)
                {
                    Logger.Error(ex, "L2S - Save (AgentContent)");
                }
            }
        }

        public void Delete(AgentContent agentContent)
        {
            using (var context = new RestCentral(ConnectionString))
            {
                try
                {
                    context.AgentContents.Attach(agentContent);
                    context.AgentContents.DeleteOnSubmit(agentContent);
                    context.SubmitChanges();
                }
                catch (Exception ex)
                {
                    Logger.Error(ex, "L2S - Delete (AgenctContent)");
                }
            }
        }

        public void Delete(UserLogin user)
        {
            using (var context = new RestCentral(ConnectionString))
            {
                try
                {
                    // cant add given userLogin to a new context
                    var loaded = LoadAndSyncUserLogin(user, context);
                    if (loaded != null)
                    {
                        context.UserLogins.DeleteOnSubmit(loaded);
                        context.SubmitChanges();
                    }
                }
                catch (Exception ex)
                {
                    Logger.Error(ex, "L2S - Delete (User)");
                }
            }
        }

        public bool UserLoginExists(int id, int appKey, int typeId)
        {
            using (var context = new RestCentral(ConnectionString))
            {
                try
                {
                    return UserLoginExists(id, appKey, typeId, context);
                }
                catch (Exception ex)
                {
                    Logger.Error(ex, "L2S - UserLoginExists");
                    context.Dispose();
                    return false;
                }
            }
        }

        public bool UserLoginExists(int id, int appKey, int typeId, RestCentral context)
        {
            if (context == null)
                throw new Exception("context is required.");

            return UserLoginLoad(id, appKey, typeId, context) != null;
        }

        public UserLogin UserLoginLoad(int originalUserId, int appKey, int typeId)
        {
            using (var context = new RestCentral(ConnectionString))
            {
                return UserLoginLoad(originalUserId, appKey, typeId, context);
            }
        }

        public UserLogin UserLoginLoad(int originalUserId, int appKey, int typeId, RestCentral context)
        {
            Logger.Debug(@"Check if UserLogin exists [{0} | {1} | {2}]", appKey, originalUserId, typeId);

            // NOTE: DO NOT match on ALPHA as this is one of the value that may have changed.
            var login = (from content in context.UserLogins
                         where content.OriginalUserId == originalUserId
                             && content.ApplicationKey == appKey
                             && content.UserTypeId == typeId
                         select content).FirstOrDefault();

            Logger.Debug("UserLogin found ({0})", login != null);
            return login;
        }

        /// <summary>
        /// Returns true if can connect to the Communicator database
        /// </summary>
        public bool CanConnect
        {
            get
            {
                try
                {
                    using (var db = new RestCentral(ConnectionString))
                    {
                        db.Connection.Open();
                    }
                }
                catch (Exception ex)
                {
                    Logger.Error(ex, "L2S - CanConnect");
                    return false;
                }
                return true;
            }
        }

        /// <summary>
        /// Save NOT available with this context
        /// </summary>
        public void Save(UserLogin login)
        {
            using (var context = new RestCentral(ConnectionString))
            {
                try
                {
                    if (login.UserLoginId == 0)
                        context.UserLogins.InsertOnSubmit(login);
                    else
                    {
                        // cant add given userLogin to a new context
                        var loaded = LoadAndSyncUserLogin(login, context);
//                        if(loaded != null)
                        Logger.Debug(loaded.ToString());
                    }

                    context.SubmitChanges();
                }
                catch (Exception ex)
                {
                    Logger.Error(ex, "L2S - Save (UserLogin)");
                    throw; // need to throw error on save so can show why failed
                }
            }
        }
        
        /// <summary>
        /// Save changes to the ServiceAgencyApplication
        /// </summary>
        public void Save(ServiceAgencyApplication service)
        {
            if (service == null)
                return;

            using (var context = new RestCentral(ConnectionString))
            {
                try
                {
                    if (service.ServiceAgencyApplicationID == 0)
                    {
                        if (service.AgencyApplicationID == 0)
                        {
                            if (service.ApplicationKey == 0)
                                throw new Exception("Trying to save ServiceAgencyApplication but AgencyApplicationId AND ApplicationKey are both 0!");
                            var agencyApp = LoadAgencyApplicationData(service.ApplicationKey);
                            if(agencyApp == null)
                                throw new Exception(string.Format("Trying to save ServiceAgencyApplication, failed to load AgencyApplication using ApplicationKey:{0}", service.ApplicationKey));
                            service.AgencyApplicationID = agencyApp.AgencyApplicationID;
                        }
                        Logger.Info("Creating NEW ServiceAgencyApplication record for appKey:{0}", service.ApplicationKey);
                        context.ServiceAgencyApplications.InsertOnSubmit(service);
                    }
                    else
                    {
                        Logger.Debug("Save existing service record for appKey:{0} isActive:{1}", service.ServiceAgencyApplicationID, service.IsActive);
                        // cant add given userLogin to a new context
                        var loaded = context.ServiceAgencyApplications.FirstOrDefault(act => act.ServiceAgencyApplicationID == service.ServiceAgencyApplicationID);
                        if (loaded != null)
                            loaded.IsActive = service.IsActive;
                    }
                    context.SubmitChanges();
                }
                catch (ChangeConflictException cfex)
                {
                    Logger.Error(cfex, "L2S - ChangeConflictException in Save (ServiceAgencyApplication)");
                    // just ignore
                }
                catch (Exception ex)
                {
                    Logger.Error(ex, "L2S - Exception in Save (ServiceAgencyApplication)");
                    throw; // need to throw error on save so can show why failed
                }
            }
        }

        /// <summary>
        /// Save changes to the Activation
        /// </summary>
        public void Save(Activation activation)
        {
            if (activation == null)
                return;

            if (activation.Created == DateTime.MinValue)
                activation.Created = DateTime.Now;


            using (var context = new RestCentral(ConnectionString))
            {
                try
                {
                    if (activation.ActivationId == 0)
                    {
                        Logger.Info("Creating NEW Activation record for appKey:{0}", activation.ApplicationKey);
                        // may also need to set the AgencyApplicationId (needed for FK
                        if (activation.AgencyApplicationID == 0)
                        {
                            var app = LoadAgencyApplicationData(activation.ApplicationKey);
                            if (app != null)
                                activation.AgencyApplicationID = app.AgencyApplicationID;
                            else
                            {
                                Logger.Debug("Save activation failed because could not load (to get the id) AgencyApplication for appKey:{0}", activation.ApplicationKey);
                                return;
                            }
                        }
                        context.Activation.InsertOnSubmit(activation);
                    }
                    else
                    {
                        Logger.Debug("Save existing Activation record for appKey:{0} isActive:{1}", activation.ApplicationKey, activation.IsActive);
                        // cant add given userLogin to a new context
                        var loaded = context.Activation.FirstOrDefault(act => act.ActivationId == activation.ActivationId);
                        if (loaded != null)
                            loaded.IsActive = activation.IsActive;
                    }
                    context.SubmitChanges();
                }
                catch (ChangeConflictException cfex)
                {
                    Logger.Error(cfex, "L2S - ChangeConflictException in Save (Activation)");
                    // just ignore
                }
                catch (Exception ex)
                {
                    Logger.Error(ex, "L2S - Exception in Save (Activation)");
                    throw; // need to throw error on save so can show why failed
                }
            }
        }

        private UserLogin LoadAndSyncUserLogin(UserLogin userLogin, RestCentral context)
        {
            var loaded = (from user in context.UserLogins
                          where user.UserLoginId == userLogin.UserLoginId
                          select user).FirstOrDefault();
            if (loaded == null)
            {
                Logger.Debug("Trying to update an existing UserLogin but failed to load it from the database [id:{0}]", userLogin.UserLoginId);
                return null;
            }
            // updated the object loaded in this context with changes in provided userlogin
            return loaded.Sync(userLogin);
        }

        /// <summary>
        /// Provide your own context for persistent calls
        /// </summary>
        /// <remarks>To save a List of items, provide your own context then call submitChanges</remarks>
        public List<UserLogin> GetUserLoginsFor(RestCentral context, int applicationKey)
        {
            try
            {
                var found = (context.UserLogins
                    .Where(login => login.ApplicationKey == applicationKey))
                    .ToList();
                Logger.Debug("Found {0} UserLogins for {1}", found.Count, applicationKey);
                return found;
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "L2S - GetUserLoginsFor (RestCentral, application key)");
                return null;
            }
        }


        public List<UserLogin> GetUserLoginsFor(int applicationKey)
        {
            using (var context = new RestCentral(ConnectionString))
            {
                return GetUserLoginsFor(context, applicationKey);
            }
        }

        public List<ServiceAgencyApplication> LoadServiceAgencyApplicationFromKey(int? appKey)
        {
            List<ServiceAgencyApplication> result = null;
            Logger.Debug(@"LoadServiceAgencyApplicationFromKey appKey:{0}", appKey);

            if (appKey != null)
            {
                var agencyApplication = LoadAgencyApplicationData(appKey.Value);
                if (agencyApplication == null)
                {
                    Logger.Debug("LoadServiceAgencyApplicationFromKey no agencyApplication found for {0}", appKey.Value);
                    return new List<ServiceAgencyApplication>();
                }
                result = LoadServiceAgencyApplicationsFromId(agencyApplication.AgencyApplicationID);
                Logger.Info("LoadServiceAgencyApplicationsFromKey [count:{0}] apps for {1}", result.Count, appKey.Value);
                Logger.Debug("manually set the AppKey");
                result.ForEach(app => app.ApplicationKey = appKey.Value);
            }
            else
            {
                Logger.Debug("LoadServiceAgencyApplicationFromKey - No app key");
            }

            return result;
        }

        /// <summary>
        /// Loads service by agency application key and service key.
        /// </summary>
        /// <param name="appKey">app key</param>
        /// <param name="serviceKey">service key</param>
        /// <returns>Service if it exists</returns>
        public ServiceAgencyApplication LoadServiceAgencyApplicationByServiceKey(int appKey, int serviceKey)
        {
            if(appKey < 1)
                return null; // no point looking

            // noisy! only uncomment if needed for investigation
//            Logger.Debug(@"LoadServiceAgencyApplicationByServiceKey appKey:{0} servicekey: {1}", appKey, serviceKey);

            // Get agency application id
            var agencyApplication = LoadAgencyApplicationData(appKey);

            if (agencyApplication == null)
            {
                Logger.Debug(@"LoadServiceAgencyApplicationByServiceKey appKey:{0} servicekey: {1} - No agency application exists. returning null.", appKey, serviceKey);
                return null;
            }
            
            using (var context = new RestCentral(connectionString))
            {
                return context.ServiceAgencyApplications.FirstOrDefault(item => 
                    item.AgencyApplicationID == agencyApplication.AgencyApplicationID
                    && item.Service.ServiceKey == serviceKey);
            }
        }

        public List<ServiceAgencyApplication> LoadServiceAgencyApplicationsFromId(int agencyApplicationID)
        {
            List<ServiceAgencyApplication> saa = null;      
            using (var context = new RestCentral (connectionString ))
            {
                saa = context.ServiceAgencyApplications.Where(item => item.AgencyApplicationID == agencyApplicationID).ToList();
            }
            return saa;
        }

        public List<Activation> LoadActivationsFromKey(int? appKey)
        {
            if (!appKey.HasValue)
            {
                Logger.Warning("LoadActivationsFromKey appKey does not have a value!");
                return new List<Activation>(); // return an empty list
            }

            Logger.Info("LoadActivationsFromKey {0}", appKey.Value);

            var agencyApplication = LoadAgencyApplicationData(appKey.Value);
            if (agencyApplication == null)
            {
                Logger.Debug("LoadActivationsFromKey no agencyApplication found for {0}", appKey.Value);
                return new List<Activation>();
            }

            var activations = LoadActivationsFromId(agencyApplication.AgencyApplicationID);
            Logger.Info("LoadActivationsFromKey [count:{0}] activations for {1}", activations.Count, appKey.Value);
            if(activations.Count == 0)
                Logger.Warning("ZERO ACTIVATIONS for appKey: {0}. Request willl not be responded to!!");
            // manually set the AppKey on the activations
            activations.ForEach(activation => activation.ApplicationKey = appKey.Value);
            return activations;
        }

        public List<Activation> LoadActivationsFromId(int agencyApplicationId)
        {
            List<Activation> activations = null;
 
#if DEBUG
            Logger.Debug("LoadActivationsFromId ({0}) | {1}", agencyApplicationId, ConnectionString);
#endif

            using (var context = new RestCentral(ConnectionString))
            {
                Logger.Info("LoadActivationsFromId context.DatabaseExists {0}", context.DatabaseExists());
                activations = context.Activation.Where(item => item.AgencyApplicationID == agencyApplicationId).ToList();
            }

            return activations;
        }


        //public global::CommunicatorDto.AgentContentRestDto LoadAgentContentRest(int agencyApplicationId)
        //{
        //    throw new NotImplementedException();
        //}
        public AgentContentRestDto LoadAgentContentRest(int agencyApplicationId)
        {
            var response = new AgentContentRestDto();
            try
            {
                var contentFromDb = LoadAgentContent(agencyApplicationId);
                
                if(contentFromDb == null)
                    return null;

                response.AgentContent = contentFromDb.ToDto();


                using (var db = new RestCentral(ConnectionString))
                {
                    var restAC = db.GetTable<AgentContentRest>().FirstOrDefault(a => a.AgentContentId == response.AgentContent.AgentContentId);

                    if (restAC != null)
                    {
                        response.ShowMaintenanceDetails = restAC.ShowMaintenanceDetails;
                        response.ShowMaintenanceImages = restAC.ShowMaintenanceImages;
                        response.ShowMaintenancePage = restAC.ShowMaintenancePage;
                        response.ShowManagerPhoto = restAC.ShowManagerPhoto;
                        response.ShowInvoicesPage = restAC.ShowInvoicesPage;
                        response.ShowOutstandingInvoices = restAC.ShowOutstandingInvoices;
                        response.ShowInspectionsTab = restAC.ShowInspectionsTab;
                        response.ShowOwnerContacts = restAC.ShowOwnerContacts;
                    }
                }
            }
            catch (Exception e)
            {
                Logger.Error(e, "LoadAgentContentRest: Error loading REST AgentContent for AgencyApplicationId: {0}", agencyApplicationId);
            }
            return response;
        }

        public AgentContentStrataDto LoadAgentContentStrata(int agencyApplicationId)
        {
            AgentContentStrataDto response = new AgentContentStrataDto();
            try
            {
                AgentContent contentFromDb = LoadAgentContent(agencyApplicationId);

                if (contentFromDb == null)
                    return null;

                response.AgentContent = contentFromDb.ToDto();

                using (var db = new RestCentral(ConnectionString))
                {
                    var strataAC = db.GetTable<AgentContentStrata>().FirstOrDefault(a => a.AgentContentId == response.AgentContent.AgentContentId);

                    if (strataAC != null)
                    {
                        response.ShowManagerNameAndPhoto = strataAC.ShowManagerNameAndPhoto;
                        response.ShowPropertyPhoto = strataAC.ShowPropertyPhoto;
                        response.ShowManagerEmail = strataAC.ShowManagerEmail;

                        response.ShowMaintenanceDetailsExec = strataAC.ShowMaintenanceDetailsExec;
                        response.ShowMaintenanceDetailsOwner = strataAC.ShowMaintenanceDetailsOwner;
                        response.ShowMaintenancePageExec = strataAC.ShowMaintenancePageExec;
                        response.ShowMaintenancePageOwner = strataAC.ShowMaintenancePageOwner;
                        response.ShowMaintenanceImages = strataAC.ShowMaintenanceImages;
                        response.IsFsDocumentDescriptionOn = strataAC.IsFsDocumentDescriptionOn;
                        response.ShowReportsPageOwner = strataAC.ShowReportsPageOwner;
                        response.ShowReportsPageCommitteeMember = strataAC.ShowReportsPageCommitteeMember;
                        response.ShowMeetingsPageOwner = strataAC.ShowMeetingsPageOwner;
                        response.ShowMeetingsPageCommitteeMember = strataAC.ShowMeetingsPageCommitteeMember;
                    }
                }
            }
            catch (Exception e)
            {
                Logger.Error(e, "LoadAgentContentstrata: Error loading strata AgentContent for AgencyApplicationId: {0}", agencyApplicationId);
            }
            return response;
        }
    }
}
