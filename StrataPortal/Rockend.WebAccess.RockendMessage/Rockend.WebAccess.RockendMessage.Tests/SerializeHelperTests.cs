using System;
using System.Globalization;
using Agile.Diagnostics.Logging;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Rockend.WebAccess.RockendMessage.Tests
{
    [TestClass]
    public class SerializeHelperTests
    {
        private string xmlStringWrapper = @"<?xml version=""1.0"" encoding=""utf-16""?><string z:Type=""System.String"" z:Assembly=""0"" xmlns:z=""http://schemas.microsoft.com/2003/10/Serialization/"" xmlns=""http://schemas.microsoft.com/2003/10/Serialization/"">{0}</string>";

        [TestMethod]
        public void SerializeToXML_NormalText()
        {
            var testText = "this is a test 123";
            var result = SerializeHelper.SerializeToXML(testText);
            Assert.IsNotNull(result);
            Assert.AreEqual(string.Format(xmlStringWrapper, testText), result);
        }


        #region SerializeToXml_HexChars

        /// <summary>
        /// 
        /// </summary>
        [TestMethod]
        public void SerializeToXml_HexChars()
        {
            Logger.Testing("ARRANGE");
            var soh = System.Convert.ToChar(System.Convert.ToUInt32("0x01"));
            Logger.Testing("ACT");
            var result = SerializeHelper.SerializeToXML(soh);
            Logger.Testing("ASSERT");
            Assert.IsNotNull(result);
        }

        #endregion


        #region SerializeToXml_InvalidXmlChars

        /// <summary>
        /// 
        /// </summary>
        [TestMethod]
        public void SerializeToXml_InvalidXmlChars()
        {
            Logger.Testing("ARRANGE");
            var text = "abc < xyz";
            Logger.Testing("ACT");
            var result = SerializeHelper.SerializeToXML(text);

            Logger.Testing("ASSERT");
            Assert.IsNotNull(result);

        }

        #endregion
    }
}
