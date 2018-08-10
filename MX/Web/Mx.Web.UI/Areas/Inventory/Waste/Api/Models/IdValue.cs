using System;
using AutoMapper;
using Mx.Foundation.Services.Contracts.Responses;
using Mx.Services.Shared;

namespace Mx.Web.UI.Areas.Inventory.Waste.Api.Models
{
    public class DropKeyValuePair : IConfigureAutoMapping
    {
        public Int32 Id { get; set; }
        public String Text { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<DropDownListItemResponse, DropKeyValuePair>()
                .ForMember(x => x.Id, opt => opt.MapFrom(y => y.DropDownListId))
                .ForMember(x => x.Text, opt => opt.MapFrom(y => y.ListItem));
        }
    }
}