using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Rockend.iStrata.StrataCommon.BusinessEntities;
using System.Text;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using Rockend.iStrata.StrataWebsite.Model;

namespace Rockend.iStrata.StrataWebsite.Helpers
{
    public static class FormatHelper
    {
        public static bool ToBoolean(this string s)
        {
            return "Y".Equals(s, StringComparison.InvariantCultureIgnoreCase);
        }

        public static string Format(this DateTime date)
        {
            if (date != new DateTime(1900, 1, 1))
            {
                return date.ToString("dd/MM/yyyy");
            }
            return string.Empty;
        }

        public static string Strong(this string value)
        {
            if (string.IsNullOrEmpty(value))
            {
                return value;
            }
            else
            {
                return "<strong>" + value + "</strong>";
            }
        }

        public static StringBuilder AddEmptyLine(this StringBuilder sb)
        {
            sb.Append(Environment.NewLine);
            return sb;
        }

        public static StringBuilder AddLine(this StringBuilder sb, string value)
        {
            if (!string.IsNullOrEmpty(value))
            {
                if (sb.Length != 0)
                {
                    sb.Append(Environment.NewLine);
                }
                sb.Append(value);
            }
            return sb;
        }

        public static StringBuilder AddLine(this StringBuilder sb, params string[] values)
        {
            StringBuilder sb2 = new StringBuilder();
            foreach (string value in values)
            {
                if (!string.IsNullOrEmpty(value))
                {
                    if (sb2.Length != 0)
                    {
                        sb2.Append(" ");
                    }
                    sb2.Append(value);
                }
            }

            return sb.AddLine(sb2.ToString());
        }

        public static IHtmlString ValueOrDefault(this HtmlHelper a, string input, bool includeLineBreak = true, string defaultValue = "")
        {
            if (!string.IsNullOrWhiteSpace(input))
            {
                return new MvcHtmlString(string.Concat(input, includeLineBreak ? "<br />" : string.Empty));
            }
            else
            {
                return new MvcHtmlString(string.Concat(defaultValue, includeLineBreak ? "<br />" : string.Empty));
            }
        }

        public static StringBuilder AddHeadingOnly(this StringBuilder sb, string heading)
        {
            if (sb.Length != 0)
                sb.AppendLine();

            sb.Append("<strong>").Append(heading).Append("</strong> ");
            return sb;
        }

        public static StringBuilder AddHeading(this StringBuilder sb, string heading, string value)
        {
            if (!string.IsNullOrEmpty(value))
            {
                if (sb.Length != 0)
                {
                    sb.AppendLine();
                }
                sb.Append("<strong>").Append(heading).Append(":</strong> ");
                sb.Append(value);
            }
            return sb;
        }

        public static StringBuilder AddHeading(this StringBuilder sb, string heading, params string[] values)
        {
            StringBuilder sb2 = new StringBuilder();
            foreach (string value in values)
            {
                if (!string.IsNullOrEmpty(value))
                {
                    if (sb2.Length != 0)
                    {
                        sb2.Append(" ");
                    }
                    sb2.Append(value);
                }
            }

            return sb.AddHeading(heading, sb2.ToString());
        }

        public static string ToHtml(this StringBuilder sb)
        {
            return sb.ToString().Replace(Environment.NewLine, "<br />");
        }

        public static string FormatAll(this Contact contact)
        {
            if (contact == null) return string.Empty;

            StringBuilder sb = new StringBuilder();
            bool bizContact = contact.BusinessContact.ToBoolean();

            // name
            if (bizContact)
            {
                sb.AddHeading("Business Contact", Environment.NewLine);
                sb.AddLine(contact.Name);
            }
            else
            {
                sb.AddHeading("Private / Residential Contact", Environment.NewLine);
                sb.AddLine(contact.Title, contact.FirstName, contact.OtherNames, contact.Name);
            }

            // address
            sb.AddLine(contact.BuildingName);
            if (!string.IsNullOrEmpty(contact.POBox))
            {
                sb.AddLine(contact.POBox);
            }
            else
            {
                sb.AddLine(contact.StreetNumber, contact.StreetName);
            }
            sb.AddLine(contact.Town, contact.State, contact.Postcode);
            sb.AddLine(contact.Country);
            sb.AppendLine();

            // phones
            if (bizContact)
            {
                sb.AddHeading("Telephone 1", contact.Telephone1);
                sb.AddHeading("Telephone 2", contact.Telephone2);
            }
            else
            {
                sb.AddHeading("Home Phone", contact.Telephone1);
                sb.AddHeading("Work Phone", contact.Telephone2);
            }

            sb.AddHeading("Mobile", contact.Telephone3);
            sb.AddHeading("Fax", contact.Fax);
            sb.AddHeading("Email", contact.Email);
            sb.AddHeading("Website", contact.Website);

            return sb.ToHtml();
        }

        public static string ToStringOrEmpty(this string content, bool includeLineBreak = true)
        {            
            if(includeLineBreak)
                return string.Concat(content, "<br />");
            else
                return content;            
        }

        public static string ToStringOrDefault(this string content, string defaultValue = "--")
        {
            if (!string.IsNullOrWhiteSpace(content))
            {
                return content;
            }
            else
            {
                return defaultValue;
            }
        }

        public static string OutputNewLineIfHasValue(this string input)
        {
            if (!string.IsNullOrWhiteSpace(input))
            {
                return string.Concat(input.Replace("<", "< "), "<br />");
            }
            else
            {
                return string.Empty;
            }
        }
    }
}
