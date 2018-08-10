using System;
using AutoMapper;
using Mx.Inventory.Services.Contracts.Requests;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Services.Shared;
using Mx.Web.UI.Config.Mapping;

namespace Mx.Web.UI.Areas.Inventory.Order.Api.Models
{
    [MapFrom(typeof(DeliveryDetailResponse))]
    public class ReceiveOrderDetail : IConfigureAutoMapping
    {
        public long Id { get; set; }
        public long ItemId { get; set; }
        public string ItemCode { get; set; }
        public string Description { get; set; }
        public string Unit { get; set; }
        public Decimal Price { get; set; }
        public Decimal OrderedQuantity { get; set; }
        public Decimal ReceivedQuantity { get; set; }
        public Decimal ReturnedQuantity { get; set; }
        public Decimal BackOrderedQuantity { get; set; }
        public Decimal VendorShippedQuantity { get; set; }
        public Int64? CategoryId { get; set; }
        public String CategoryName { get; set; }

        private Boolean AddedItemIsReceived {
            get { return ReceivedQuantity > 0 || ReturnedQuantity > 0; }
        }

        public Boolean Received
        {
            get
            {
                if (OrderedQuantity == 0)
                    return AddedItemIsReceived;

                return BackOrderedQuantity <= 0;
            }
        }

        public Boolean IsReadyToBeReceived
        {
            get { return Received; }
        }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<ReceiveOrderDetail, DeliveryReceiveDetailRequest>();
        }
    }   
}