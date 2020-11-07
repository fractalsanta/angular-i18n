using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Agile.Diagnostics.Logging;
using Rockend.Common;
using Rockend.CommunicatorDto.Helpers;

namespace CommunicatorDto
{
    public class RwacBootstrapper
    {
        /// <summary>
        /// Startup logic that affects all services, AMH, RPMH and SMH
        /// </summary>
        public virtual void Startup()
        {
            Logger.Info("RwacBootstrapper");
            SimpleContainer.RegisterSingle<IAppRequestHelper, AppRequestHelper>();
            SimpleContainer.RegisterSingle<ICache, Cache>();

        }
    }
}
