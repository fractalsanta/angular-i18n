using System;

namespace Mx.Web.UI.Areas.Workforce.MySchedule.Api.Models
{
    public class IcsEvent
    {
        public string EventName { get; set; }
        public string EventDescription { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Begin { get; set; }
        public string End { get; set; }
        public string DtStart { get; set; }
        public string DtEnd { get; set; }
        public string DtStamp { get; set; }
        public string Uid { get; set; }
        public string Created { get; set; }
        public string Description { get; set; }
        public string LastModified { get; set; }
        public string Sequence { get; set; }
        public string Status { get; set; }
        public string Summary { get; set; }
        public string Transp { get; set; }
    }
}