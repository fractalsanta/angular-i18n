using System;
using System.Globalization;

namespace Mx.Web.UI.Config.Helpers
{
    public static class StringHelper
    {
        public static bool HasValue(this string value)
        {
            return !string.IsNullOrWhiteSpace(value);
        }

        public static string Str<T>(this T value) where T: IConvertible
        {
            return value.ToString(CultureInfo.InvariantCulture);
        }

        public static string Str(this DateTime value)
        {
            return value.ToString("yyyy-MM-ddTHH:mm:ss", CultureInfo.InvariantCulture);
        }

        /// <summary>
        /// Returns the calendar date representation in ISO 8601 format.
        /// </summary>
        public static string DateStr(this DateTime value)
        {
            return value.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
        }

        /// <summary>
        /// Returns the localized calendar date representation, based on the DateTimeFormatInfo.ShortDatePattern property.
        /// </summary>
        public static string DateStr(this DateTime value, string culture)
        {
            return value.ToString("d", new CultureInfo(culture));
        }
    }
}