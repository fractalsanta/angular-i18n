using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Agile.Diagnostics.Logging;
using Microsoft.Azure;
using Rockend.Common.Helpers;

namespace Rockend.Azure
{
    public class AzureEnvironmentService : IEnvironmentService
    {
        public AzureEnvironmentService()
        {
            Logger.Debug("ctor EnvironmentService: {0}", GetEnvironment());
        }

        public string GetEnvironment()
        {
            return AzureHelper.ServerEnvironment;
        }

        public void SetEnvironment(string environment)
        {
            throw new NotImplementedException();
        }

        public bool IsProduction {
            get { return AzureHelper.IsProduction; }
        }

        public bool IsUat {
            get { return AzureHelper.IsUat; }
        }
        
        public bool IsDev {
            get { return AzureHelper.IsDev; }
        }

        public string GetStorageFolderName()
        {
            string result;

            switch (GetEnvironment().ToLower())
            {
                case "uat":
                    result = "Uat";
                    break;

                case "production":
                case "prod":
                    result = "Prod";
                    break;

                case "dev":
                    result = "Uat";
                    break;

                default:
                    result = GetEnvironment();
                    break;
            }

            return result;
        }

        public string GetConnectionString(string name, bool appendEnvironment = false, string environmentOverride = null)
        {
            // ignore override for this impl (no need atm)
            return CloudConfigurationManager.GetSetting(name);
        }

        public string GetConnectionString(string name, string environmentOverride = null)
        {
            return GetConnectionString(name, false, environmentOverride);
        }
    }
}
