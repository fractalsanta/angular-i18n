using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using Agile.Diagnostics.Logging;

namespace Rockend.Common
{
    public static class RockendHelper
    {
        public enum RwacService
        {
            Reiwa = 1000001,
            Kpi = 1000002,
            RestMobile = 2000001,
            StrataMobile = 2000002,
            RESTPortal = 1000000,
            StratePortal = 2000000,
            InspectionManager = 1000007,
            DocsOnPortals = 1000009,
            StrataMeetingApp = 1000010,
            Benchmarking = 1000015
        }

        public static bool IsSupport()
        {
            return File.Exists(@"C:\IAMSupport.txt");
        }

        public static FileVersionInfo RwacVersion { get; private set; }


        public static string SafelyLogVersion(Assembly assembly)
        {
            try
            {
                RwacVersion = FileVersionInfo.GetVersionInfo(assembly.Location);
                Logger.Info("Version: {0}", RwacVersion.FileVersion);
                return RwacVersion.FileVersion;
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "SafelyLogVersion");
                return "0.0";
            }
        }
    }
}
