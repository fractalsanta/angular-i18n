using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Rockend.Azure;
using Microsoft.WindowsAzure.ServiceRuntime;
using System.Configuration;
using Rockend.WebAccess.Mail;

namespace Rockend.iStrata.StrataWebsite.Helpers
{
    public class WebsiteMailHelper
    {
        public static string GetFromAddressFromConfig()
        {
            string fromAddress = string.Empty;
            try
            {
                if (AzureHelper.IsInFabric)
                {
                    fromAddress = RoleEnvironment.GetConfigurationSettingValue("DefaultFromMailAddress");
                }
                else
                {
                    fromAddress = ConfigurationManager.AppSettings["DefaultFromMailAddress"];
                }
                if (string.IsNullOrWhiteSpace(fromAddress))
                {
                    fromAddress = "notifications@lookatmystrata.com.au";
                }
            }
            catch (Exception)
            {
                fromAddress = "notifications@lookatmystrata.com.au";
            }
            return fromAddress;
        }
    }
}