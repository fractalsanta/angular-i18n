using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Rockend.WebAccess.Common
{
    public static class StringExtension
    {
        public static string KeyValueExtraction(this String str, string searchFor)
        {
            return KeyValueExtraction(str, searchFor, ';', '=');
        }

        public static string KeyValueExtraction(this String str, string searchFor, char itemSeparator, char valueSeparator)
        {
            string result = string.Empty;

            int pos = str.ToLower().IndexOf(searchFor.ToLower());
            if (pos > -1)
            {
                int pos2 = str.ToLower().IndexOf(valueSeparator, pos);
                if (pos2 > -1)
                {
                    int pos3 = str.ToLower().IndexOf(itemSeparator, pos2);
                    if (pos3 > -1)
                        result = str.Substring(pos2+1, pos3 - (pos2 + 1));
                    else
                        result = str.Substring(pos2 + 1);
                }
            }

            return result;
        }


        /// <summary>
        /// Returns the WebAccessClientID as an int
        /// </summary>
        public static int AsInt(this string value)
        {
            try
            {
                var key = Convert.ToInt32(value);
                return key;
            }
            catch
            {
                return -1;
            }            
        }

    }
}
