using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Agile.Diagnostics.Logging;

namespace Rockend.iStrata.StrataWebsite.Helpers
{
    public static class AppKeyHelper
    {
        /// <summary>
        /// Get the applicationKey
        /// </summary>
        public static string GetApplicationKeyFromUrl()
        {
            var aid = HttpContext.Current.Request.QueryString["aid"];

            if (string.IsNullOrWhiteSpace(aid))
            {
                aid = GetApplicationKeyFromUrl(HttpContext.Current.Request.Url.AbsolutePath);
            }

            return string.IsNullOrEmpty(aid) ? string.Empty : aid;
        }

        /// <summary>
        /// Returns the applicationKey from the absolute path
        /// </summary>
        public static string GetApplicationKeyFromUrl(string absolutePath)
        {
            // the first / is index 0, need to determine second / index
            var appKey = GetKey(absolutePath, absolutePath.IndexOf("/", 0));
            Logger.Debug("url has appKey:{0}", appKey);
            return appKey;
        }

        private static string GetKey(string path, int startIndex)
        {
            if (path.Length < (startIndex - 1))
                return "0";

            int endIndex = path.IndexOf("/", startIndex);
            if (endIndex == -1)
                return "0";

            var value = path.Substring(startIndex, ((endIndex) - startIndex));

            int key;
            var result = int.TryParse(value, out key);

            if (!result)
                return GetKey(path, endIndex + 1);
            return value;
        }
    }
}