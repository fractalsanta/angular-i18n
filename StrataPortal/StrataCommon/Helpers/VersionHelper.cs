using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Data.Linq;
using Agile.Diagnostics.Logging;
using Rockend.Common;
using Rockend.iStrata.StrataCommon.BusinessEntities;

namespace Rockend.iStrata.StrataCommon.Helpers
{
    public static class VersionHelper
    {
        public static Version GetStrataMasterVersion()
        {
            try
            {
                using (DataContext context = StrataDBHelper.GetStrataDataContext())
                {
                    Config conf = context.GetTable<Config>().FirstOrDefault();
                    string[] versionField = conf.DatabaseVersion.Split(new[] { '.' });

                    int major = int.Parse(versionField[0]);
                    int minor = int.Parse(versionField[1]);
                    int build = 0;

                    if (versionField.Length > 2)
                    {
                        int.TryParse(versionField[2], out build);
                    }

                    return new Version(major, minor, build);
                }
            }
            catch (Exception e)
            {
                Logger.Error(e);
                return null;
            }
        }


        public static Version NullVersion = new Version(0,0,0);

        /// <summary>
        /// included for backwards compatability with Strata processors. 
        /// Do not use this, instead use IsVersionGreaterThanOrEqualTo
        /// </summary>
        public static bool IsOnVersionGreaterOrEqualTo(int latestMajor, int latestMinor)
        {
            Version installedVersion = GetStrataMasterVersion();
            if (installedVersion != null && (installedVersion.Major > latestMajor || (installedVersion.Major == latestMajor && installedVersion.Minor >= latestMinor)))
            {
                return true;
            }
            return false;
        }

        public static bool IsVersionGreaterThanOrEqualTo(this Version version, Version min)
        {
            var result = (version.Major >= min.Major && version.Minor >= min.Minor)
                   || version.Major > min.Major;
            Logger.Debug("min:{0} result={1}", min.ToString(), result);
            return result;
        }

        public static Version GetFilesmartVersion()
        {
            try
            {
                var exePath = ConfigurationManager.AppSettings["StrataDirectory"];
                if (string.IsNullOrEmpty(exePath))
                {
                    Logger.Warning("Cannot find StrataDirectory appsetting, trying C:\\Strata");
                    exePath = "C:\\Strata";
                }

                // Check if FS Link exists already.
                var fslPath = string.Concat(exePath, "\\", "Rockend.FileSmartLink.exe");

                Logger.Info("fslLink path: {0}", fslPath);
                if (!File.Exists(fslPath))
                {
                    Logger.Warning("cannot find fslink.exe. Need to set StrataDirectory in config file.");
                    return NullVersion;
                }

                var fsVers = FileVersionInfo.GetVersionInfo(fslPath);
                Logger.Debug("fsLink version: {0}", fsVers.ToString());

                return new Version(fsVers.FileMajorPart, fsVers.FileMinorPart, fsVers.FileBuildPart);
            }
            catch (Exception ex)
            {
                Logger.Error(ex, MethodBase.GetCurrentMethod().Name);
                return NullVersion;
            }
        }
    }
}
