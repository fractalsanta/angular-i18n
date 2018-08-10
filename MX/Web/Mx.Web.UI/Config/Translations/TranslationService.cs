using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Script.Serialization;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Web.UI.Config.Helpers;

namespace Mx.Web.UI.Config.Translations
{
    public class TranslationService : ITranslationService
    {
        private readonly IVirtualProxyFactory _factory;
        private readonly ILocalisationQueryService _localisationQueryService;

        public TranslationService(IVirtualProxyFactory factory, ILocalisationQueryService localisationQueryService)
        {
            _factory = factory;
            _localisationQueryService = localisationQueryService;
        }

        public Int32 GetLocalisationVersion()
        {
            return _localisationQueryService.GetLocalisationVersion();
        }

        public T Translate<T>(string culture) where T : new()
        {
            var attribute = typeof (T)
                .GetCustomAttributes(typeof (TranslationAttribute), true)
                .Cast<TranslationAttribute>()
                .FirstOrDefault();
            if (attribute == null)
            {
                throw new ArgumentException("The model needs to be marked with [Translation] attribute: " + typeof(T).FullName);
            }
            var defaultModel = new T();
            var serializer = new JavaScriptSerializer();
            var defaultData = serializer.Serialize(defaultModel);
            var defaultDictionary = serializer.Deserialize<Dictionary<string, string>>(defaultData);
            var dictionary = _localisationQueryService.GetPageTranslation(attribute.Name, culture);
            var combined = DictionaryHelper.Merge(dictionary, defaultDictionary);
            var proxyType = _factory.GetProxyType(typeof(T));
            string data = serializer.Serialize(combined);
            return (T) serializer.Deserialize(data, proxyType);
        }
    }
}