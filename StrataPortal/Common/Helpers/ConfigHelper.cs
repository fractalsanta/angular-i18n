using System.Configuration;

namespace Rockend.WebAccess.Common
{
    public static class ConfigHelper
    {
        #region Helper methods to extract typed values from appSettings
        /// <summary>
        /// Retreives a value from app settings as a string
        /// </summary>
        /// <param name="key">The key of the appsetting</param>
        /// <returns>The value as a string</returns>
        public static string GetStringValue(string key)
        {
            return ConfigurationManager.AppSettings[key];
        }

        /// <summary>
        /// Get the value of an appSetting as a double using default(double) as a default if
        /// the value cannot be converted
        /// </summary>
        /// <param name="key">The key of the appSetting</param>
        /// <returns>The value as an integer or default(int) if value cannot be read</returns>
        public static int GetIntValue(string key)
        {
            return GetIntValue(key, default(int));
        }

        /// <summary>
        /// Get a appSetting value and return it as an integer
        /// </summary>
        /// <param name="key">The key of the appSetting</param>
        /// <param name="defaultValue">The default value to return</param>
        /// <returns>The value as an integer or the default value if the value cannot be read</returns>
        public static int GetIntValue(string key, int defaultValue)
        {
            string stringValue = ConfigurationManager.AppSettings[key];
            int value;

            if (!int.TryParse(stringValue, out value))
                value = defaultValue;

            return value;
        }

        /// <summary>
        /// Get a appSetting value and return it as a double
        /// </summary>
        /// <param name="key">The key of the appSetting</param>
        /// <returns>The value as a double or default(double) if the value cannot be read</returns>
        public static double GetDoubleValue(string key)
        {
            return GetDoubleValue(key, default(double));
        }
        /// <summary>
        /// Get a appSetting value and return it as a double
        /// </summary>
        /// <param name="key">The key of the appSetting</param>
        /// <returns>The value as a bool or default(bool) if the value cannot be read</returns>
        public static bool GetBoolValue(string key)
        {
            return GetBoolValue(key, default(bool));
        }

        /// <summary>
        /// Get a appSetting value and return it as a double
        /// </summary>
        /// <param name="key">The key of the appSetting</param>
        /// <param name="defaultValue">The default value to return</param>
        /// <returns>The value as a double or the default value if the value cannot be read</returns>
        public static double GetDoubleValue(string key, double defaultValue)
        {
            string stringValue = ConfigurationManager.AppSettings[key];
            double value;

            if (!double.TryParse(stringValue, out value))
                value = defaultValue;

            return value;
        }
        /// <summary>
        /// Get a appSetting value and return it as a double
        /// </summary>
        /// <param name="key">The key of the appSetting</param>
        /// <param name="defaultValue">The default value to return</param>
        /// <returns>The value as a bool or the default value if the value cannot be read</returns>
        public static bool GetBoolValue(string key, bool defaultValue)
        {
            string stringValue = ConfigurationManager.AppSettings[key];
            bool value;

            if (!bool.TryParse(stringValue, out value))
                value = defaultValue;

            return value;
        }

        public static void SaveValueToConfig(string key, string value)
        {
            Configuration config = ConfigurationManager.OpenExeConfiguration(ConfigurationUserLevel.None);
            config.AppSettings.Settings.Remove(key);
            config.AppSettings.Settings.Add(key, value);
            config.Save(ConfigurationSaveMode.Modified);

            ConfigurationManager.RefreshSection("appSettings");
            return;
        }
        #endregion
    }
}
