using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Rockend.WebAccess.Common.Transport;

namespace Rockend.WebAccess.Common.Helpers
{
    public static class ListExtentions
    {
        public static string GetAppList(this List<RockendApplication> applicationKeys)
        {
            StringBuilder result = new StringBuilder();
            foreach (RockendApplication app in applicationKeys)
            {
                result.AppendFormat("({0} - App Key: {1} Serial #:{2} ID:{3}) ", app.ApplicationCode, app.ApplicationKey, app.SerialNumber, app.DataSourceID);
            }

            return result.ToString();
        }

        public static void SetAgencyGUID(this List<RockendApplication> appList, Guid? guid)
        {
            foreach (RockendApplication app in appList)
            {
                if(app.ApplicationCode != "SM") // Don't clear if STRATA because we use the GUID to find an existing key (server side it is only used if STRATA too!)
                    app.AgencyGUID = guid;
            }
        }
    }
}
