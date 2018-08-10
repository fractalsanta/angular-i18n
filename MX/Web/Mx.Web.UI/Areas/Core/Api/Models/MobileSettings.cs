using System;
using System.Collections.Generic;
using AutoMapper;
using Mx.Foundation.Services.Contracts.Requests;
using Mx.Foundation.Services.Contracts.Responses;
using Mx.Services.Shared;

namespace Mx.Web.UI.Areas.Core.Api.Models
{
    public class MobileSettings : IConfigureAutoMapping
    {
        public Int64 EntityId { get; set; }
        public String EntityName { get; set; }
        public String EntityNumber { get; set; }
        public IEnumerable<Int64> FavouriteStores { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<UserResponse.MobileSettingsResponse, MobileSettings>();
            Mapper.CreateMap<MobileSettings, MobileSettingsRequest>();
        }
    }
}