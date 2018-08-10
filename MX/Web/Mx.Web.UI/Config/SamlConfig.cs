using System.Web;
using Mx.Web.UI.Config.Saml;
using Mx.Configuration;

namespace Mx.Web.UI.Config
{
    public class SamlConfig
    {
        public static void Configure()
        {
            if (SamlHelper.IsMobileSamlEnabled)
            {
                SamlHelper.LoadSamlCertificates(HttpContext.Current.Server.MapPath(MxAppSettings.MobileSamlCertificateLocation),
                            MxAppSettings.MobileSpCertificateName,
                            MxAppSettings.MobileIdpCertificateName);
            }
        }

    }
}