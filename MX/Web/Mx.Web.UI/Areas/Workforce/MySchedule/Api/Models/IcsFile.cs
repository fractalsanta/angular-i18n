using System.Collections.Generic;

namespace Mx.Web.UI.Areas.Workforce.MySchedule.Api.Models
{
    public class IcsFile
    {
        public string Begin { get; set; }
        public string End { get; set; }
        public string ProdId { get; set; }
        public string Version { get; set; }
        public string CalScale { get; set; }
        public string Method { get; set; }

        private readonly ICollection<IcsEvent> _events = new List<IcsEvent>();
        public ICollection<IcsEvent> Events
        {
            get { return _events; } 
        }
    }
}