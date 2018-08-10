using System.Collections.Generic;
using Mx.Web.UI.Areas.Core.Api.Models;

namespace Mx.Web.UI.Areas.Core.Api.Services
{
    public interface INotificationAreaService
    {
        IEnumerable<NotificationArea> GetNotificationAreas();
    }
}
