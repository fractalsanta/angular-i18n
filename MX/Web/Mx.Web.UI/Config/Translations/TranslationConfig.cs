using System.Linq;
using System.Reflection;
using StructureMap;

namespace Mx.Web.UI.Config.Translations
{
    public static class TranslationConfig
    {
        internal static void Configure(IInitializationExpression x)
        {
            var factory = new VirtualProxyFactory(Assembly.GetExecutingAssembly(),
                t => t.IsPublic && t.GetCustomAttributes(typeof(TranslationAttribute), false).Any());
            x.For<IVirtualProxyFactory>().Singleton().Use(factory);
        }
    }
}