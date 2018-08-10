using System;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Web.UI.Config.Mapping;
using Mx.Services.Shared;

namespace Mx.Web.UI.Areas.Inventory.Order.Api.Models
{
    [MapFrom(typeof(OrderItemHistoryResponse))]
    public class OrderItemHistoryHeader
    {
        public Int64 Id { get; set; }
        public Double OrderedQuantity { get; set; }
        public String OrderedUnit { get; set; }
        public DateTime? DateOrdered { get; set; }
        public String DateOrderedString { get; set; }
    }
}