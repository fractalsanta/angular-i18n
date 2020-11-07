using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Rockend.iStrata.StrataWebsite.Helpers;

namespace Rockend.iStrata.StrataWebsite.Model
{
    public class MessageModel
    {
        public MessageModel(string title, string message, string returnUrl)
        {
            Title = HttpUtility.HtmlEncode(title);
            Message = message;
            ReturnUrl = returnUrl;
        }

        public string Title { get; private set; }
        public string Message { get; private set; }
        public string ReturnUrl { get; private set; }
    }
}
