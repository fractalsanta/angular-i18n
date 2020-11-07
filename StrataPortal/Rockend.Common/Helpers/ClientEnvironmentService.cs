using System;
using System.Configuration;

namespace Rockend.Common.Helpers
{
    /// <summary>
    /// Determine environment from the Launch.env file (PROD if Launch.env does not exist)
    /// </summary>
    public class ClientEnvironmentService : IEnvironmentService
    {
        public string GetEnvironment()
        {
            // if has been explicitly set then use that...otherwise launch file
            return Environment ?? EnvironmentHelper.GetEnvironment();
        }


        public void SetEnvironment(string environment)
        {
            Environment = environment;
         //   Hub.Publish(string.Format("Environment set/changed to {0}", environment));
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

        public string GetConnectionString(string name, bool appendEnvironment, string environmentOverride = null)
        {
            // ignore overide, no need in this impl atm
            var key = name;
            if (appendEnvironment)
                key += string.IsNullOrEmpty(environmentOverride) ? GetEnvironment() : environmentOverride;
            return ConfigurationManager.AppSettings[key];
        }
    }
}
