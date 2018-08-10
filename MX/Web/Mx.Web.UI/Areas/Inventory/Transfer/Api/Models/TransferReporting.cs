using System;
using System.Collections.Generic;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Web.UI.Config.Mapping;

namespace Mx.Web.UI.Areas.Inventory.Transfer.Api.Models
{
    [MapFrom(typeof(TransferReportingResponse))]
    public class TransferReporting
    {
        public Int64 Id { get; set; }
        public DateTime CreateDate { get; set; }
        public String InitiatedBy { get; set; }
        public Int64 RequestingEntityId { get; set; }
        public Int64 SendingEntityId { get; set; }
        public String Status { get; set; }
        public String Comment { get; set; }

        public IEnumerable<TransferDetailReporting> Details { get; set; }
    }
}