using Mx.Forecasting.Services.Contracts;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Web.UI.Config.Mapping;
using System;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    [MapFrom(typeof(EventProfileHistoryResponse))]
    public class EventProfileHistory
    {
        public Int64 EventProfileId { get; set; }
        public DateTime Date { get; set; }
        public String Note { get; set; }
    }
}