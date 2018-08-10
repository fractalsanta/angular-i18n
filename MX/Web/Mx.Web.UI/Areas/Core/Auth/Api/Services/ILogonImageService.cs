using System;
using System.Collections.Generic;
using Mx.Web.UI.Areas.Workforce.MySchedule.Api.Models;

namespace Mx.Web.UI.Areas.Workforce.MySchedule.Api.Services
{
    public interface ILogonImageService
    {
        byte[] GetLogonImageByKey(string key);
    }
}
