using System;
using System.Collections.Generic;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Web.UI.Config.Mapping;
using Mx.Web.UI.Config.Converters;
using Newtonsoft.Json;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    [MapFrom(typeof(FutureOrderResponse))]
    public class FutureOrder
    {
        public Int64 Id { get; set; }
        public Int64 PosTransactionId { get; set; }
        public Int64 EntityId { get; set; }

        [JsonConverter(typeof(DateTimeConverter))]
        public DateTime PromisedDateTime { get; set; }
        public Decimal TotalTransactionAmount { get; set; }
        public Int32 Status { get; set; }
        public Int32 ServiceType { get; set; }
        public String CustomerName { get; set; }
        public IList<FutureOrderDetail> FutureOrderDetailsList { get; set; }
    }
}