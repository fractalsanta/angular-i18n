using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;
using Rockend.WebAccess.Common.Transport;
using System.Runtime.InteropServices;
using Agile.Diagnostics.Logging;

namespace Rockend.WebAccess.Common.Helpers
{
    public class FileSmartHelper
    {
        public static Version GetPrintMailCommsVersion()
        {
            try
            {
                string path = GetAssemblyPath("PrintMailComms");

                if (string.IsNullOrWhiteSpace(path))
                {
                    return null;
                }

                Logger.Debug("GetPrintMailCommsVersion - path '{0}'", path);

                AssemblyName name = AssemblyName.GetAssemblyName(path);
                Logger.Debug("GetPrintMailCommsVersion - name - '{0}'", name.ToString());

                return name.Version;
            }
            catch (Exception e)
            {
                Logger.Error(e, "GetPrintMailCommsVersion");
                Logger.Debug("GetPrintMailCommsVersion Exception Message '{0}'", e.Message);
                Logger.Debug("GetPrintMailCommsVersion Exception StackTrace '{0}'", e.StackTrace);
                return null;
            }
        }

        public static bool ArchiveWrapperExistsInGAC()
        {
            Version pmComms = GetPrintMailCommsVersion();
            
            if (pmComms == null)
                return false;

            Logger.Debug("ArchiveWrapperExistsInGAC - Version '{0}'", pmComms.ToString());

            if (pmComms.Major < 4 || (pmComms.Major == 4 && pmComms.Minor < 7))
                return false;
            return true;
        }

        /// <summary>
        /// Gets an assembly path from the GAC given a partial name.
        /// </summary>
        /// <param name="name">An assembly partial name. May not be null.</param>
        /// <returns>
        /// The assembly path if found; otherwise null;
        /// </returns>
        public static string GetAssemblyPath(string name)
        {
            if (name == null)
                throw new ArgumentNullException("name");

            string finalName = name;
            AssemblyInfo aInfo = new AssemblyInfo();
            aInfo.cchBuf = 1024; // should be fine...
            aInfo.currentAssemblyPath = new String('\0', aInfo.cchBuf);

            IAssemblyCache ac;
            int hr = CreateAssemblyCache(out ac, 0);
            if (hr >= 0)
            {
                hr = ac.QueryAssemblyInfo(0, finalName, ref aInfo);
                if (hr < 0)
                    return null;
            }

            return aInfo.currentAssemblyPath;
        }


        [ComImport, InterfaceType(ComInterfaceType.InterfaceIsIUnknown), Guid("e707dcde-d1cd-11d2-bab9-00c04f8eceae")]
        private interface IAssemblyCache
        {
            void Reserved0();

            [PreserveSig]
            int QueryAssemblyInfo(int flags, [MarshalAs(UnmanagedType.LPWStr)] string assemblyName, ref AssemblyInfo assemblyInfo);
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct AssemblyInfo
        {
            public int cbAssemblyInfo;
            public int assemblyFlags;
            public long assemblySizeInKB;
            [MarshalAs(UnmanagedType.LPWStr)]
            public string currentAssemblyPath;
            public int cchBuf; // size of path buf.
        }

        [DllImport("fusion.dll")]
        private static extern int CreateAssemblyCache(out IAssemblyCache ppAsmCache, int reserved);
    }
}
