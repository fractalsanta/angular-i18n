using System;

using AutoMapper;
using Mx.Inventory.Services.Contracts.Requests;
using Mx.Services.Shared;
using Mx.Web.UI.Config.Mapping;

namespace Mx.Web.UI.Areas.Inventory.Transfer.Api.Models
{
    [MapFrom(typeof(GetTransferableItemsBetweenStoresRequest))]
    public class CreateInventoryTransferItem : IConfigureAutoMapping
    {

        public Int64 ItemId { get; set; }
        public Single TransferQty { get; set; }
        public Decimal TransferCost { get; set; }
        public String TransferUnit1 { get; set; }
        public String TransferUnit2 { get; set; }
        public String TransferUnit3 { get; set; }
        public String TransferUnit4 { get; set; }
        public Single TransferQty1 { get; set; }
        public Single TransferQty2 { get; set; }
        public Single TransferQty3 { get; set; }
        public Single TransferQty4 { get; set; }
        public Decimal TransferUnitCost { get; set; }
        public String Code { get; set; }
        public String Description { get; set; }
        public Int64 VendorId { get; set; }

    }
}