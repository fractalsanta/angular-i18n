using System.Configuration;
using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Tests.Config.Translations
{
    [Translation("TestModel")]
    public class TestModelNoSet
    {
        public virtual string Foo { get { return "Default Foo"; } }
        public virtual string Bar { get { return "Default Bar"; } }
    }
}
