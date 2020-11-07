using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Xml.Linq;
using Agile.Diagnostics.Logging;

namespace DocumentManagement.Helpers
{
    public enum ArchiveMode
    {
        PropertyManagement, Creditors, Sales, HolidayBookings, Solicitor,
    }

    public enum ArchiveType
    {
        Normal, Bulk, Historical,
    }

    public static class ArchiveHelper
    {
        private static object wrapper = null;

        #region ArchiveMode Helper
        public static ArchiveMode GetArchiveMode(string archiveMode)
        {
            return (ArchiveMode)Enum.Parse(typeof(ArchiveMode), archiveMode);
        }

        public static ArchiveType GetArchiveType(string archiveType)
        {
            return (ArchiveType)Enum.Parse(typeof(ArchiveType), archiveType);
        }

        public static void GetSpecificLibraryAndFolder(string documentCategory, string pathToDataBase, out int libraryID, out int folderID)
        {
            libraryID = 0;
            folderID = 0;

            if (!File.Exists(pathToDataBase + @"\DocumentMapping.xml"))
                return;

            XDocument xmlDoc = XDocument.Load(pathToDataBase + @"\DocumentMapping.xml");
            libraryID = GetValueFromXml(xmlDoc, documentCategory, "DefaultLibraryID");
            folderID = GetValueFromXml(xmlDoc, documentCategory, "DefaultFolderID");
        }

        public static int GetValueFromXml(XDocument xml, string xmlSection, string tagValue)
        {
            int result = -1;

            var section = xml.Root.Descendants("fileSMART").Descendants(xmlSection);
            if (section.Count() > 0)
                int.TryParse(section.Elements(tagValue).FirstOrDefault().Value, out result);

            return result;
        }
        #endregion

        #region Dynamic ArchiveWrapper methods
        private static Assembly GetArchiveWrapperAssembly()
        {
            //add a reference to the gac version
            //gac is in windows\ms.net\gac32\archivewrapper
            return Assembly.Load("ArchiveWrapper, Version=1.0.0.0, Culture=neutral, PublicKeyToken=5865cb10b3bfd719");
        }

        public static T CallArchiveWrapper<T>(string methodName, params object[] args)
        {
            T result = default(T);

            try
            {
                Assembly archiveWrapper = GetArchiveWrapperAssembly();

                LogArchiveCall(methodName, args);
                Type type = archiveWrapper.GetType("Rockend.fileSMART.API.ArchiveApi");
                var obj = LoadArchiveWrapper();

                var returnObject = type.InvokeMember(methodName, BindingFlags.Default | BindingFlags.InvokeMethod, null, obj, args);
                //"PullLibrariesAndFoldersFiltered", BindingFlags.Default | BindingFlags.InvokeMethod, null, obj, args);
                result = (T)returnObject;

                Logger.Debug("Result: \n{0}", result);
            }
            catch (Exception e)
            {
                Logger.Error(e, "CallArchiveWrapper");
            }

            return result;
        }

        public static T ArchiveWrapperProperty<T>(string propertyName)
        {
            T result = default(T);

            try
            {
                Assembly archiveWrapper = GetArchiveWrapperAssembly();
                Type type = archiveWrapper.GetType("Rockend.fileSMART.API.ArchiveApi");
                var obj = LoadArchiveWrapper();

                var returnObject = type.GetProperty(propertyName).GetValue(obj, null);
                result = (T)returnObject;

            }
            catch (Exception e)
            {
                Logger.Error(e, "CallArchiveWrapper");
            }

            return result;
        }

        public static object LoadArchiveWrapper()
        {
            try
            {
                if (wrapper == null)
                {
                    Assembly fsAssembly = GetArchiveWrapperAssembly();
                    Type type = fsAssembly.GetType("Rockend.fileSMART.API.fileSMART");
                    var obj = Activator.CreateInstance(type);

                    wrapper = type.InvokeMember("CreateArchiveApi", BindingFlags.Default | BindingFlags.InvokeMethod, null, obj, null);
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "LoadArchiveWrapper");
            }

            return wrapper;
        }

        private static void LogArchiveCall(string methodName, object[] args)
        {
            Logger.Debug("Calling ArchiveWrapper {0} With:", methodName);
            Logger.Debug("---Params---");
            if (args != null)
            {
                foreach (var o in args)
                {
                    if (o != null)
                    {
                        Logger.Debug("{0}", o.ToString());
                    }
                    else
                    {
                        Logger.Debug("Null");
                    }
                }
            }
            Logger.Debug("---End Params---");
        }
        #endregion
    }
}

