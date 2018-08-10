using System;
using AutoMapper;
using Mx.Deliveries.Services.Contracts.Requests;
using Mx.Deliveries.Services.Contracts.Responses;
using Mx.Services.Shared;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Workforce.Deliveries.Api.Models.Enums;
using Mx.Web.UI.Config.Converters;
using Newtonsoft.Json;

namespace Mx.Web.UI.Areas.Workforce.Deliveries.Api.Models
{
    public class ExtraDeliveryRequest : IConfigureAutoMapping
    {
        public Int64 Id { get; set; }
        public Int64 EntityId { get; set; }
        public ExtraDeliveryOrderStatus Status { get; set; }
        public string Comment { get; set; }
        public string DenyReason { get; set; }
        public string OrderNumber { get; set; }
        public Int64? AuthorisedByUserId { get; set; }
        public string AuthorisedByUserName { get; set; }
        public int? TransactionDriverDispatchId { get; set; }
        public Int64? TransactionSummaryId { get; set; }

        [JsonConverter(typeof(DateNoTimezoneConverter))]
        public DateTime? PromiseTime { get; set; }

        [JsonConverter(typeof(DateNoTimezoneConverter))]
        public DateTime? DeliveryTime { get; set; }
        public DateTime BusinessDay { get; set; }
        public byte? DeliverySequence { get; set; }
        public decimal? DeliveryDuration { get; set; }
        public Int64? SourceId { get; set; }
        public TransactionDeliveryType DeliveryType { get; set; }
        public string DeliveryLocation { get; set; }
        public SupervisorAuthorization Authorization { get; set; }
        public Int64? EmployeeId { get; set; }
        public ClockedOnUser User { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<TransactionDeliveryResponse, ExtraDeliveryRequest>();
            Mapper.CreateMap<ExtraDeliveryRequest, TransactionDeliveryRequest>()
                .ForMember(request => request.EmployeeId, map => map.MapFrom(x => x.User.EmployeeId));
        }
    }
}