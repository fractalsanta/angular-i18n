
using Rockend.Common;
using Rockend.Common.Helpers;

namespace Communicator.DAL
{
    /// <summary>
    /// RestCentral
    /// </summary>
    public partial class RestCentral
    {
        private static string connectionString;

        /// <summary>
        /// ctor
        /// </summary>
        /// <remarks>private because should use CentralRepo.GetRESTCentralContext() to get the context</remarks>
        private RestCentral()
            : base(ConnectionString)
        {
        }

        public static RestCentral BuildForTesting()
        {
            return new RestCentral();
        }

        private static IEnvironmentService environmentService;

        private static IEnvironmentService EnvironmentService
        {
            get { return environmentService ?? (environmentService = SimpleContainer.GetInstance<IEnvironmentService>()); }
        }

        /// <summary>
        /// Gets the connection string for RestCentral, needs to be set by the running app
        /// </summary>
        /// <remarks>forced setting the value because of Azure so can change the db connString in the Azure config file</remarks>
        public static string ConnectionString
        {
            get
            {
                if (string.IsNullOrEmpty(connectionString))
                    connectionString = EnvironmentService.GetConnectionString("RestCentralConnString", false);
                return connectionString;
            }
            set { connectionString = value; }
        }       
    }
}
