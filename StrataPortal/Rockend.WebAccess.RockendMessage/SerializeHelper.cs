using System.IO;
using System.Runtime.Serialization;
using System.Text;
using System.Xml;

namespace Rockend.WebAccess.RockendMessage
{
    /// <summary>
    /// Contains extension methods to serialize / deserialze an object using the NET data contract serializer.
    /// </summary>
    public static class SerializeHelper
    {
        /// <summary>
        /// Converts the object to XML.
        /// </summary>
        /// <param name="obj">The object.</param>
        /// <returns>XML string.</returns>
        public static string SerializeToXML(this object obj)
        {
            NetDataContractSerializer ndcs = new NetDataContractSerializer();
            ndcs.Context = new StreamingContext(StreamingContextStates.All);
            StringBuilder sb = new StringBuilder();
            using (XmlWriter writer = XmlWriter.Create(sb))
            {
                ndcs.WriteObject(writer, obj);
                writer.Flush();
            }
            return sb.ToString();
        }

        /// <summary>
        /// Converts the XML to an object.
        /// </summary>
        /// <param name="xml">The XML.</param>
        /// <returns>The object.</returns>
        public static object DeserializeFromXML(this string xml)
        {
            NetDataContractSerializer ndcs = new NetDataContractSerializer();
            ndcs.Context = new StreamingContext(StreamingContextStates.All);

            using (StringReader stringReader = new StringReader(xml))
            {
                using (XmlReader xmlReader = XmlReader.Create(stringReader))
                {
                    object obj = ndcs.ReadObject(xmlReader, true);
                    return obj;
                }
            }
        }

        /// <summary>
        /// Converts the XML to an object of T.
        /// </summary>
        /// <typeparam name="T">The desired type.</typeparam>
        /// <param name="xml">The XML.</param>
        /// <returns></returns>
        public static T DeserializeFromXML<T>(this string xml) where T:class
        {
            return xml.DeserializeFromXML() as T;
        }
    }
}
