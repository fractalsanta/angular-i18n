using System;
using System.IO;
using System.Net;
using Mx.Configuration;
using Mx.Services.Shared.Diagnostic;

namespace Mx.Web.UI.Areas.Core.Diagnostics.Api.SystemTests
{
    public class DownloadUrl : IUrlDiagnostic
    {
        public bool IsSlicesUrlConfigured()
        {
            return MxAppSettings.ServiceSliceUrl_KeyExists && !string.IsNullOrWhiteSpace(MxAppSettings.ServiceSliceUrl);
        }

        public bool IsLegacySliceUrlConfigured()
        {
            return MxAppSettings.MMSServiceBaseUrl_KeyExists && !string.IsNullOrWhiteSpace(MxAppSettings.MMSServiceBaseUrl);
        }

        public string GetData(string url)
        {
            if (string.IsNullOrWhiteSpace(url))
            {
                return null;
            }

            string result = null;
            using (var client = new WebClient())
            {

                // Add a user agent header in case the  
                // requested URI contains a query.
                client.Headers.Add("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2; .NET CLR 1.0.3705;)");

                using (var data = client.OpenRead(url))
                {
                    if (data != null)
                    {
                        using (var reader = new StreamReader(data))
                        {
                            result = reader.ReadToEnd();
                            reader.Close();
                        }
                        data.Close();
                    }
                }
            }
            return result;
        }

        public DiagnosticMessage TestSliceUrl(string url)
        {
            if (!IsSlicesUrlConfigured())
            {
                return new DiagnosticMessage
                {
                    Success = false,
                    Message = "ServiceSliceUrl is not configured correctly in mx.config",
                    Component = "Mobile Configuration"
                };
            }
            return TestUrl(MxAppSettings.ServiceSliceUrl + url);
        }

        public DiagnosticMessage TestLegacySliceUrl(string url)
        {
            if (!IsLegacySliceUrlConfigured())
            {
                return new DiagnosticMessage
                {
                    Success = false,
                    Message = "MMSServiceBaseUrl is not configured correctly in mx.config",
                    Component = "Mobile Configuration"
                };
            }
            return TestUrl(MxAppSettings.MMSServiceBaseUrl + url);
        }

        public DiagnosticMessage TestUrl(string url)
        {
            try
            {
                var data = GetData(url);
                return new DiagnosticMessage {Success = true};
            }
            catch (WebException ex)
            {
                try
                {
                    var resp = new StreamReader(ex.Response.GetResponseStream()).ReadToEnd();
                    var exdump = new Exception("Page Dump for " + url + " " + resp);
                    Elmah.ErrorLog.GetDefault(null).Log(new Elmah.Error(exdump));
                }
                catch
                {
                }

                Elmah.ErrorLog.GetDefault(null).Log(new Elmah.Error(ex));
                return new DiagnosticMessage
                {
                    Success = false,
                    Component = url,
                    Message = "Unable to connect to "+ url +" see /elmah.axd"
                };
            }
        }
    }
}