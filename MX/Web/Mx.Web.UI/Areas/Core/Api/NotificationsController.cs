using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;

namespace Mx.Web.UI.Areas.Core.Api
{
    public class NotificationsController : ApiController
    {
        private readonly IEnumerable<INotificationAreaService> _notificationAreaServices;

        public NotificationsController(IEnumerable<INotificationAreaService> notificationAreaServices)
        {
            _notificationAreaServices = notificationAreaServices;
        }

        public IEnumerable<NotificationArea> Get()
        {
            return _notificationAreaServices.SelectMany(s => s.GetNotificationAreas()).ToList();        
        }
    }
}