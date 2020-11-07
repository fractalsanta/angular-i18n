using Agile.Diagnostics.Logging;
using System;
using System.Net;
using System.Net.Sockets;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.ServiceModel.Discovery;
using System.Threading;
using System.Xml;

namespace Rockend.WebAccess.Common.Helpers
{
    public static class EndpointHelper
    {

        public static bool UseCustomWcfConfiguration
        {
            get { return ConfigHelper.GetBoolValue("UseCustomWcfConfiguration"); }
        }
        private static string ServiceHostName
        {
            get { return ConfigHelper.GetStringValue("ServiceHostName"); }
        }
        private static string ListeningPort
        {
            get { return ConfigHelper.GetStringValue("ListeningPort"); }
        }
        private static string AmhHostName
        {
            get { return ConfigHelper.GetStringValue("AmhHostName"); }
        }
        private static string AmhListeningPort
        {
            get { return ConfigHelper.GetStringValue("AmhListeningPort"); }
        }


        #region Discovery service methods
        public static EndpointAddress FindRemoteEndpoint(Type contractInterfaceType)
        {
            return FindEndpoint(contractInterfaceType, false);
        }

        public static EndpointAddress FindLocalEndpoint(Type contractInterfaceType)
        {
            return FindEndpoint(contractInterfaceType, true);
        }

        /// <summary>
        /// This method is exclusive to find AMH Endpoints 
        /// </summary>
        /// <returns></returns>

        public static EndpointAddress FindEndpointOrLocalEndpointInDebug()
        {
            if (UseCustomWcfConfiguration)
            {
                Logger.Info("Using Custom WCF Configurations Settings for AMH Endpoint");
                return new EndpointAddress(GetCustomAmhHandleUri());
            }

            Logger.Info("Searching for AMH ...");
#if DEBUG
            Logger.Info("...searching for local endpoint only because in Debug mode");
            var amhEndpoint = FindLocalEndpoint(typeof(IAgencyListener));
#else
            var amhEndpoint = FindEndpoint(typeof(IAgencyListener));
#endif
            if (amhEndpoint != null)
                Logger.Info("Found AMH address: {0}", amhEndpoint.Uri);
            else
                Logger.Warning("Failed to find any AMH");

            return amhEndpoint;
        }

        /// <summary>
        /// This method is exclusive to finding AMH enpoints so the Type parameter never gets used, that is whi is method is being flagged as obsolete and should be removed in future releases
        /// there are references to this method from different processors ( Inspection Manager and SystemInfo so far) those need to be updated as well.
        /// </summary>
        /// <param name="contractInterfaceType"></param>
        /// <returns></returns>
        [Obsolete]
        public static EndpointAddress FindEndpointOrLocalEndpointInDebug(Type contractInterfaceType)
        {
            return FindEndpointOrLocalEndpointInDebug();
        }

        private static EndpointAddress FindEndpoint(Type contractInterfaceType, bool local)
        {
            if (!local)
                Logger.Debug("Finding (remote) endpoints for {0}", contractInterfaceType.Name);
            else
                Logger.Debug("Finding (local) endpoints for {0}", contractInterfaceType.Name);

            EndpointAddress result = null;

            var dc = new DiscoveryClient(new UdpDiscoveryEndpoint());
            FindCriteria criteria = null;
#if DEBUG
            criteria = new FindCriteria(contractInterfaceType) { MaxResults = 1 };
#else
                criteria = new FindCriteria(contractInterfaceType);
#endif
            FindResponse fr = dc.Find(criteria);
            Logger.Debug("Found {0} endpoints", fr.Endpoints.Count);

            if (fr.Endpoints.Count > 0)
            {
                foreach (var ep in fr.Endpoints)
                {
                    if (!local)
                    {
                        if (!ep.Address.ToString().ToLower().Contains(Environment.MachineName.ToLower()))
                        {
                            result = ep.Address;
                            break;
                        }
                    }
                    else
                    {
                        if (ep.Address.ToString().ToLower().Contains(Environment.MachineName.ToLower()))
                        {
                            result = ep.Address;
                            break;
                        }
                    }
                }
            }


            if (result != null)
            {
                Logger.Info("Using Endpoint at {0}", result.ToString());
            }

            return result;
        }

        public static EndpointAddress FindEndpoint(Type contractInterfaceType, int maxResults = 1)
        {
            Logger.Debug("FindEndpoint {0}", contractInterfaceType.Name);
            EndpointAddress result = null;

            var dc = new DiscoveryClient(new UdpDiscoveryEndpoint());

            var criteria = new FindCriteria(contractInterfaceType) { MaxResults = maxResults };

            FindResponse finder = dc.Find(criteria);
            Logger.Debug("Found {0} endpoints", finder.Endpoints.Count);

            if (finder.Endpoints.Count > 1)
                LogAllFoundEndpoints(finder);

#if DEBUG
            if (finder.Endpoints.Count > 0)
            {
                foreach (var ep in finder.Endpoints)
                {
                    if (ep.Address.ToString().ToLower().Contains(Environment.MachineName.ToLower()))
                        result = ep.Address;
                    else
                        Logger.Info("AMH endpoint is not local, cannot use: {0}", ep.Address.ToString());
                }

                result = result ?? (finder.Endpoints[0].Address);
                Logger.Debug("Using Endpoint at {0}", result.ToString());
            }
            else
            {
                Logger.Info("Endpoint not found");
            }
#else
            if (finder.Endpoints.Count > 0)
            {
                if (ConfigHelper.GetBoolValue("OnlyLookForLocalAMH", false))
                {
                    foreach (var ep in finder.Endpoints)
                    {
                        if (ep.Address.ToString().ToLower().Contains(Environment.MachineName.ToLower()))
                            result = ep.Address;
                        else
                            Logger.Info("AMH endpoint is not local, cannot use: {0}", ep.Address.ToString());
                    }
                }
                else
                {
                    result = finder.Endpoints[0].Address;
                }

                if (result == null)
                {
                    Logger.Warning("Failed to find acceptable AMH endpoint from {0}", finder.Endpoints.Count);
                }
                else
                {
                    Logger.Info("Using Endpoint at {0}", result.ToString());
                }
                
            }
            else
            {
                Logger.Info("Endpoint not found");
            }
#endif
            return result;
        }

        private static void LogAllFoundEndpoints(FindResponse finder)
        {
            for (int i = 0; i < finder.Endpoints.Count; i++)
            {
                var address = finder.Endpoints[i].Address;
                Logger.Info(" {0}. {1}", i, address.ToString());
            }
        }

        #endregion

        #region AMH methods

        public static Uri GetAmhHandlerUri()
        {
            Uri address = null;
            Logger.Info(string.Format("UseDiscoveryConfiguration Flag is set to {0}", UseCustomWcfConfiguration));
            if (!UseCustomWcfConfiguration)
            {
                address =
                    new Uri(string.Format("net.tcp://{0}:{1}/Rockend/AMH", Environment.MachineName, EndpointHelper.FindAvailablePort()));
            }
            else
            {
                address = GetCustomAmhHandleUri();
            }
            return address;
        }

        private static Uri GetCustomAmhHandleUri()
        {
            if (string.IsNullOrEmpty(AmhHostName) || string.IsNullOrEmpty(AmhListeningPort))
            {
                Logger.Info("AmhHostName and or AmhPortNumber not set");
                throw new Exception(
                    "UseCustomWcfConfiguration is set to true but ServiceHostName and/or ListeningPort are not set");
            }

            return new Uri(string.Format("net.tcp://{0}:{1}/Rockend/AMH", AmhHostName,
                AmhListeningPort));
        }

        public static IAgencyListener ConnectToAMH(EndpointAddress amhEndpoint)
        {
            if (amhEndpoint == null)
            {
                Logger.Debug("ConnectToAMH with no endpoint, failed");
                return null;
            }

            Binding binding = GetStandardTcpBinding();
            IAgencyListener result = null;
            var factory = new ChannelFactory<IAgencyListener>(binding, amhEndpoint);
            result = factory.CreateChannel();

            return result;
        }
        #endregion

        #region Application handler methods
        public static IRockendWebAccess ConnectToApplicationHandler(EndpointAddress endpointAddress)
        {
            Binding binding = GetStandardTcpBinding();
            var factory = new ChannelFactory<IRockendWebAccess>(binding, endpointAddress);

            return factory.CreateChannel();
        }
        public static Uri GetApplicationHandlerUri()
        {
            return !UseCustomWcfConfiguration ? new Uri(string.Format("net.tcp://{0}:{1}/Rockend", Environment.MachineName, EndpointHelper.FindAvailablePort())) :
                    new Uri(string.Format("net.tcp://{0}:{1}/Rockend", ServiceHostName, ListeningPort));
        }
        public static NetTcpBinding GetStandardTcpBinding()
        {
            return new NetTcpBinding
                {
                    MaxBufferSize = int.MaxValue,
                    SendTimeout = new TimeSpan(0, 0, 45),
                    ReceiveTimeout = new TimeSpan(0, 0, 45),
                    OpenTimeout = new TimeSpan(0, 1, 0),
                    CloseTimeout = new TimeSpan(0, 1, 0),
                    MaxBufferPoolSize = int.MaxValue,
                    MaxReceivedMessageSize = int.MaxValue,
                    Security = new NetTcpSecurity { Mode = SecurityMode.None },
                    ReaderQuotas = new XmlDictionaryReaderQuotas { MaxStringContentLength = int.MaxValue, MaxArrayLength = int.MaxValue, MaxBytesPerRead = 4096, MaxNameTableCharCount = 16384, MaxDepth = 32 }
                };
        }
        #endregion

        #region Helper methods
        public static int FindAvailablePort()
        {
            var mutex = new Mutex(false, "EndpointHelper.FindAvailablePort");

            try
            {
                mutex.WaitOne();
                var endpoint = new IPEndPoint(IPAddress.Any, 0);
                using (Socket socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp))
                {
                    socket.Bind(endpoint);
                    var local = (IPEndPoint)socket.LocalEndPoint;
                    return local.Port;
                }
            }
            finally
            {
                mutex.ReleaseMutex();
            }
        }
        #endregion
    }
}
