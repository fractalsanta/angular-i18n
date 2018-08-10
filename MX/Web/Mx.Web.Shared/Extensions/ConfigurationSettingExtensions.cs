using Mx.Foundation.Services.Contracts.Responses;

namespace Mx.Web.Shared.Extensions
{
    public static class ConfigurationSettingExtensions
    {
        public static T GetValue<T>(this ConfigurationSettingResponse configSetting)
        {
            return (T) System.ComponentModel.TypeDescriptor.GetConverter(typeof(T)).ConvertFrom(configSetting.Value);
        }
    }
}
