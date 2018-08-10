using System;
using System.Collections.Generic;

namespace Mx.Web.UI.Areas.Core.Api.Models
{
    public class NotificationArea
    {
        public String Name { get; set; }
        public IEnumerable<Notification> Notifications { get; set; }
    }
}
