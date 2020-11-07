using System;
using System.IO;
using System.Linq;
using System.Web;
using Agile.Diagnostics.Logging;
using ICSharpCode.SharpZipLib.Zip;

namespace Rockend.Azure.Helpers
{
    public static class IOHelper
    {
        /// <summary>
        /// Determines if a file exists.
        /// </summary>
        /// <param name="session">Http session.</param>
        /// <param name="fileName">File name.</param>
        /// <returns>True if the file exists, otherwise false.</returns>
        public static bool DoesFileExist(this HttpSessionStateBase session, string appName, string fileName)
        {
            return File.Exists(session.GetFilePath(appName, fileName));
        }

        /// <summary>
        /// Get the file path to the named file in this session.
        /// </summary>
        /// <param name="session">Http session.</param>
        /// <param name="fileName">File name.</param>
        /// <returns>Full local path to the file.</returns>
        public static string GetFilePath(this HttpSessionStateBase session, string appName, string fileName)
        {
            char[] invalidChars = Path.GetInvalidFileNameChars();
            if (fileName.IndexOfAny(invalidChars) >= 0)
            {
                throw new ArgumentException("Invalid file name given");
            }
            return session.GetSessionPath(appName) + fileName;
        }

        /// <summary>
        /// Create a random string to be used as a filename.
        /// </summary>
        /// <returns>Random string.</returns>
        public static string GetRandomFileName()
        {
            return Path.GetRandomFileName();
        }

        /// <summary>
        /// Get the path to the temp folder for the current session.
        /// </summary>
        /// <param name="session">Http session.</param>
        /// <returns>Path to the temp folder.</returns>
        public static string GetSessionPath(this HttpSessionStateBase session, string appName)
        {
            return GetTempPath(appName) + session.SessionID + Path.DirectorySeparatorChar;
        }

        /// <summary>
        /// Get the path to the temp folder.
        /// </summary>
        /// <returns>Path to the temp folder.</returns>
        public static string GetTempPath(string appName)
        {
            return Path.GetTempPath() + appName + Path.DirectorySeparatorChar;
        }

        /// <summary>
        /// Save a file to the temporary store for the session.
        /// </summary>
        /// <param name="session">Http session.</param>
        /// <param name="fileName">File name.</param>
        /// <param name="bytes">File contents.</param>
        public static void SaveFile(this HttpSessionStateBase session, string appName, string fileName, byte[] bytes)
        {
            Directory.CreateDirectory(session.GetSessionPath(appName));
            File.WriteAllBytes(session.GetFilePath(appName, fileName), bytes);
        }

        public static bool IsPathLocal(string path)
        {
            Logger.Debug( "Checking if {0} is local", path);

            if (path.StartsWith(@"\\"))
                return false;

            try
            {
                var dir = new DirectoryInfo(path);
                var driveInfo = new DriveInfo(dir.Root.FullName);

                Logger.Debug( "Drive is {0} returning {1}", driveInfo.DriveType.ToString(), driveInfo.DriveType != DriveType.Network);

                return (driveInfo.DriveType != DriveType.Network);
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "Problem with IsPathLocal");                                
            }

            return false;
        }

        public static void CheckUpdateDirectory(string updatePath)
        {
            if (!Directory.Exists(updatePath))
                Directory.CreateDirectory(updatePath);

            var query = from f in Directory.GetFiles(updatePath)
                        select f;
            foreach (var fileName in query)
            {
                Logger.Info( "Deleting {0} ...", fileName);
                File.Delete(fileName);
            }
        }

        public static void ExtractUpdateFiles(byte[] zipFile, string updatePath)
        {
            string zipFileName = updatePath + @"\Update.zip";

            Logger.Debug( "Saving update zip file ({0})", zipFileName);
            using (Stream stream = File.Create(zipFileName))
            {
                using (BinaryWriter writer = new BinaryWriter(stream))
                {
                    writer.Write(zipFile);
                    writer.Flush();
                    writer.Close();
                }
            }

            Logger.Info( "Extracting handler files ...");
            FastZip fastZip = new FastZip();
            fastZip.ExtractZip(zipFileName, updatePath, "");

            File.Delete(zipFileName);
        }

        public static string ConvertUriToPath(string filename)
        {
            Uri uri = new Uri(filename);
            return uri.LocalPath;
        }
    }
}
