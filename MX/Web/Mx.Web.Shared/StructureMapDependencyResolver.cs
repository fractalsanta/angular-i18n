using System;
using System.Collections.Generic;
using System.Linq;
using Mvc = System.Web.Mvc;
using Api = System.Web.Http.Dependencies;
using StructureMap;


namespace Mx.Web.Shared
{
    public class StructureMapDependencyResolver : Mvc.IDependencyResolver, Api.IDependencyResolver
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
            catch
            {
                return null;
            }
        }

        public IEnumerable<Object> GetServices(Type serviceType)
        {
            return Container.GetAllInstances(serviceType).Cast<Object>();
        }

		public Api.IDependencyScope BeginScope()
		{
			return this;
		}

		public void Dispose()
		{
		}
	}
}