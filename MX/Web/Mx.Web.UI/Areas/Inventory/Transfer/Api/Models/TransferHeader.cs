using System;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Web.UI.Areas.Inventory.Transfer.Api.Enums;
using Mx.Web.UI.Config.Mapping;

namespace Mx.Web.UI.Areas.Inventory.Transfer.Api.Models
{
    [MapFrom(typeof(TransferHeaderResponse))]
    public class TransferHeader
    {
        public Int64 Id { get; set; }
        public Int64 TransferToEntityId { get; set; }
        public Int64 TransferFromEntityId { get; set; }
        public DateTime CreateDate { get; set; }
        public String InitiatedBy { get; set; }
        public Single TransferQty { get; set; }
        public String Status { get; set; }
        public TransferDirection Direction { get; set; }
    }
}