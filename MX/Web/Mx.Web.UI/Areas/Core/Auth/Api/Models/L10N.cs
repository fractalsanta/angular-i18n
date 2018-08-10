using Mx.Web.UI.Config.Translations;

namespace Mx.Web.UI.Areas.Core.Auth.Api.Models
{
    [Translation("Authentication")]
    public class L10N
    {
        public virtual string Login { get { return "Login"; } }
        public virtual string Username { get { return "Username"; } }
        public virtual string Password { get { return "Password"; } }
        public virtual string AccessDenied { get { return "Access Denied"; } }
        public virtual string YouDontHaveAccess { get { return "Sorry, you don't have access to the feature or page you have requested."; } }
        public virtual string PleaseContactYourAdmin { get { return "Please contact your system administrator."; } }
        public virtual string ResourceNotFound { get { return "Resource Not Found"; } }
        public virtual string PageUnavailableWhileOffline { get { return "Page Unavailable While Offline"; } }
        public virtual string ResourceUnavailable { get { return "Sorry, the resource you have requested is unavailable."; } }
        public virtual string InvalidCredentials { get { return "Your username or password is incorrect"; } }
        public virtual string PasswordExpired { get { return "Your password has expired. Please contact an administrator to re-enable the account."; } }
        public virtual string AccountDisabled { get { return "Your account has been disabled due to too many invalid login attempts. Please contact an administrator to re-enable your account."; } }
        public virtual string AccountDisabledPleaseWait { get { return "Your account has been disabled due to too many invalid login attempts. Please wait {0} minutes and try again or contact an administrator to re-enable your account."; } }
        public virtual string ServerUnavailable { get { return "Server unavailable"; } }
        public virtual string SignIn { get { return "Sign in"; } }
        public virtual string LogOut { get { return "Log out"; } }
        public virtual string Lock { get { return "Lock"; } }
        public virtual string WelcomeBack { get { return "Welcome back"; } }
        public virtual string NotYou { get { return "Not You"; } }
        public virtual string InvalidPin { get { return "Your pin is incorrect"; } }
        public virtual string LogoutFromMMS { get { return "Please log out from MMS"; } }
    }
}