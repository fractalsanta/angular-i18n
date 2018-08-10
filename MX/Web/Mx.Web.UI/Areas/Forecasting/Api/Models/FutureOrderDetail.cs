using System;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Web.UI.Config.Mapping;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
     [MapFrom(typeof(FutureOrderDetailResponse))]
    public class FutureOrderDetail
    {
        public Int64 Id { get; set; }
        public Int64 FutureOrderId { get; set; }
        public Int64 SalesItemId { get; set; }
        public Single Quantity { get; set; }
        public Decimal TotalPrice { get; set; }
        public String Description { get; set; }
    }
}