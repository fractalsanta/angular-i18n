using System;
using AutoMapper;
using Mx.Services.Shared;
using Mx.Labor.Services.Contracts.Responses;

namespace Mx.Web.UI.Areas.Workforce.MySchedule.Api.Models
{
    public class TimeOffRequest : IConfigureAutoMapping
    {
        public Int64 EntityId { get; set; }
        public string EntityName { get; set; }
        public Int32 RequestId { get; set; }
        public Int32 ReasonId { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
        public DateTime SubmitDateTime { get; set; }
        public TimeOffRequestStatus Status { get; set; }
        public string Comments { get; set; }
        public Int64? ManagerActionUserId { get; set; }
        public string ManagerActionUserFirstName { get; set; }
        public string ManagerActionUserLastName { get; set; }
        public DateTime? ManagerActionDateTime { get; set; }
        public string ManagerActionComment { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<TimeOffRequest, TimeOffResponse>();

            Mapper.CreateMap<TimeOffResponse, TimeOffRequest>();
        }
    }

    public enum TimeOffRequestStatus
    {
        Requested = 0,
        Approved = 1,
        Declined = 2,
        Cancelled = 3
    }
}