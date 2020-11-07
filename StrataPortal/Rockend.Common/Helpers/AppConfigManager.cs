using System;
using System.Collections.Specialized;
using System.Configuration;
using System.Linq;
using Rockend.Common.Interface;

namespace Rockend.Common.Helpers
{
    public class AppConfigManager : IConfig
    {

        public AppConfigManager()
        {
            ConfigSource = ConfigurationManager.AppSettings;
        }

        public AppConfigManager(NameValueCollection source)
        {
            ConfigSource = source;
        }
        private NameValueCollection ConfigSource { get; set; }

        public bool GetValue<T>(string key, Func<string, T> convertor, out T result, T defaultValue = default(T))
        {
            try
            {
                var settingsVal = ConfigSource[key];
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


        public string DumpKeys()
        {
            var configManager = new AppConfigManager();
            var items = ConfigSource.AllKeys.Select(key => String.Format("{0}:{1}", key, configManager.GetString(key))).ToList();
            return string.Join("------", items);
        } 

    }
}