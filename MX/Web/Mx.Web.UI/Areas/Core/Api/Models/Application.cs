using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Mx.Web.UI.Areas.Core.Api.Models
{
    public class Application
    {
        public string Welcome { get; set; }

        public Application()
        {
            Welcome = "Home Page (TODO: Add MX background svg here)";
        }
    }
}