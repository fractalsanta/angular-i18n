using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Linq;
using System.Linq;
using System.Linq.Expressions;
using System.Reactive.Linq;
using System.Reflection;
using System.Runtime.Remoting.Contexts;
using Agile.Diagnostics.Logging;
using Communicator.DAL;
using Communicator.DAL.Helpers;
using Microsoft.Azure;
using Rockend.Common;
using Rockend.Common.Helpers;
using CommunicatorDto;

namespace RwacUtility.Objects
{
    public interface ICentralRepository : IGenericRepository
    {
        string GetDatabaseName();

        AgencyApplication UpdateAppVersionInfo(VersionInfoDTO changed, AgencyApplication app);
        AgencyApplication UpdateAppVersionInfo(DataContext context, VersionInfoDTO changed, AgencyApplication app);

        IList<Activation> LoadMachineActivations(DataContext context, AgencyApplication app);
        IList<ServiceAgencyApplication> LoadServiceActivations(DataContext context, AgencyApplication app);
        
        AdminSetting LoadAdminSettings();
        void LoadAgenciesAsync(IList<string> appKeys);

        List<AgencyAccess> LoadAgencies(DataLoadOptions options
            , Expression<Func<AgencyAccess, bool>> agencyWhere
            , Expression<Func<AgencyApplication, bool>> applicationWhere);

        List<AgencyAccess> LoadAgencies(RestCentral context
            , Expression<Func<AgencyAccess, bool>> agencyWhere
            , Expression<Func<AgencyApplication, bool>> applicationWhere);

        List<AgencyAccess> LoadAgenciesWithAppsAndVersionInfo(Expression<Func<AgencyAccess, bool>> agencyWhere
            , Expression<Func<AgencyApplication, bool>> applicationWhere
            , bool includeActivations = false);

        List<AgencyAccess> LoadAllAgenciesForService(Service service);

        void UpdateAgencyAccess(DataContext context, AgencyAccess agency);
        bool UpdateAgencyInfos(AgencyInfoMeta meta, List<AgencyInfo> infos);
        bool UpdateAgencyInfos(DataContext context, AgencyInfoMeta meta, List<AgencyInfo> infos);

        IQueryable<AgencyInfo> LoadAgencyInfos(DataContext context, string serialNumber);
        IList<AgencyInfo> LoadAgencyInfos(string serialNumber);
        AgencyAccess LoadAgencyAccess(int appKey);
        AgencyAccess LoadAgencyAccess(DataContext context, int appKey);
        AgencyAccess LoadAgencyAccess(string clientCode);
        AgencyApplication LoadAgencyApplication(string serialNumber);
        List<AgencyAccess> LoadOneApplicationPerAgency(IList<string> applicationKeys);

        AgencyInfoMeta LoadAgencyInfoMeta(string serialNumber);
        AgencyInfoMeta LoadAgencyInfoMeta(DataContext context, string serialNumber);

        string GetClientCode(DataContext context, int appKey);
        string GetClientCode(int appKey);

        List<AgencyApplication> GetAllAppsRunningOnSameMachine(int appKey);
        List<AgencyApplication> GetAllAppsRunningOnSameMachine(DataContext context, int appKey);

        AgencyInfoMeta CreateAgencyInfoMeta(string serialNumber, string clientCode, string agencyName, string source);

        AgencyInfoMeta CreateAgencyInfoMeta(DataContext context, string serialNumber, string clientCode, string agencyName, string source);

        void SaveAdminSettings(AdminSetting adminSetting);
        void SaveAdminSettings(DataContext context, AdminSetting adminSetting);

        void SetToAppendEnvironmentToConnString();
        DataContext GetRESTCentralContext(string environmentOverride = null);
    }

    public class CentralRepository : ICentralRepository
    {

        /// <summary>
        /// ctor
        /// </summary>
        public CentralRepository()
        {
            Logger.Debug("CentralRepo.ctor");

        }

        private IEnvironmentService environmentService;

        protected IEnvironmentService EnvironmentService
        {
            get { return environmentService ?? (environmentService = SimpleContainer.GetInstance<IEnvironmentService>()); }
        }

        private bool isEnvironmentAppendedToConnString = false;
        /// <summary>
        /// depends on the app that consuming this DAL, most do not append but some do
        /// </summary>
        public void SetToAppendEnvironmentToConnString()
        {
            isEnvironmentAppendedToConnString = true;
        }

        public DataContext GetRESTCentralContext(string environmentOverride = null)
        {
            var connectionString = EnvironmentService.GetConnectionString("RestCentralConnString", isEnvironmentAppendedToConnString, environmentOverride);

            if(string.IsNullOrEmpty(connectionString))
                Logger.Warning("RockendCentral connection string is null! Env: {0}", EnvironmentService.GetEnvironment());
            return new RestCentral(connectionString);
        }


        public string GetDatabaseName()
        {
            using (DataContext context = GetRESTCentralContext())
            {
                try
                {
                    return context.Connection.Database;
                }
                catch (Exception ex)
                {
                    Logger.Info("ERROR: {0}", ex.Message);
                    return "error";
                }
            }
        }

        /// <summary>
        /// Generic find
        /// </summary>
        public T Find<T>(Func<T, bool> match) where T : class
        {
            using (DataContext context = GetRESTCentralContext())
            {
                return Find(context, match);
            }
        }

        /// <summary>
        /// Generic find
        /// </summary>
        public T Find<T>(DataContext context, Func<T, bool> match) where T : class
        {
			try
			{
                return context.GetTable<T>().SingleOrDefault(match);
                }
                catch (Exception ex)
                {
                    Logger.Error(ex, "Find<{0}>", typeof(T).Name);
                    return null;
                }
        }


        /// <summary>
        /// Generic find All
        /// </summary>
        public IList<T> FindAll<T>(Func<T, bool> match) where T : class
        {
            using (DataContext context = GetRESTCentralContext())
            {
                return context.GetTable<T>().Where(match).ToList();
            }
        }

        public int Insert<T>(T record) where T : class
        {
            if (record == null)
                return 0;

            try
            {
                using (DataContext context = GetRESTCentralContext())
                {
                    var table = context.GetTable<T>();
                    table.InsertOnSubmit(record);
                    context.SubmitChangesRetry();
                }
                return 1;
            }
            catch (Exception ex)
            {
                Logger.Error(ex, MethodBase.GetCurrentMethod().Name);
                return 0;
            }
        }

        public int Insert<T>(List<T> records) where T : class
        {
            if (records == null || !records.Any())
                return 0;

            try
            {
                using (DataContext context = GetRESTCentralContext())
                {
                    var table = context.GetTable<T>();
                    table.InsertAllOnSubmit(records);
                    context.SubmitChangesRetry();
                }
                return records.Count;
            }
            catch (Exception ex)
            {
                Logger.Error(ex, MethodBase.GetCurrentMethod().Name);
                return 0;
            }

        }

        public int InsertOneByOne<T>(List<T> records) where T : class
        {
            if (records == null || !records.Any())
                return 0;

            try
            {
                using (DataContext context = GetRESTCentralContext())
                {
                    records.ForEach(record =>
                    {
                        try
                        {
                            var table = context.GetTable<T>();
                            table.InsertOnSubmit(record);
                            context.SubmitChangesRetry();
                        }
                        catch (Exception ex)
                        {
                            Logger.Error(ex, "{0} (internal)", MethodBase.GetCurrentMethod().Name);
                        }
                    });
                }
                return records.Count;
            }
            catch (Exception ex)
            {
                Logger.Error(ex, MethodBase.GetCurrentMethod().Name);
                return 0;
            }

        }

        public int Update<T>(T updated) 
            where T : class
        {
            if (updated == null)
                return 0;

            try
            {
                using (DataContext context = GetRESTCentralContext())
                {
                    // we're updating an existing detached object, so always need to attach it
                    Logger.Debug("repo.Update() Attach: ", updated); // this is a new line in a frequently used bit of code, adding this log line so we can clearly see if doing the attach causes errors. I don't expect it to, just being overly cautious.
                    context.GetTable<T>().Attach(updated);
                    Update(context, updated);
                    context.SubmitChangesRetry();
                }
                return 1;
            }
            catch (Exception ex)
            {
                Logger.Error(ex, MethodBase.GetCurrentMethod().Name);
                return -1;
            }
        }

        public int Update<T>(DataContext context, T updated)
            where T : class
        {
            if (updated == null)
                return 0;

            try
            {
                var table = context.GetTable<T>();
                if(! table.Contains(updated))
                    table.Attach(updated);
                context.Refresh(RefreshMode.KeepCurrentValues, updated);
                return 1;
            }
            catch (Exception ex)
            {
                Logger.Error(ex, MethodBase.GetCurrentMethod().Name);
                return -1;
            }
        }

        public int Delete<T>(T delete) where T : class
        {
            if (delete == null)
                return 0;

            Logger.Info("Delete {0}. {1}", typeof(T).Name, delete);
            try
            {
                using (DataContext context = GetRESTCentralContext())
                {
                    var table = context.GetTable<T>();
                    table.Attach(delete);
                    table.DeleteOnSubmit(delete);
                    context.SubmitChangesRetry();
                }
                return 1;
            }
            catch (Exception ex)
            {
                Logger.Error(ex, MethodBase.GetCurrentMethod().Name);
                return -1;
            }
        }


        public AdminSetting LoadAdminSettings()
        {
            using (DataContext context = GetRESTCentralContext())
            {
                return context.GetTable<AdminSetting>()
                    .FirstOrDefault();
            }
        }

        public void SaveAdminSettings(DataContext context, AdminSetting adminSetting)
        {
            try
            {
                var current = context.GetTable<AdminSetting>().FirstOrDefault();
                if (current == null)
                {
                    Logger.Warning("Failed to load AdminSetting");
                    return;
                }
                current.FtpSite = adminSetting.FtpSite;
                current.FtpUserName = adminSetting.FtpUserName;
                current.FtpPassword = adminSetting.FtpPassword;
                current.RwacVersion = adminSetting.RwacVersion;
                current.RwacBetaVersion = adminSetting.RwacBetaVersion;
                current.LastUpdatedSageCompanyId = adminSetting.LastUpdatedSageCompanyId;

                context.SubmitChangesRetry();
            }
            catch (Exception ex)
            {
                Logger.Error(ex, MethodBase.GetCurrentMethod().Name);
            }
        }

        public void SaveAdminSettings(AdminSetting adminSetting)
        {
            using (DataContext context = GetRESTCentralContext())
            {
                SaveAdminSettings(context, adminSetting);
            }
        }


        public IList<AgencyInfo> LoadAgencyInfos(string serialNumber)
        {
            Logger.Debug("LoadAgencyInfos: {0}",serialNumber ?? "null");
            using (DataContext context = GetRESTCentralContext())
            {
                return LoadAgencyInfos(context, serialNumber).ToList(); // can't return IQueryable, needs an undisposed context
            }
        }

        /// <summary>
        /// Returns all AgencyInfo records for the given ClientCode and SerialNumber combo
        /// </summary>
        public IQueryable<AgencyInfo> LoadAgencyInfos(DataContext context, string serialNumber)
        {
            return (from agencyInfo in context.GetTable<AgencyInfo>()
                    join metaInfo in context.GetTable<AgencyInfoMeta>() on agencyInfo.AgencyInfoMetaId equals metaInfo.AgencyInfoMetaId
                    where metaInfo.SerialNumber == serialNumber
                    select agencyInfo);
        }

        /// <summary>
        /// Strata saves and uses the agencyGuid (which is why SN is 64 in the meta table)
        /// </summary>
        /// <param name="serialNumber"></param>
        /// <returns></returns>
        public AgencyInfoMeta LoadAgencyInfoMeta(string serialNumber)
        {
            using (var context = GetRESTCentralContext())
            {
                return GetAgencyInfoMeta(context, serialNumber);
            }
        }

        public AgencyInfoMeta LoadAgencyInfoMeta(DataContext context, string serialNumber)
        {
            return GetAgencyInfoMeta(context, serialNumber);
        }

        /// <summary>
        /// There is one meta record per serial number, therefore multiple per clientCode
        /// </summary>
        public AgencyInfoMeta GetAgencyInfoMeta(DataContext context, string serialNumber)
        {
            Logger.Debug("GetAgencyInfoMeta: {0}",serialNumber ?? "null");
            return (from meta in context.GetTable<AgencyInfoMeta>()
                    where meta.SerialNumber == serialNumber
                    select meta).FirstOrDefault();
        }       

        public AgencyAccess LoadAgencyAccess(string clientCode)
        {
            using (var context = GetRESTCentralContext())
            {
                return LoadAgencyAccess(context, clientCode);
            }
        }

        public AgencyAccess LoadAgencyAccess(DataContext context, string clientCode)
        {
            return (from agency in context.GetTable<AgencyAccess>()
                    where agency.ClientCode == clientCode
                    select agency).FirstOrDefault();
        }

        public AgencyAccess LoadAgencyAccess(int appKey)
        {
            using (var context = GetRESTCentralContext())
            {
                return LoadAgencyAccess(context, appKey);
            }
        }

        public AgencyAccess LoadAgencyAccess(DataContext context, int appKey)
        {
            return (from aa in context.GetTable<AgencyApplication>()
                    join agency in context.GetTable<AgencyAccess>() on aa.AgencyAccessID equals agency.AgencyAccessID
                    where aa.ApplicationKey == appKey
                    select agency).FirstOrDefault();
        }

        public AgencyApplication LoadAgencyApplication(string serialNumber)
        {
            using (var context = GetRESTCentralContext())
            {
                return LoadAgencyApplication(context, serialNumber);
            }
        }

        public AgencyApplication LoadAgencyApplication(DataContext context, string serialNumber)
        {
            return (from app in context.GetTable<AgencyApplication>()
                    where app.SerialNumber == serialNumber
                    select app).FirstOrDefault();
        }

        public string GetClientCode(int appKey)
        {
            using (var context = GetRESTCentralContext())
            {
                return GetClientCode(context, appKey);
            }
        }

        public string GetClientCode(DataContext context, int appKey)
        {
            try
            {
                return (from aa in context.GetTable<AgencyApplication>()
                    join agency in context.GetTable<AgencyAccess>() on aa.AgencyAccessID equals agency.AgencyAccessID
                    where aa.ApplicationKey == appKey && agency.ClientCode != null
                    select agency.ClientCode).FirstOrDefault();
            }
            catch (Exception ex)
            {
                Logger.Error(ex, MethodBase.GetCurrentMethod().Name);
                return string.Empty;
            }
        }

        public List<AgencyApplication> GetAllAppsRunningOnSameMachine(int appKey)
        {
            using (var context = GetRESTCentralContext())
            {
                context.DeferredLoadingEnabled = false;
                return GetAllAppsRunningOnSameMachine(context, appKey);
            }
        }

        public List<AgencyApplication> GetAllAppsRunningOnSameMachine(DataContext context, int appKey)
        {
            // need to load the app record so we can get the machine name the app is running on.
            var appKeyRecord = (from aa in context.GetTable<AgencyApplication>()
                                where aa.ApplicationKey == appKey
                                select aa).FirstOrDefault();
            if (appKeyRecord == null)
            {
                Logger.Warning("failed to find record for appKey: {0}", appKey);
                return new List<AgencyApplication>();
            }
            // now get all apps that are running on the same machine (with the same agency!)
            var allOnSameMachine = (from aa in context.GetTable<AgencyApplication>()
                                    where aa.AgencyAccessID == appKeyRecord.AgencyAccessID
                                    && aa.AppMachine == appKeyRecord.AppMachine
                                    select aa).ToList();
            return allOnSameMachine;
        }

        public AgencyInfoMeta CreateAgencyInfoMeta(string serialNumber, 
            string clientCode, 
            string agencyName,
            string source)
        {
            using (var context = GetRESTCentralContext())
            {
                return CreateAgencyInfoMeta(context, serialNumber, clientCode, agencyName, source);
            }
        }

        public AgencyInfoMeta CreateAgencyInfoMeta(DataContext context,
            string serialNumber,
            string clientCode,
            string agencyName,
            string source)
        {
            // the agency/serialNumber may or may NOT be using Communicator so can't use AgencyAccess or App here

            var meta = new AgencyInfoMeta
            {
                ClientCode = clientCode ?? "",
                Name = agencyName,
                SerialNumber = serialNumber ?? "",
                Created = DateTimeOffset.UtcNow,
                LastSource = source
            };
            context.GetTable<AgencyInfoMeta>().InsertOnSubmit(meta);
            context.SubmitChangesRetry();
            return meta;
        }

        public bool UpdateAgencyInfos(AgencyInfoMeta meta, List<AgencyInfo> infos)
        {
            using (var context = GetRESTCentralContext())
            {
                return UpdateAgencyInfos(context, meta, infos);
            }
        }

        public bool UpdateAgencyInfos(DataContext context, AgencyInfoMeta meta, List<AgencyInfo> infos)
        {
            if (infos == null || !infos.Any())
            {
                Logger.Warning("No Infos to update for SN: {0}", meta.SerialNumber ?? "-");
                return false;
            }

            if (string.IsNullOrEmpty(meta.SerialNumber))
            {
                Logger.Info("meta.SerialNumber is invalid, cannot save {0} clientInfos", infos.Count);
                return false;
            }

            Logger.Info("update AgencyInfo: {0} items", infos.Count);
            try
            {
                    // load all for the agency
                    var existingClientInfos = LoadAgencyInfos(context, meta.SerialNumber);

                    // then go through all new ones and either update or create
                    infos.ForEach(info =>
                    {
                        if (string.IsNullOrEmpty(info.Value))
                        {
                            Logger.Warning("[{0} {1}] empty Value received ignoring AgencyInfo.", meta.SerialNumber, info.Name);
                            return;
                        }

                        var existingInfo = existingClientInfos.FirstOrDefault(agencyInfo => agencyInfo.Name == info.Name);
                        if (existingInfo == null)
                        {
                            // create
                            Logger.Debug("({0}) Creating Info: {1}", meta.SerialNumber, info);
                            info.AgencyInfoMetaId = meta.AgencyInfoMetaId;
                            context.GetTable<AgencyInfo>().InsertOnSubmit(info);
                        }
                        else
                        {
                            //                            Logger.Debug("({0} - {1}) Updating Info: {2}", existingInfo.Id, meta.SerialNumber, info);
                            // update
                            if (existingInfo.Value != info.Value || existingInfo.GroupId != info.GroupId)
                            { // using the if ensure that updated only changes when there is an actual change
                                existingInfo.Value = info.Value;
                                existingInfo.GroupId = info.GroupId; // not using groups yet
                                existingInfo.Updated = DateTimeOffset.UtcNow;
                            }
                        }
                    });
                    context.SubmitChangesRetry();
                    return true;
                
            }
            catch (Exception ex)
            {
                Logger.Error(ex, MethodBase.GetCurrentMethod().Name);
                return false;
            }
        }

        public void UpdateAgencyAccess(DataContext context, AgencyAccess agency)
        {
            Logger.Info("update Agency: {0}", agency);
            try
            {
                var existing = context.GetTable<AgencyAccess>().FirstOrDefault(a => a.AgencyAccessID == agency.AgencyAccessID);
                if (existing == null)
                {
                    Logger.Warning("Failed to load AgencyAccess:{0}", agency);
                    return;
                }
                existing.AgencyName = agency.AgencyName;
                existing.ClientCode = agency.ClientCode;
                existing.SageName = agency.SageName;
                existing.AgencyGUID = agency.AgencyGUID;
                existing.Updated = DateTimeOffset.UtcNow;

            }
            catch (Exception ex)
            {
                Logger.Error(ex, MethodBase.GetCurrentMethod().Name);
            }
        }


        public void LoadAgenciesAsync(IList<string> appKeys)
        {
            Observable.Start(() => LoadOneApplicationPerAgency(appKeys))
                .Subscribe(list => Logger.Debug("{0} agencies loaded.", list.Count)
                , Logger.Error
                , () => Logger.Debug("Load completed"));
        }

        public List<AgencyAccess> LoadAllAgenciesForService(Service service)
        {
            Logger.Debug(MethodBase.GetCurrentMethod().Name);
            // when loading for app key, we need to (I think) load the AgencyAccessIds from the AgencyApplication records first, then load through
            using (var context = GetRESTCentralContext())
            {
                try
                {
                    var options = new DataLoadOptions();

                    // seems that you can't pre-load more than one EntitySet...it starts to load individually.
                    options.LoadWith<AgencyAccess>(access => access.AgencyApplications);                    
                    // can't pre-load Activations because it causes the queries to change, runs an Activations query for each App

                    context.LoadOptions = options;
                    context.DeferredLoadingEnabled = false;
                    Logger.Debug("START Load for: {0}", service.ServiceName);

                    context.Log = Console.Out;

                    var query = from agency in context.GetTable<AgencyAccess>()
                                join app in context.GetTable<AgencyApplication>() on agency.AgencyAccessID equals app.AgencyAccessID
                                join sap in context.GetTable<ServiceAgencyApplication>() on app.AgencyApplicationID equals sap.AgencyApplicationID
                                join s in context.GetTable<Service>() on sap.ServiceID equals s.ServiceID
                                where s.ServiceKey == service.ServiceKey
                                      && sap.IsActive
                                select agency;

                    var all = query.ToList();
                    // some agencies double up so get Distinct.
                    // Can't put the Distinct on the IQueryable because it causes 1 extra call to the db per agency.
                    var loaded = all.Distinct().ToList();

                    Logger.Debug("{0}", loaded.Count);

                    return loaded;

                }
                catch (Exception ex)
                {
                    Logger.Error(ex, MethodBase.GetCurrentMethod().Name);
                    return new List<AgencyAccess>();
                }
            }
        }

        public List<AgencyAccess> LoadAgenciesWithAppsAndVersionInfo(Expression<Func<AgencyAccess, bool>> agencyWhere
            , Expression<Func<AgencyApplication, bool>> applicationWhere
            , bool includeActivations = false) // careful when set to true there will be lots of queries sent to db
        {
            Logger.Debug(MethodBase.GetCurrentMethod().Name);
            var options = new DataLoadOptions();

            // seems that you can't pre-load more than one EntitySet...it starts to load individually.
            options.LoadWith<AgencyAccess>(access => access.AgencyApplications);            
            // ideally do not pre-load Activations because it causes the queries to change, runs an Activations query for each App
            // So only load Activations when required 
            if (includeActivations)
                options.LoadWith<AgencyApplication>(application => application.Activations);

            return LoadAgencies(options, agencyWhere, applicationWhere);

        }

        public List<AgencyAccess> LoadAgencies(RestCentral context
            , Expression<Func<AgencyAccess, bool>> agencyWhere
            , Expression<Func<AgencyApplication, bool>> applicationWhere)
        {
            Logger.Debug(MethodBase.GetCurrentMethod().Name);
            try
            {

#if DEBUG
                context.Log = Console.Out;
#endif

                var query = context.AgencyAccesses.AsQueryable();

                if (agencyWhere != null)
                    query = query.Where(agencyWhere);

                if (applicationWhere != null)
                {
                    query = query
                        .Join(context.GetTable<AgencyApplication>()
                        .Where(applicationWhere)
                        , agency => agency.AgencyAccessID
                        , app => app.AgencyAccessID
                        , (agency, app) => agency);
                }

                var all = query.ToList();
                // some queries double up on agencies.
                // Can't put the Distinct on the IQueryable because it causes 1 extra call to the db per agency.
                return all.Distinct().ToList();

            }
            catch (Exception ex)
            {
                Logger.Error(ex, "LoadAgencies");
                return new List<AgencyAccess>();
            }
        }

        public List<AgencyAccess> LoadAgencies(DataLoadOptions options
            , Expression<Func<AgencyAccess, bool>> agencyWhere
            , Expression<Func<AgencyApplication, bool>> applicationWhere)
        {
            // when loading for app key, we need to (I think) load the AgencyAccessIds from the AgencyApplication records first, then load through
            using (var context = GetRESTCentralContext())
            {
                context.LoadOptions = options;
                context.DeferredLoadingEnabled = false;

                return LoadAgencies(context as RestCentral, agencyWhere, applicationWhere);
            }
        }

        /// <summary>
        /// Load the specific apps with their agency details. 
        /// This method will always return a single app within the agency, 
        /// so if the same agency has multiple appkeys this method will return multiple agencies (as opposed to a single agency with all apps within it)
        /// </summary>
        public List<AgencyAccess> LoadOneApplicationPerAgency(IList<string> applicationKeys)
        {
            var matches = new List<AgencyAccess>();

            if (applicationKeys == null || !applicationKeys.Any())
                return matches;

            var appKeys = applicationKeys
                .Select(Safe.Int)
                .Where(key => key != 0).ToList();

            appKeys.ForEach(key =>
            {
                // load for just this key
                var agencies = LoadAgenciesWithAppsAndVersionInfo(null, application => application.ApplicationKey == key
                    , true); // because it is a limited number of keys it's ok to load Activations too
                // then have to remove all applications that don't match (they will have been auto loaded as children of the agency)
                // should only be 1!
                if (agencies == null || !agencies.Any())
                    return;

                if (agencies.Count > 1) // just log the fact, the query does return multiple sometimes even if only 1.
                    Logger.Warning("{0} agencies found for appKey:{1}", agencies.Count, key);

                var agency = agencies.First();
                matches.Add(agency);
                var differentKeyApps = agency.AgencyApplications.Where(app => app.ApplicationKey != key).ToList();
                // REMOVE non matching appkeys (for this query we only want to show the one specified appkey per agency box)
                if (differentKeyApps.Any())
                    differentKeyApps.ForEach(removeMe => agency.AgencyApplications.Remove(removeMe));
            });

            return matches;

        }

        public IList<ServiceAgencyApplication> LoadServiceActivations(DataContext context, AgencyApplication app)
        {
            if (context == null)
                throw new ArgumentNullException("context");
            if (app == null)
                throw new ArgumentNullException("app");

            return context.GetTable<ServiceAgencyApplication>()
                .Where(saa => saa.AgencyApplicationID == app.AgencyApplicationID)
                .ToList();
        }

        public IList<Activation> LoadMachineActivations(DataContext context, AgencyApplication app)
        {
            if (context == null)
                throw new ArgumentNullException("context");
            if (app == null)
                throw new ArgumentNullException("app");

            return context.GetTable<Activation>()
                .Where(saa => saa.AgencyApplicationID == app.AgencyApplicationID)
                .ToList();
        }

        public AgencyApplication UpdateAppVersionInfo(VersionInfoDTO changed, AgencyApplication app)
        {
            using (var context = GetRESTCentralContext())
            {
                var options = new DataLoadOptions();
                options.LoadWith<AgencyApplication>(access => access.AgencyAccess);
                context.LoadOptions = options;
                context.DeferredLoadingEnabled = false;
                return UpdateAppVersionInfo(context, changed, app);
            }
        }

        public AgencyApplication UpdateAppVersionInfo(DataContext context, VersionInfoDTO changed, AgencyApplication app)
        {
            if (changed != null)
            {
                Logger.Debug("UpdateAppVersionInfo: {0}", changed);
                
#if DEBUG
                context.Log = Console.Out;
#endif
                // reload on this context
                var appRecord = context.GetTable<AgencyApplication>()
                    .FirstOrDefault(application => application.AgencyApplicationID == app.AgencyApplicationID);

                if (appRecord != null)
                {
                    try
                    {
                        int appmhVersion = 0;
                        if(int.TryParse(changed.AppmhVersion, out appmhVersion))
                        {
                            appRecord.AppmhVersion = appmhVersion;
                        }

                        appRecord.ApplicationCode = changed.ApplicationCode;
                        appRecord.AppMachine = changed.AppMachine;
                        appRecord.MachineNow = changed.MachineNow;
                        appRecord.WordVersion = changed.WordVersion;
                        appRecord.Word64 = changed.Word64;
                        appRecord.ExcelVersion = changed.ExcelVersion;
                        appRecord.Excel64 = changed.Excel64;
                        appRecord.Timezone = changed.Timezone;
                        appRecord.TimeOffset = changed.TimeOffset;
                        appRecord.LastUpdated = DateTimeOffset.UtcNow;

                        // don't update existing serialnumber
                        if (string.IsNullOrEmpty(appRecord.SerialNumber))
                        {
                            if(appRecord.ApplicationCode != "SM")
                                appRecord.SerialNumber = changed.SerialNumber;
                        }  
                            
                        if (!string.IsNullOrEmpty(changed.ReporterVersion) && changed.ReporterVersion != "00")
                        {
                            appRecord.ReporterVersion = changed.ReporterVersion;
                        }

                        context.SubmitChangesRetry();
                        return appRecord;
                    }
                    catch (Exception ex)
                    {
                        Logger.Error(ex, "UpdateVersionInfo");
                        return null;
                    }                        
                }

                Logger.Warning("No AgencyApp for updated VersionInfo (weird): {0]", changed);
                return null;
                
            }
            return null;
        }
    }
}