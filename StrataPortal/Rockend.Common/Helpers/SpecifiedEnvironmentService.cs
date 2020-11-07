using System;
using System.Configuration;

namespace Rockend.Common.Helpers
{
    /// <summary>
    /// Environment set explicitly, also may be updated at runtime
    /// </summary>
    public class SpecifiedEnvironmentService : IEnvironmentService
    {
        public SpecifiedEnvironmentService(Func<string, string> getConnectionStringOverride = null)
        {
            GetConnectionStringOverride = getConnectionStringOverride;
        }

        public string GetEnvironment()
        {
            return Environment;
        }

        public void SetEnvironment(string environment)
        {
            var changed = (!string.IsNullOrEmpty(Environment)) && Environment != environment.ToUpper();
            Environment = environment.ToUpper();
            if(changed)
                Hub.Publish("ShowToastInfo", "Environment Changed", string.Format("Changed to {0}", environment));
        }

        private string Environment { get; set; }


        public bool IsProduction
        {
            get
            {
                var environment = GetEnvironment() ?? "null";
                return environment.Equals(EnvironmentHelper.Prod, StringComparison.InvariantCultureIgnoreCase)
                    || environment.Equals(EnvironmentHelper.Production, StringComparison.InvariantCultureIgnoreCase);
            }
        }

        /// <summary>
        /// Returns true if we are running in Uat
        /// </summary>
        public bool IsUat
        {
            get
            {
                var environment = GetEnvironment() ?? "null";
                return environment.Equals(EnvironmentHelper.Uat, StringComparison.InvariantCultureIgnoreCase);
            }
        }

        /// <summary>
        /// Returns true if we are running in Dev
        /// </summary>
        public bool IsDev
        {
            get
            {
                var environment = GetEnvironment() ?? "null";
                return environment.Equals(EnvironmentHelper.Dev, StringComparison.InvariantCultureIgnoreCase);
            }
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

        public Func<string, string> GetConnectionStringOverride { get; set; }

        public string GetConnectionString(string name, bool appendEnvironment, string environmentOverride = null)
        {
            // this default version is very specific to the AdminTool (with the way it builds up the string to search for in AppSettings)
            if(GetConnectionStringOverride != null)
                return GetConnectionStringOverride(name);
            
            var key = name;
            if (appendEnvironment)
                key += string.IsNullOrEmpty(environmentOverride) ? GetEnvironment() : environmentOverride;
            return ConfigurationManager.AppSettings[key];
        }
    }
}