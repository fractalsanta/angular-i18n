using System.Collections.Generic;
using Mx.Web.UI.Config.T4;

namespace Mx.Web.UI.Areas.Core.Api.Models
{
    [MapToTypeScript]
    public class Constants
    {
        public string NumericalInputBoxPattern { get; set; }
        public string InternalDateFormat { get; set; }
        public string InternalDateTimeFormat { get; set; }
        public string DateCompactFormat { get; set; }
        public object GoogleAnalyticsAccounts { get; set; }
        public string SystemCulture { get; set; }
        public VersionInformation VersionInfo { get; set; }
        public bool TouchKeyboardEnabled { get; set; }
        public long SystemCurrencyId { get; set; }
        public string SystemCurrencySymbol { get; set; }
        public short LoginPageColorScheme { get; set; }

        public int SignaRReconnectionTimeout { get; set; }

        public int NotificationRefreshInterval { get; set; }
        public bool IsBackplane { get; set; }
        public int CheckBackplaneInterval { get; set; }

        public List<EntityIdWithCurrencySymbol> EntitiesWithDifferentCurrencySymbol { get; set; }
    }
}