using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using Agile.Diagnostics.Logging;

namespace Rockend.WebAccess.Common.Helpers
{
    /// <summary>
    /// Helper methods for security
    /// </summary>
    public static class SecurityHelper
    {
        /// <summary>
        /// Returns true if we are running as Admin
        /// </summary>
        /// <returns></returns>
        public static bool IsRunAsAdministrator()
        {
            try
            {
                var wi = WindowsIdentity.GetCurrent();
                var wp = new WindowsPrincipal(wi);

                var isAdmin = wp.IsInRole(WindowsBuiltInRole.Administrator);
                Logger.Info("Running as Admin={0}", isAdmin);
                return isAdmin;
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "IsRunAsAdministrator");
                return false;
            }
        }
    }
}
