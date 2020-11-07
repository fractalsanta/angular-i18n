using System;
using System.Data;
using Agile.Diagnostics.Logging;
using Rockend.Common;

namespace Rockend.iStrata.StrataWebsite.Helpers
{
    public static class Extensions
    {
        /// <summary>
        /// make sure it doesn't go bang when getting col value
        /// </summary>
        public static string SafeGetRowString(this DataRow row, string columnName)
        {
            try
            {
                return Safe.String(row[columnName]);
            }
            catch (ArgumentException)
            { // this willl happen alot until everyone updates to latest FS 6.5 and SM 8.0. Just ignore
                return string.Empty;
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "GetRowString: column:{0}", columnName);
                return string.Empty;
            }
        }
    }
}