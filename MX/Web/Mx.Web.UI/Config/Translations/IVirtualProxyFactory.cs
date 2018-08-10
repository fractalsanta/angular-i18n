using System;

namespace Mx.Web.UI.Config.Translations
{
    public interface IVirtualProxyFactory
    {
        T Create<T>() where T : new();
        Type GetProxyType(Type type);
    }
}