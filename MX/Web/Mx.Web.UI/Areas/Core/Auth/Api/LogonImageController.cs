using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;
using Mx.Web.UI.Areas.Workforce.MySchedule.Api.Services;


namespace Mx.Web.UI.Areas.Core.Auth.Api
{
    [AllowAnonymous]
    public class LogonImageController : ApiController
    {
        private readonly ILogonImageService _logonImageService;

        public LogonImageController(ILogonImageService logonImageService)
        {
            _logonImageService = logonImageService;
        }

        [HttpGet]
        public HttpResponseMessage Get([FromUri] string key)
        {
            HttpResponseMessage result;

            var binImage = _logonImageService.GetLogonImageByKey(key);

            if (binImage != null)
            {
                result = new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new ByteArrayContent(binImage)
                };

                result.Content.Headers.ContentType = new MediaTypeHeaderValue("image/jpeg");
            }
            else
            {
                result = new HttpResponseMessage(HttpStatusCode.NotFound);
            }

            return result;
        }
    }
}