using System;
using System.Collections.Generic;
using System.Globalization;
using AutoMapper;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Services.Shared;

namespace Mx.Web.UI.Areas.Inventory.Count.Api.Models
{
    public class CountReviewViewModel : IConfigureAutoMapping
    {
        public double EntityTimeOffset { get; set; }
        public string ActivitySinceDate { get; set; }
        public Decimal TotalCounted { get; set; }
        public Decimal TotalPercent { get; set; }

        public IEnumerable<CountReviewGroupViewModel> Groups { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<CountReviewResponse, CountReviewViewModel>()
            .ForMember(x => x.ActivitySinceDate, y => y.MapFrom(z =>
                (z.ActivitySinceDate.HasValue) ? z.ActivitySinceDate.Value.ToString(CultureInfo.InvariantCulture) : String.Empty));
        }
    }
}