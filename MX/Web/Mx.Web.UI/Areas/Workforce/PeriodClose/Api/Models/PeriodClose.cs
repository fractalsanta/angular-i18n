using AutoMapper;
using Mx.Labor.Services.Contracts.Responses;
using Mx.Services.Shared;
using System;

namespace Mx.Web.UI.Areas.Workforce.PeriodClose.Api.Models
{
    public class PeriodClose : IConfigureAutoMapping
    {
        public DateTime PeriodStartDate { get; set; }
        public DateTime PeriodEndDate { get; set; }
        public bool IsClosed { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<PeriodCloseResponse, PeriodClose>();
        }
    }
}