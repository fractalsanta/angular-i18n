using System;
using System.Collections.Generic;
using System.Linq;
using StructureMap;

namespace Mx.Web.Shared.IoC
{
    public class StructureMapDependencyContainer : IDependencyContainer
    {
        private IContainer Container { get; set; }

        public StructureMapDependencyContainer(IContainer container)
        {
            Container = container;
        }

        public T Resolve<T>()
        {
            var result = Container.GetInstance<T>();

            Container.BuildUp(result);

            return result;
        }

        public T Resolve<T>(String name)
        {
            var result = Container.GetInstance<T>(name);

            Container.BuildUp(result);

            return result;
        }

        public T Resolve<T>(String name, params KeyValuePair<String, Object>[] args)
        {
            if (args.Length == 0)
                throw new ArgumentException("No parameters for constructor creation", "args");

            ExplicitArgsExpression exp = null;

            foreach (var arg in args)
            {
                if (exp == null)
                    exp = Container.With(arg.Key).EqualTo(arg.Value);
                else
                    exp.With(arg.Key).EqualTo(arg.Value);
            }

            var result = exp.GetInstance<T>(name);

            Container.BuildUp(result);

            return result;
        }

        public IEnumerable<T> ResolveAll<T>()
        {
            var results = Container.GetAllInstances<T>().ToList();

            foreach (var result in results)
            {
                Container.BuildUp(result);
            }

            return results;
        }
    }
}