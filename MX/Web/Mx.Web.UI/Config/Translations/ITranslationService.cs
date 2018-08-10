using System;

namespace Mx.Web.UI.Config.Translations
{
    public interface ITranslationService
    {
        Int32 GetLocalisationVersion();
        T Translate<T>(string culture) where T:new();
    }
}