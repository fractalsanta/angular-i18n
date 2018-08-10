using Mx.Web.UI.Config.T4;

namespace Mx.Web.UI.Config.WebApi
{
    [MapToTypeScript]
    public class ErrorMessage
    {
        public string Message { get; set; }

        public ErrorMessage(string message)
        {
            Message = message;
        }
    }
}