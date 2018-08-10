using System;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Workforce.DriverDistance.Api.Models.Enums;

namespace Mx.Web.UI.Areas.Workforce.DriverDistance.Api.Models
{
    public class ActionDriverDistanceRequest
    {
        public Int64 DriverDistanceId { get; set; }
        public SupervisorAuthorization Authorization { get; set; }
        public DriverDistanceStatus Status { get; set; }
    }
}