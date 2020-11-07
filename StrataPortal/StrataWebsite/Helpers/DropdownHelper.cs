using System;
using System.Collections.Generic;
using System.Text;
using System.Web.Mvc;
using Rockend.iStrata.StrataWebsite.Model;

namespace Rockend.iStrata.StrataWebsite.Helpers
{
    /// <summary>
    /// HtmlHelper methods for creating the dropdown lists.
    /// </summary>
    public static class DropdownHelper
    {
        /// <summary>
        /// Render a dropdown list element to a string with the given list of items.
        /// </summary>
        /// <param name="htmlHelper">The HTML helper.</param>
        /// <param name="items">The items to display in the dropdown.</param>
        /// <param name="selectedIndex">Index of the selected item.</param>
        /// <param name="value">The function used to get the value from each dropdown item.</param>
        /// <returns>HTML fragment.</returns>
        public static string StrataDropdown(this HtmlHelper htmlHelper,
            List<DropdownItem> items, int selectedIndex, Func<DropdownItem, int, string> value, string controlId = "")
        {
            StringBuilder sb = new StringBuilder();
            
            // optionally, set the id of the dropdown control
            if (!string.IsNullOrWhiteSpace(controlId)) { controlId = string.Format("id = \"{0}\"", controlId); }

            sb.AppendFormat("<select class=\"lotDropDown\" {0} onchange=\"window.location.href = this.options[this.selectedIndex].value;\">\n", controlId);
            for (int index = 0; index < items.Count; index++)
            {
                sb.Append("<option ");
                if (index == selectedIndex)
                {
                    sb.Append("selected=\"selected\" ");
                }
                sb.Append("value=\"" + value(items[index], index) + "\">");
                sb.Append(items[index]);
                sb.AppendLine("</option>");
            }
            sb.AppendLine("</select>");

            return sb.ToString();
        }


        /// <summary>
        /// Render a dropdown list element to a string with the given list of items.
        /// </summary>
        /// <param name="htmlHelper">The HTML helper.</param>
        /// <param name="items">The items to display in the dropdown.</param>
        /// <param name="selectedIndex">Index of the selected item.</param>
        /// <param name="value">The function used to get the value from each dropdown item.</param>
        /// <returns>HTML fragment.</returns>
        public static string StrataDropdownNoRefresh(this HtmlHelper htmlHelper,
            List<DropdownItem> items, int selectedIndex, Func<DropdownItem, int, string> value, string controlId = "")
        {
            StringBuilder sb = new StringBuilder();

            // optionally, set the id of the dropdown control
            if (!string.IsNullOrWhiteSpace(controlId)) { controlId = string.Format("id = \"{0}\" name=\"{0}\"", controlId); }

            sb.AppendFormat("<select class=\"lotDropDown\" {0} onchange=\"\">\n", controlId);
            for (int index = 0; index < items.Count; index++)
            {
                sb.Append("<option ");
                if (index == selectedIndex)
                {
                    sb.Append("selected=\"selected\" ");
                }
                sb.Append("value=\"" + value(items[index], index) + "\">");
                sb.Append(items[index]);
                sb.AppendLine("</option>");
            }
            sb.AppendLine("</select>");

            return sb.ToString();
        }
    }
}
