using System;
using Mx.Web.UI.Areas.Core.Api.Models;

namespace Mx.Web.UI.Areas.Core.Auth.Api.Models
{
    public class LogonResponse
    {
        public BusinessUser User { get; set; }
        public String AuthToken { get; set; }
        public bool IsSharedCookieUsed { get; set; }
    }
}