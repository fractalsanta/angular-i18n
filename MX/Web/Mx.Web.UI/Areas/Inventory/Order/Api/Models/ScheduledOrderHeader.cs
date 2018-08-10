using System;
using AutoMapper;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Services.Shared;
using System.ComponentModel;

namespace Mx.Web.UI.Areas.Inventory.Order.Api.Models
{
    public class ScheduledOrderHeader : IConfigureAutoMapping
    {
        public String Supplier { get; set; }
        public Int32 VendorId { get; set; }
        public DateTime DeliveryDate { get; set; }
        public DateTime? CutoffTime { get; set; }
        public Int64 TransactionSupplyOrderId { get; set; }
        public Int64 TransactionSalesOrderId { get; set; }
        public String Status { get; set; }
        public String AuthorizedTime { get; set; }
        public Int64 ActionItemInstanceId { get; set; }
        public Int32 ActionItemId { get; set; }
        public DateTime ActionItemDate { get; set; }
        public Boolean IsSkipped { get; set; }

        public String ActionItemDateDisplay
        {
            get { return ActionItemDate.ToString(); }
        }

        public DateTime? CutoffTimeDisplay
        {
            get
            {
                DateTime? result = new DateTime();
                if (CutoffTime != null)
                {
                    result = ((DateTime)CutoffTime);
                }
                return result;
            }
        }

        public Int32 CutoffMinutesRemaining
        {
            get
            {
                var result = 0;
                if (CutoffTime != null)
                {
                    var diff = ((DateTime)CutoffTime).Subtract(DateTime.Now);
                    result = (Int32)diff.TotalMinutes;
                }
                return result;
            }
        }

        public enum StatusTypeForDisplay
        {
            [Description("Pending")]
            Pending = 0,
            [Description("Overdue")]
            Overdue = 1,
            [Description("InProgress")]
            InProgress = 2,
            [Description("Cancelled")]
            Cancelled = 3,
            [Description("Placed")]
            Placed = 4,
            [Description("Received")]
            Received = 5
        }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<ScheduledOrderResponse, ScheduledOrderHeader>()
                .ForMember(x => x.AuthorizedTime, opt => opt.MapFrom(src => src.AuthorizedTimeDisplay))
                .ForMember(x => x.Status, opt => opt.MapFrom(src => (src.IsSkipped == true ? Enum.GetName(typeof(StatusTypeForDisplay), 3) : (Enum.GetName(typeof(StatusTypeForDisplay), src.Status)))));
        }
    }
}
