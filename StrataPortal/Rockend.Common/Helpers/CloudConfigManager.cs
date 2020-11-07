using System;
using System.Runtime.Caching;
using Microsoft.Azure;
using Rockend.Common.Interface;

namespace Rockend.Common.Helpers
{
    public class CloudConfigManager : IConfig
    {
        private static readonly string _instanceKey = "CloudConfigManager";
        public bool GetValue<T>(string key, Func<string, T> convertor, out T result, T defaultValue = default(T))
        {
            try
            {
                var settingsVal = CloudConfigurationManager.GetSetting(key);
                result = settingsVal != null ? convertor(settingsVal) : defaultValue;
                return true;
            }
            catch
            {
                result = defaultValue;
                return false;
            }
        }
        public bool GetBool(string key)
        {
            bool ret;
            GetValue(key, bool.Parse, out ret);
            return ret;
        }

        public string GetString(string key)
        {
            string ret;
            GetValue(key, itm => itm, out ret);
            return ret;
        }
        public int GetInt(string key)
        {
            int ret;
            GetValue(key, int.Parse, out ret);
            return ret;
        }
        public int GetInt(string key, int defaultValue)
        {
            int ret;
            GetValue(key, int.Parse, out ret, defaultValue);
            return ret;
        }
        public bool GetBool(string key, bool defaultValue)
        {
            bool ret;
            GetValue(key, bool.Parse, out ret, defaultValue);
            return ret;
        }

        public string GetString(string key, string defaultValue)
        {
            string ret;
            GetValue(key, itm => itm, out ret, defaultValue);
            return ret;
        }

        public static CloudConfigManager Instance
        {
            get
            {
                try
                {
                    var cache = MemoryCache.Default;
                    if (!cache.Contains(_instanceKey))
                    {
                        cache[_instanceKey] = new CloudConfigManager();
                    }
                    return cache[_instanceKey] as CloudConfigManager;
                }
                catch
                {
                   return new CloudConfigManager();
                }
                
            }
        }
    }
}