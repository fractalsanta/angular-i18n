using System.Collections.Generic;
using System.Linq;

namespace Mx.Web.UI.Config.Helpers
{
    public static class DictionaryHelper
    {
        /// <summary>
        /// merges two different dictionary objects handling duplicate keys gracefully
        /// http://stackoverflow.com/questions/294138/merging-dictionaries-in-c-sharp
        /// </summary>
        /// <typeparam name="TKey"></typeparam>
        /// <typeparam name="TValue"></typeparam>
        /// <param name="dictionaries"></param>
        /// <returns></returns>
        public static Dictionary<TKey, TValue> Merge<TKey, TValue>(params IDictionary<TKey, TValue>[] dictionaries)
        {
            return dictionaries.SelectMany(dict => dict)
                         .ToLookup(pair => pair.Key, pair => pair.Value)
                         .ToDictionary(group => group.Key, group => group.First());
        }
    }
}