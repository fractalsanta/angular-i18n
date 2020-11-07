using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.IO;
using System.ServiceModel;
using System.Reflection;
using Agile.Diagnostics.Logging;

namespace Rockend.Common.Helpers
{
    public static class EnvironmentHelper
    {
        public const string Production = "PRODUCTION";
        public const string Prod = "PROD";
        public const string Uat = "UAT";
        public const string Dev = "DEV";

        public static string LaunchFileDirectory = string.Empty;
        
        private static string environment = string.Empty;

        public static string GetEnvironment()
        {
            if (string.IsNullOrEmpty(environment))
            {
                environment = GetEnvironmentFromLaunchFile();
            }

            return environment;
        }

        private static string GetEnvironmentFromLaunchFile()
        {
            string launchFileDir = string.Empty;

            if (string.IsNullOrEmpty(LaunchFileDirectory))
                launchFileDir = Path.GetDirectoryName(FileIOHelper.ConvertUriToPath(Assembly.GetExecutingAssembly().CodeBase));
            else
                launchFileDir = LaunchFileDirectory;

            string launchFile = string.Concat(launchFileDir, launchFileDir.EndsWith("\\") ? string.Empty : "\\", "Launch.env");

            if (File.Exists(launchFile))
            {
                using (StreamReader file = new StreamReader(launchFile))
                {
                    string env = file.ReadLine();
                    if (!string.IsNullOrEmpty(env))
                    {
                        Logger.Info("Launch.env file: {0}", env);
                        return env;
                    }
                    Logger.Info("Launch.env file is empty, defaulting to PROD");
                    return Production;
                }
            }
            
            Logger.Info("Launch.env file does not exist, defaulting to PROD");
            return Production;
        }

        #region Portal Urls
        public static string GetPortalUrl(string applicationCode, int applicationKey)
        {
            return GetPortalUrl(applicationCode, applicationKey, -1);
        }

        public static string GetPortalUrl(string applicationCode, int applicationKey, int typeId)
        {
            string result = "";

            switch (applicationCode.ToLower())
            {
                case "rp":
                    result = RestPortalUrl(typeId, applicationKey);
                    break;

                case "sm":
                    result = StrataPortalUrl(applicationKey);
                    break;
            }

            return result;
        }

        private static string StrataPortalUrl(int applicationKey)
        {
            string environment = GetEnvironment();
            string result = string.Empty;

            switch (environment.ToUpper())
            {               
                case "DEV":
                    result = string.Format("https://strataportal-dev.azurewebsites.net/?aid={0}", applicationKey);
                    break;
                case Prod:
                case Production:
                    result = string.Format("https://www.lookatmystrata.com.au/?aid={0}", applicationKey);
                    break;
                default:
                    result = string.Format("https://strataportal-{0}.rockendcommunicator.com.au/?aid={1}", environment, applicationKey);
                    break;
            }

            return result;            
        }

        private static string RestPortalUrl(int typeId, int applicationKey)
        {
            string environment = GetEnvironment();
            string urlFormat = "https://{0}/{1}/Account/Logon?type={2}";
            string result = string.Empty;

            switch (environment.ToUpper())
            {
                case Prod:
                case Production:
                    result = string.Format(urlFormat, "www.lookatmyproperty.com.au", applicationKey, typeId);
                    break;
                case "DEV":
                    result = string.Format(urlFormat, "restportal-dev.azurewebsites.net", applicationKey, typeId); 
                    break;
                default:
                    result = string.Format(urlFormat, string.Format("restportal-{0}.rockendcommunicator.com.au", environment.ToLower()), applicationKey, (int)typeId);
                    break;
            }

            return result;
        }
        #endregion

        #region RMH Stuff

        public static EndpointAddress GetRMHEndPointAddress(string env)
        {
            return new EndpointAddress(GetRMHServiceAddress(env));
        }

        public static EndpointAddress GetRMHEndPointAddress()
        {
            return new EndpointAddress(GetRMHServiceAddress());
        }

        private static string GetRMHServiceAddress()
        {
            return GetRMHServiceAddress(GetEnvironment());
        }

        private static readonly string apiAddress = "https://communicatorapi{0}.rockendcommunicator.com.au";

        public static string GetCommunicatorApiAddress(string env)
        {
            Logger.Debug("Get Api address for {0}", env);
            return string.Format(apiAddress, 
                (env.Equals(Prod) || env.Equals(Production)) ? "" : "-uat");
        }

        private static string GetRMHServiceAddress(string env)
        {
            string address = string.Empty;

            switch (env.ToLower())
            {
                case "prod":
                case "production":
                    address = "https://rmh.rockendcommunicator.com.au/requestService.svc";
                    break;               
                               
                case "dev":
                    address = "https://rockendmessagehandler-dev.azurewebsites.net/requestservice.svc"; // "https://rmhservice.local/requestservice.svc";
                    break;
                default:
                    address = string.Format("https://rmh-{0}.rockendcommunicator.com.au/RequestService.svc", env);
                    break;
            }
            return address;
        }

        public static WSHttpBinding GetRMHServiceBinding()
        {
            WSHttpBinding binding = new WSHttpBinding
            {
                Name = "sslBinding",
                ReceiveTimeout = new TimeSpan(0, 0, 3, 30),
                SendTimeout = new TimeSpan(0, 0, 3, 30),
                OpenTimeout = new TimeSpan(0, 0, 3, 30),
                MaxReceivedMessageSize = 2147483647,
                MaxBufferPoolSize = 2147483647,
                CloseTimeout = new TimeSpan(0, 0, 3, 30),
                Security = { Mode = SecurityMode.Transport }
            };
            binding.Security.Transport.ClientCredentialType = HttpClientCredentialType.None;
            binding.ReaderQuotas.MaxStringContentLength = 2147483647;
            binding.ReaderQuotas.MaxArrayLength = 2147483647;
            binding.ReaderQuotas.MaxBytesPerRead = 2147483647;
            binding.ReaderQuotas.MaxDepth = 32;
            binding.ReaderQuotas.MaxNameTableCharCount = 16384;

            return binding;
        }
        #endregion

        #region Dictionary Stuff
        public static string GetDictionaryServiceAddress()
        {
            return GetDictionaryServiceAddress(GetEnvironment());
        }

        public static string GetDictionaryServiceAddress(string env)
        {
            var address = "";
            switch (env.ToLower())
            {
                case "prod":
                case "production":
                    address = "https://dictionarystore.rockendcommunicator.com.au/DictionaryService.svc/secure";
                    break;
               default:
                    address = "https://dictionarystore-uat.azurewebsites.net/DictionaryService.svc/secure";
                    //address = string.Format("https://dictionarystore-{0}.azurewebsites.net/DictionaryService.svc/secure", env);
                    break;
            }
            return address;
        }

        public static BasicHttpBinding GetDictionaryServiceBinding()
        {
            BasicHttpBinding binding = new BasicHttpBinding
            {
                Name = "DictionaryBinding",
                ReceiveTimeout = new TimeSpan(0, 0, 10, 0),
                SendTimeout = new TimeSpan(0, 0, 2, 0),
                OpenTimeout = new TimeSpan(0, 0, 1, 0),
                CloseTimeout = new TimeSpan(0, 0, 1, 0),
                MaxReceivedMessageSize = 2147483647,
                MaxBufferPoolSize = 524288,
                MessageEncoding = WSMessageEncoding.Text,
                TextEncoding = System.Text.Encoding.UTF8,
                UseDefaultWebProxy = true
            };
            binding.Security.Mode = BasicHttpSecurityMode.Transport;
            binding.Security.Transport.ClientCredentialType = HttpClientCredentialType.None;
            binding.ReaderQuotas.MaxStringContentLength = 2147483647;
            binding.ReaderQuotas.MaxArrayLength = 214748364;
            binding.ReaderQuotas.MaxDepth = 32;
            binding.ReaderQuotas.MaxBytesPerRead = 4096;
            binding.ReaderQuotas.MaxNameTableCharCount = 16384;

            return binding;
        }
        #endregion

        #region AppConnect stuff
        public static string GetAppConnectServiceAddress()
        {
            return GetAppConnectServiceAddress(GetEnvironment());
        }

        public static string GetAppConnectServiceAddress(string env)
        {
            string address = string.Empty;

            switch (env.ToLower())
            {
                case "prod":
                case "production":
                    address = "https://appConnect.rockendcommunicator.com.au/AppRequest.svc";
                    break;
               case "dev":
                    address = "https://appconnect-dev.azurewebsites.net/AppRequest.svc";
                    break;
                default:
                    address = string.Format("https://appconnect-{0}.rockendcommunicator.com.au/AppRequest.svc", env);
                    break;
            }
            return address;
        }

        public static WSHttpBinding GetAppConnectBinding()
        {
            WSHttpBinding binding = new WSHttpBinding 
            {
                ReceiveTimeout = new TimeSpan(0, 0, 10, 0), 
                SendTimeout = new TimeSpan(0, 0, 10, 0),
                MaxReceivedMessageSize = 2147483647, 
                Security = { Mode = SecurityMode.Transport }
            };
            binding.Security.Transport.ClientCredentialType = HttpClientCredentialType.None;
            binding.Security.Transport.ProxyCredentialType = HttpProxyCredentialType.None;
            binding.ReaderQuotas.MaxStringContentLength = 2147483647;
            binding.ReaderQuotas.MaxArrayLength = 2147483647;
            binding.ReaderQuotas.MaxDepth = 32;
            binding.ReaderQuotas.MaxBytesPerRead = 2147483647;
            binding.ReaderQuotas.MaxNameTableCharCount = 16384;

            return binding;
        }
        #endregion
    }
}
