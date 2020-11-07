namespace Rockend.Common.Interface
{
    public interface IConfig
    {
        bool GetBool(string key);
        string GetString(string key);
        int GetInt(string key);
        bool GetBool(string key, bool defaultValue);
        string GetString(string key, string defaultValue);
        int GetInt(string key, int defaultValue);
    }
}