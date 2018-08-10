using System;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Web.UI.Config.Mapping;

namespace Mx.Web.UI.Areas.Inventory.Order.Api.Models
{
    [MapFrom(typeof(VendorResponse))]
    public class Vendor
    {
        public Int64 Id { get; set; }
        public String Name { get; set; }
    }
}