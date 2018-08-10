using System;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Web.UI.Areas.Inventory.Transfer.Api.Enums;
using Mx.Web.UI.Config.Mapping;

namespace Mx.Web.UI.Areas.Inventory.Transfer.Api.Models
{
    [MapFrom(typeof(TransferHeaderWithEntitiesResponse))]
    public class TransferHeaderWithEntities
    {
        public Int64 Id { get; set; }
        public Int64 TransferToEntityId { get; set; }
        public Int64 TransferFromEntityId { get; set; }
        public DateTime CreateDate { get; set; }
        public String InitiatedBy { get; set; }
        public Single TransferQty { get; set; }
        public String TransferStatus { get; set; }
        public String ToEntityName { get; set; }
        public String FromEntityName { get; set; }
    }
}