using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Reflection;
using Mx.Web.UI.Areas.Workforce.MySchedule.Api.Models;
using NHibernate;
using NHibernate.Hql.Ast.ANTLR;
using System.Drawing.Imaging;

namespace Mx.Web.UI.Areas.Workforce.MySchedule.Api.Services
{
    public class LogonImageService : ILogonImageService
    {
        public byte[] GetLogonImageByKey(string key)
        {
            byte[] returnValue = null;

            if (string.IsNullOrEmpty(key))
            {
                throw new ArgumentNullException("key");
            }

            var assembly = Assembly.GetExecutingAssembly();
            using (var imageStream = assembly.GetManifestResourceStream(key))
            {
                if (imageStream != null)
                {
                    using (var image = Image.FromStream(imageStream))
                    {
                        using (var memoryStream = new MemoryStream())
                        {
                            image.Save(memoryStream, ImageFormat.Jpeg);
                            returnValue = memoryStream.ToArray();
                        }
                    }
                }
            }

            return returnValue;
        }
    }
}