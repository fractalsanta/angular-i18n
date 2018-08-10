using System;
using System.Collections.Generic;
using Mx.Web.UI.Areas.Workforce.MySchedule.Api.Models;

namespace Mx.Web.UI.Areas.Workforce.MySchedule.Api.Services
{
    public interface IIcsGenerationService
    {
        IcsFile GetNewFile(string name);
        IcsEvent GetNewEvent(string name, string description, DateTime startTime, DateTime endTime, string uid = "");
        void AddEventToIcsFile(ref IcsFile file, IcsEvent @event);
        string SerialiseIcsFile(IcsFile file);
        string SerialiseIcsEvent(IcsEvent @event);
    }
}
