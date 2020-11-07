using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using System.Xml.Linq;

namespace Rockend.WebAccess.Common.Helpers
{
    public static class XMLDataHelper
    {
        public static XElement CreateXElement(string fieldName, string value)
        {
            if (!IsValidXml(value))
            {
                return new XElement("Field", new XAttribute("name", fieldName), new XAttribute("value", ""));
            }

            return new XElement("Field", new XAttribute("name", fieldName), new XAttribute("value", value ?? string.Empty));
        }

        public static string GetAttributeOrDefault(this XElement x, string attribute, string defaultValue = "")
        {
            string result;

            XAttribute xAttribute = x.Attribute(attribute);

            if (xAttribute != null)
                result = xAttribute.Value;
            else
                result = defaultValue;

            return result;
        }

        public static T GetValueFromXml<T>(XElement element, string fieldName)
        {
            XElement matchingNode = element.Elements("Field").FirstOrDefault(e =>
                    e.Attribute("name") != null
                    && e.Attribute("name").Value.ToLower().Equals(fieldName.ToLower()));

            if (matchingNode != null && matchingNode.Attribute("value") != null)
            {
                string attrValue = matchingNode.Attribute("value").Value;
                try
                {
                    var result = Convert.ChangeType(attrValue, typeof(T));
                    return (T)result;
                }
                catch (Exception)
                {
                    return default(T);
                }
            }

            return default(T);
        }

        internal static bool IsValidXml(string input)
        {
            if (input == null) return false;

#if !IOS
			return !input.Any(c => !XmlConvert.IsXmlChar(c));
#else
			return true;
#endif
        }
    }
}
