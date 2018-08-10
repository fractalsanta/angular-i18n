using System;
using System.IO;
using System.Security;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Web;
using System.Xml;
using ComponentSpace.SAML2;
using ComponentSpace.SAML2.Assertions;
using ComponentSpace.SAML2.Bindings;
using ComponentSpace.SAML2.Profiles.ArtifactResolution;
using ComponentSpace.SAML2.Profiles.SingleLogout;
using ComponentSpace.SAML2.Profiles.SSOBrowser;
using ComponentSpace.SAML2.Protocols;
using Mx.Configuration;
using Mx.Web.UI.Areas.Core.Api.Models;
using System.Linq;
using Mx.Web.UI.Config.Sso;

namespace Mx.Web.UI.Config.Saml
{
    public static class SamlHelper
    {
        #region Constants
        public const string SpX509Certificate = "spX509Certificate";
        public const string IdpX509Certificate = "idpX509Certificate";
        private const string BindingQueryParameter = "binding";
        private const string HttpRedirect = "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect";
        private const string HttpPost = "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST";
        private const string HttpArtifact = "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Artifact";
        private const string MessageTypeParameter = "message";
        private const string LogoutRequestType = "LogoutRequest";
        private const string LogoutResponseType = "LogoutResponse";
        private const string ActionUrlRedirect = "?url=";
        #endregion

        #region Public properties and methods

        public static void CheckSamlSsoSetupAndLogin()
        {
            if (HttpContext.Current.Request.Cookies[Startup.SsoAuthCookieName] == null)
            {
                var byPass = HttpContext.Current.Request.QueryString["bypass_sso"];
                if (String.IsNullOrEmpty(byPass)) byPass = "false";

                if (IsMobileSamlEnabled && !byPass.Contains("true"))
                {
                    if (HttpContext.Current.Request.Params["entityId"] != null)
                    {
                        var entityId = HttpContext.Current.Request.Params["entityId"];
                        var cookie = new HttpCookie(Startup.SharedEntityIdCookie, entityId)
                        {
                            Domain = null,
                            Expires = DateTime.Now.AddDays(1),
                            Path = "/"
                        };
                        HttpContext.Current.Response.Cookies.Add(cookie);
                    }

                    var appUrl = HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Path);
                    var rootUrl = HttpContext.Current.Request.Url.Scheme + "://" + HttpContext.Current.Request.Url.Authority + "/";
                    var redirectUrl = appUrl;

                    // Handles initial IFrame request from MMS
                    if ((HttpContext.Current.Request.UrlReferrer != null) && (HttpContext.Current.Request.UrlReferrer.Query.Contains(ActionUrlRedirect)))
                    {
                        redirectUrl = string.Format("{0}#{1}", appUrl, HttpContext.Current.Request.UrlReferrer.Query.Substring(ActionUrlRedirect.Length));
                    }
                    
                    var assertionConsumerServiceUrl = rootUrl + MxAppSettings.MobileAssertionUrl;

                    Login(rootUrl, assertionConsumerServiceUrl, redirectUrl, rootUrl,
                        MxAppSettings.MobileIdpssoURL,
                        MxAppSettings.MobileSpToIdpBinding,
                        MxAppSettings.MobileIdpToSpBinding,
                        MxAppSettings.MobileSignAuthenticationRequests);
                }
            }
        }

        public static string LogoutSaml(string userName)
        {
            return InitiateLogout(
                HttpContext.Current.Request.Url.Scheme  + "://" + HttpContext.Current.Request.Url.Authority + "/",
                MxAppSettings.MobileIdpLogoutURL,
                MxAppSettings.MobileSignAuthenticationRequests,
                userName);
        }

        public static bool IsMobileSamlEnabled
        {
            get { return !String.IsNullOrEmpty(MxAppSettings.MobileIdpssoURL); }
        }

        public static bool IsSamlEnabled
        {
            get { return !String.IsNullOrEmpty(MxAppSettings.MobileIdpssoURL); }
        }

        public static void LoadSamlCertificates(String certificatesDirectory, String spCertName, String idpCertName)
        {
            var filename = Path.Combine(certificatesDirectory, spCertName);
            HttpContext.Current.Application[SpX509Certificate] = LoadCertificate(filename, MxAppSettings.MobileSpCertificatePassword);

            filename = Path.Combine(certificatesDirectory, idpCertName);
#if DEBUG
            // This should not be used in production.  sp.pfx is our play certificate with a known password...
            HttpContext.Current.Application[IdpX509Certificate] = LoadCertificate(filename, idpCertName == "sp.pfx" ? "password" : null);
#else
            HttpContext.Current.Application[IdpX509Certificate] = LoadCertificate(filename, null);
#endif
        }

        public static void Login(String issuerUrl, String assertionConsumerServiceUrl, String redirectUrl, String rootUrl,
                    String idpSsoUrl, String spToIdpBinding, String idpToSpBinding, Boolean isSignAuthRequests)
        {
            var authnRequestXml = CreateAuthnRequest(issuerUrl, assertionConsumerServiceUrl, spToIdpBinding, idpToSpBinding, idpSsoUrl, isSignAuthRequests);
            var relayState = RelayStateCache.Add(new RelayState(redirectUrl, null));
            var idpUrl = String.Format("{0}?{1}={2}", idpSsoUrl, BindingQueryParameter, HttpUtility.UrlEncode(SpToIdpBinding(spToIdpBinding)));
            var response = HttpContext.Current.Response;

            switch (SpToIdpBinding(spToIdpBinding))
            {
                case SAMLIdentifiers.BindingURIs.HTTPRedirect:
                    {
                        var x509Certificate = (X509Certificate2)HttpContext.Current.Application[SpX509Certificate];
                        ServiceProvider.SendAuthnRequestByHTTPRedirect(response, idpUrl, authnRequestXml, relayState, x509Certificate.PrivateKey);
                    }
                    break;

                case SAMLIdentifiers.BindingURIs.HTTPPost:
                    ServiceProvider.SendAuthnRequestByHTTPPost(response, idpUrl, authnRequestXml, relayState);
                    response.End();
                    break;

                case SAMLIdentifiers.BindingURIs.HTTPArtifact:
                    var httpArtifact = new HTTPArtifactType4(HTTPArtifactType4.CreateSourceId(rootUrl), HTTPArtifactType4.CreateMessageHandle());

                    // Cache the authentication request for subsequent sending using the artifact resolution protocol.
                    var httpArtifactState = new HTTPArtifactState(authnRequestXml, null);
                    HTTPArtifactStateCache.Add(httpArtifact, httpArtifactState);

                    ServiceProvider.SendArtifactByHTTPArtifact(response, idpUrl, httpArtifact, relayState, false);
                    break;

                default:
                    throw new Exception(String.Format("Invalid SpToIdpBinding {0}", SpToIdpBinding(spToIdpBinding)));
            }
        }

        public static void ProcessLoginResponse(String rootUrl, Boolean useFederationId, Func<String, String> federationIdToUserNameResolver,
                    out String userName, out String requestedPageUrl, String idpArtifactResponderURL)
        {
            var samlResponse = default(SAMLResponse);
            var relayState = default(string);
            var isMessageSecure = false;

            ReceiveSamlResponse(rootUrl, out samlResponse, out relayState, out isMessageSecure, idpArtifactResponderURL);

            if (samlResponse.IsSuccess())
            {

                var samlAssertion = GetSAMLAssertion(samlResponse, isMessageSecure);
                var cachedRelayState = default(RelayState);

                userName = GetUserNameFromSamlAssertion(samlAssertion, federationIdToUserNameResolver);

                if (!String.IsNullOrEmpty(relayState))
                {
                    cachedRelayState = RelayStateCache.Remove(relayState);
                }

                requestedPageUrl = (cachedRelayState == null) ? String.Empty : cachedRelayState.ResourceURL;
            }
            else
            {
                var errorMessage = (samlResponse.Status.StatusMessage == null) ? String.Empty : samlResponse.Status.StatusMessage.Message;
                throw new SecurityException(String.Format("Error processing SAML response: {0}", errorMessage));
            }
        }

        public static string InitiateLogout(String issuerUrl, String logoutUrl, Boolean isSignAuthRequests, string userName)
        {
            var logoutRequest = new LogoutRequest
            {
                Issuer = new Issuer(issuerUrl),
                NameID = new NameID(userName),
                Destination = MxAppSettings.MobileIdpLogoutURL
            };

            var logoutRequestXml = logoutRequest.ToXml();

            SAMLMessageSignature.Generate(
                logoutRequestXml,
                ((X509Certificate2)HttpContext.Current.Application[SpX509Certificate]).PrivateKey,
                (X509Certificate2)HttpContext.Current.Application[SpX509Certificate],
                null,
                MxAppSettings.MobileIdpLogoutDigestMethod,
                MxAppSettings.MobileIdpLogoutSignatureMethod);

            var url = HTTPRedirectBinding.CreateRequestRedirectURL(MxAppSettings.MobileIdpLogoutURL, logoutRequestXml, null, null);
            SsoCookieHelper.ClearSsoCookie(Startup.SsoAuthCookieName);
            return url;
        }

        public static void ProcessLogoutResponse(String issuerUrl, Action<String> logoutRequestHandler, Action<String> logoutResponseHandler,
                    String redirectUrl)
        {
            var request = HttpContext.Current.Request;
            var messageType = request.QueryString[MessageTypeParameter];

            switch (messageType)
            {
                case LogoutRequestType:
                    {
                        var logoutResponse = new LogoutResponse
                        {
                            Issuer = new Issuer(issuerUrl)
                        };

                        SingleLogoutService.ReceiveLogoutRequestBySOAP(HttpContext.Current.Request);
                        SingleLogoutService.SendLogoutResponseBySOAP(HttpContext.Current.Response, logoutResponse.ToXml());

                        if (logoutRequestHandler != null)
                        {
                            logoutRequestHandler.Invoke(redirectUrl);
                        }
                    }
                    break;

                case LogoutResponseType:
                    {
                        var x509Certificate = (X509Certificate2)HttpContext.Current.Application[SpX509Certificate];
                        XmlElement logoutResponseXml;
                        string relayState;
                        bool signed;

                        SingleLogoutService.ReceiveLogoutResponseByHTTPRedirect(HttpContext.Current.Request, out logoutResponseXml, out relayState,
                                        out signed, x509Certificate.PublicKey.Key);

                        if (logoutResponseHandler != null)
                        {
                            logoutResponseHandler.Invoke(redirectUrl);
                        }
                    }
                    break;
            }
        }
        #endregion

        #region Private helpers
        private static X509Certificate2 LoadCertificate(String fileName, String password)
        {
            if (!File.Exists(fileName))
            {
                throw new ArgumentException(String.Format("The certificate file {0} cannot be opened.", fileName));
            }

            try
            {
                return new X509Certificate2(fileName, password, X509KeyStorageFlags.MachineKeySet);
            }
            catch (Exception e)
            {
                throw new ArgumentException(String.Format("The certificate file {0} could not be loaded - {1}", fileName, e.Message));
            }
        }

        private static String SpToIdpBinding(String spToIdpBinding)
        {
            switch (spToIdpBinding.ToLower())
            {
                case "redirect":
                    return HttpRedirect;

                case "post":
                    return HttpPost;

                case "artifact":
                    return HttpArtifact;

                default:
                    throw new Exception(String.Format("Invalid SpToIdpBinding {0}", spToIdpBinding));
            }
        }

        private static String IdToStpBinding(String idpToSpBinding)
        {
            switch (idpToSpBinding.ToLower())
            {
                case "post":
                    return HttpPost;

                case "artifact":
                    return HttpArtifact;

                default:
                    throw new Exception(String.Format("Invalid IdToStpBinding {0}", idpToSpBinding));
            }
        }

        private static XmlElement CreateAuthnRequest(String issuerUrl, String samlCallbackUrl, String spToIdpBinding, String idpToSpBinding,
                    String idpSsoUrl, Boolean isSignAuthRequests)
        {
            var assertionConsumerServiceUrl = String.Format("{0}?{1}={2}", samlCallbackUrl, BindingQueryParameter, HttpUtility.UrlEncode(IdToStpBinding(idpToSpBinding)));
            var authnRequest = new AuthnRequest();

            authnRequest.Destination = idpSsoUrl;
            authnRequest.Issuer = new Issuer(issuerUrl);
            authnRequest.ForceAuthn = false;
            authnRequest.NameIDPolicy = new NameIDPolicy(null, null, true);
            authnRequest.ProtocolBinding = IdToStpBinding(idpToSpBinding);
            authnRequest.AssertionConsumerServiceURL = assertionConsumerServiceUrl;

            var authnRequestXml = authnRequest.ToXml();

            if (SpToIdpBinding(spToIdpBinding) != SAMLIdentifiers.BindingURIs.HTTPRedirect && isSignAuthRequests)
            {
                var x509Certificate = (X509Certificate2)HttpContext.Current.Application[SpX509Certificate];
                SAMLMessageSignature.Generate(authnRequestXml, x509Certificate.PrivateKey, x509Certificate);
            }

            return authnRequestXml;
        }

        private static void ReceiveSamlResponse(String rootUrl, out SAMLResponse response, out String relayState, out bool isMessageSecure, String idpArtifactResponderURL)
        {
            var request = HttpContext.Current.Request;
            var bindingType = request.QueryString[BindingQueryParameter] ?? String.Empty;
            var samlResponseXml = default(XmlElement);

            switch (bindingType)
            {
                case SAMLIdentifiers.BindingURIs.HTTPPost:
                case "":
                    ServiceProvider.ReceiveSAMLResponseByHTTPPost(request, out samlResponseXml, out relayState);
                    break;

                case SAMLIdentifiers.BindingURIs.HTTPArtifact:
                    {
                        var httpArtifact = default(HTTPArtifact);

                        ServiceProvider.ReceiveArtifactByHTTPArtifact(request, false, out httpArtifact, out relayState);

                        // Create an artifact resolve request.
                        var artifactResolve = new ArtifactResolve
                        {
                            Issuer = new Issuer(rootUrl),
                            Artifact = new Artifact(httpArtifact.ToString())
                        };
                        var artifactResolveXml = artifactResolve.ToXml();

                        // Send the artifact resolve request and receive the artifact response.
                        var spArtifactResponderUrl = idpArtifactResponderURL;
                        var artifactResponseXml = ArtifactResolver.SendRequestReceiveResponse(spArtifactResponderUrl,
                                                                                              artifactResolveXml);
                        var artifactResponse = new ArtifactResponse(artifactResponseXml);

                        // Extract the SAML response from the artifact response.
                        samlResponseXml = artifactResponse.SAMLMessage;
                    }
                    break;

                default:
                    throw new SecurityException("Invalid identity provider to service provider binding");
            }

            var x509Certificate = (X509Certificate2)HttpContext.Current.Application[IdpX509Certificate];

            if (SAMLMessageSignature.IsSigned(samlResponseXml))
            {
                if (!SAMLMessageSignature.Verify(samlResponseXml, x509Certificate))
                {
                    throw new SecurityException("The SAML response signature failed to verify");
                }
                isMessageSecure = true;
            }
            else
            {
                isMessageSecure = false;
            }

            // Deserialize the XML.
            response = new SAMLResponse(samlResponseXml);
        }

        private static String GetUserNameFromSamlAssertion(SAMLAssertion samlAssertion, Func<String, String> federationIdToUserNameResolver)
        {
            if (federationIdToUserNameResolver != null)
            {
                var employeeNumber = samlAssertion.GetAttributeValue("FederationID");
                return federationIdToUserNameResolver(employeeNumber) ?? samlAssertion.Subject.NameID.NameIdentifier;
            }

            return samlAssertion.Subject.NameID.NameIdentifier;
        }

        private static SAMLAssertion GetSAMLAssertion(SAMLResponse samlResponse, bool isMessageSecure)
        {
            var samlAssertion = default(SAMLAssertion);

            var encryptedAssertion = samlResponse.GetEncryptedAssertions().FirstOrDefault();
            if (encryptedAssertion != null)
            {
                var x509Certificate = (X509Certificate2)HttpContext.Current.Application[SpX509Certificate];
                samlAssertion = encryptedAssertion.Decrypt(x509Certificate, null);
            }
            else
            {
                var signedAssertion = samlResponse.GetSignedAssertions().FirstOrDefault();
                if (signedAssertion != null)
                {
                    var x509Certificate = (X509Certificate2)HttpContext.Current.Application[IdpX509Certificate];

                    if (!SAMLAssertionSignature.Verify(signedAssertion, x509Certificate))
                    {
                        throw new SecurityException("The SAML assertion signature failed to verify");
                    }
                    samlAssertion = new SAMLAssertion(signedAssertion);
                }
                else
                {
                    if (!isMessageSecure)
                    {
                        throw new SecurityException("The SAML response is not secure");
                    }
                    else
                    {
                        if (samlResponse.Assertions.Count > 0)
                        {
                            samlAssertion = (SAMLAssertion) samlResponse.Assertions[0];
                        }
                        if (samlAssertion == null)
                        {
                            throw new SecurityException("The SAML response does not contain an assertion");
                        }
                    }
                }
            }
            return samlAssertion;

        }


        #endregion
    }
}