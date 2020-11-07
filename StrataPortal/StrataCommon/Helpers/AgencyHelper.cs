using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Rockend.iStrata.StrataCommon.BusinessEntities;
using Agile.Diagnostics.Logging;
using System.Data.Linq;

namespace Rockend.iStrata.StrataCommon
{
    public static class AgencyHelper
    {
        public static IAgency GetAgency(DataContext context) 
        {
            try
            {
                Config configTable = context.GetTable<Config>().FirstOrDefault();
                string[] version = configTable.DatabaseVersion.Split(new[] { '.' });

                if (version.Length >= 2)
                {
                    int major = int.Parse(version[0]);
                    int minor = int.Parse(version[1]);

                    if (major < 5 || (major == 5 && minor < 5)) // pre 5.5
                    {
                        Logger.Debug("Loading agency table from pre 5.5");
                        return context.GetTable<Agency>().FirstOrDefault();
                    }
                    else if (major <= 6 && minor < 5)
                    {
                        Logger.Debug("Loading agency table for 5.5 or 6.0");
                        return context.GetTable<Agency55>().FirstOrDefault();
                    }
                    else
                    {
                        Logger.Debug("Loading agency table for 6.5 or after");
                        return context.GetTable<Agency65>().FirstOrDefault();
                    }
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "Error loading the Agency from database.");
                return null;
            }
        }
    }
}
