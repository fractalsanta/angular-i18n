using System.Globalization;
using System.Text.RegularExpressions;

namespace Mx.Web.UI.Config.Helpers
{
    public static class NumericHelper
    {
        public static double? ExtractNumber(this string s)
        {
            var value = Regex.Replace(s, @"[^0-9\.]+", "");
            double result;
            return double.TryParse(value, NumberStyles.Number, CultureInfo.InvariantCulture, out result) ? result : (double?) null;
        }
    }
}