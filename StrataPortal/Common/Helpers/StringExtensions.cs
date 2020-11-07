using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace Rockend.WebAccess.Common.Helpers
{
    public static class StringExtensions
    {
        /// <summary>
        /// Converts the first letter of a string tpo upper case.
        /// </summary>
        /// <param name="s">String to convert</param>
        /// <returns>String with first character in upper case.</returns>
        public static string UppercaseFirst(this string s)
        {
            // Check for empty string.
            if (string.IsNullOrEmpty(s))
            {
                return string.Empty;
            }
            // Return char and concat substring.
            return string.Concat(char.ToUpper(s[0]), s.Substring(1));
        }

        public static bool IsValidEmailAddress(this string email)
        {
            Regex regex = new Regex(@"^([0-9a-zA-Z]([-\.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$");
            return regex.IsMatch(email);
        }
    }
}
