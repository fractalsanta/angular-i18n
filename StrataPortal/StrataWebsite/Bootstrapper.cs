using Agile.Diagnostics.Logging;
using Rockend.Azure;
using Rockend.Common;
using Rockend.Common.Helpers;
using RwacUtility.Objects;

namespace Rockend.iStrata.StrataWebsite
{
    public class Bootstrapper
    {
        public void Start()
        {
            Logger.Debug("SM.Bootstrapper");
            SimpleContainer.Register<IEnvironmentService, AzureEnvironmentService>();
            SimpleContainer.Register<ICentralRepository, CentralRepository>();
        }
    }
}
