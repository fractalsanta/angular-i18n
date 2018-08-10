using System.Configuration;
using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Tests.Config.Translations
{
    [Translation("TestModel")]
    public class TestModel
    {
        public virtual string Foo { get { return "Default Foo"; } set { } }
        public virtual string Bar { get { return "Default Bar"; } set { } }
    }
}
