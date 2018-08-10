using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http.Dependencies;
using StructureMap;

namespace Mx.Web.UI.Config.IoC
{
    public class StructureMapDependencyResolver : IDependencyResolver
    {
        private IContainer Container { get; set; }

        public StructureMapDependencyResolver(IContainer container)
        {
            Container = container;
        }

        public Object GetService(Type serviceType)
        {
            if (serviceType == null)
                return null;

            try
            {
                var service = serviceType.IsAbstract || serviceType.IsInterface
                         ? Container.TryGetInstance(serviceType)
                         : Container.GetInstance(serviceType);

                if (service != null)
                    Container.BuildUp(service);

                return service;
            }
            catch (Exception ex)
            {
                Elmah.ErrorLog.GetDefault(null).Log(new Elmah.Error(ex));
                return null;
            }
        }

        public IEnumerable<Object> GetServices(Type serviceType)
        {
            return Container.GetAllInstances(serviceType).Cast<Object>();
        }

        public IDependencyScope BeginScope()
        {
            return this;
        }

        public void Dispose()
        {
        }
    }
}