using System;
using System.Collections.Generic;

namespace Mx.Web.Shared
{
    public interface IDependencyContainer
    {
        T Resolve<T>();
        T Resolve<T>(String name);
        T Resolve<T>(String name, params KeyValuePair<String, Object>[] args);
        IEnumerable<T> ResolveAll<T>();
    }
}