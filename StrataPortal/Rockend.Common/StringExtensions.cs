using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;

namespace Rockend.Common
{
    public static class StringExtensions
    {
        private static TextInfo textInfo;

        private static TextInfo TextInfo
        {
            get { return textInfo ?? (textInfo = new CultureInfo("en-AU", false).TextInfo); }
        }

        public static string ToPascalCase(this string s, TextInfo textInfoOverride = null)
        {
            var info = textInfoOverride ?? TextInfo;
            return info.ToTitleCase(s.ToLower());
        }
    }
}
