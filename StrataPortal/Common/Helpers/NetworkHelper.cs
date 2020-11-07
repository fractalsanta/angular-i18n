using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using Agile.Diagnostics.Logging;

#if ! IOS
using Rockend.Common.Helpers;
using Rockend.Common.Interface;
#endif

namespace Rockend.WebAccess.Common.Helpers
{
    /// <summary>
    /// Network helper methods
    /// </summary>
    public static class NetworkHelper
    {
        public static bool IsLocal(Uri uri)
        {
            IPAddress[] host;
            IPAddress[] local;

            host = Dns.GetHostAddresses(uri.Host);
            local = Dns.GetHostAddresses(Dns.GetHostName());

            foreach (IPAddress hostAddress in host)
            {
                if (IPAddress.IsLoopback(hostAddress))
                {
                    return true;
                }

                for (int index = 0; index < local.Length; index++)
                {
                    IPAddress localAddress = local[index];
                    if (hostAddress.Equals(localAddress))
                    {
                        return true;
                    }
                }
            }
            return false;
        }

#if !IOS
        public static IConfig SetupCustomNetConfig(string userFilePath, string fileName)
        {
                //setup network config
               // var programsFolder = Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86);
                //var userFilePath = Path.Combine(programsFolder, @"Rockend\WebAccessConfig");
            try
            {
                if (!Directory.Exists(userFilePath)) Directory.CreateDirectory(userFilePath);

                var sourceFilePath = Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory, fileName);
                var destFilePath = Path.Combine(userFilePath, fileName);
                if (!File.Exists(destFilePath))
                    File.Copy(sourceFilePath, destFilePath);
                var configMap = new ExeConfigurationFileMap {ExeConfigFilename = destFilePath};
                var config = ConfigurationManager.OpenMappedExeConfiguration(configMap, ConfigurationUserLevel.None);
                return new ConfigManager(config.AppSettings);
                
            }
            catch (Exception ex)
            {
                Logger.Debug("Error setting up custom network config: Could not Read or Write in {0}", userFilePath);
                Logger.Debug(ex.Message);
                return new AppConfigManager();
            }
        }
#endif

    }
}
