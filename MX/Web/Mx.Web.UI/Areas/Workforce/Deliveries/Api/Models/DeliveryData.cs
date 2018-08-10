using System;
using System.Collections.Generic;
using Mx.Web.UI.Config.Converters;
using Newtonsoft.Json;

namespace Mx.Web.UI.Areas.Workforce.Deliveries.Api.Models
{
    public class DeliveryData
    {
        [JsonConverter(typeof(DateTimeConverter))]
        public DateTime SelectedDate { get; set; }
        [JsonConverter(typeof(DateTimeConverter))]
        public DateTime MaxDate { get; set; }
        public int TotalDeliveriesQty { get; set; }
        public int DeliveriesQty { get; set; }
        public int ExtraDeliveriesQty { get; set; }
        public IEnumerable<ExtraDeliveryRequest> ExtraDeliveryRequests { get; set; }
    }
}