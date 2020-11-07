using System.Text.RegularExpressions;

namespace Rockend.Common
{
    public static class RegexPatterns
    {
        /// <summary>
        /// Pattern for matching a string that contains only numeric characters
        /// </summary>
        public static readonly Regex AllNumbers = new Regex(@"^\d+$"); 
    }
}