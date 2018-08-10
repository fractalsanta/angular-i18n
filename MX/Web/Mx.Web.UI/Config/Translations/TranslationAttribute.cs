using System;

namespace Mx.Web.UI.Config.Translations
{
    [AttributeUsage(AttributeTargets.Class)]
    public class TranslationAttribute:Attribute
    {
        public string Name { get; set; }

        public TranslationAttribute(string name)
        {
            Name = name;
        }
    }
}