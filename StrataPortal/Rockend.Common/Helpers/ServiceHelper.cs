using System.Collections.Generic;
using System.Linq;
using System.ServiceProcess;

namespace Rockend.Common.Helpers
{
    /// <summary>
    /// ServiceHelper
    /// </summary>
    /// <remarks>I had to add a reference to System.ServiceProcess so this 
    /// helper could be included in this project. Not happy about adding the reference because
    /// this Common library should have the bare minimum of dependencies. However needed a quick fix...</remarks>
    public static class ServiceHelper
    {
        public static List<ServiceController> GetRWACServices()
        {
            ServiceController[] services = ServiceController.GetServices();

            List<ServiceController> result = services.Where(service => service.ServiceName.ToLower().StartsWith("rockend")).ToList();

            return result;
        }
    }
}