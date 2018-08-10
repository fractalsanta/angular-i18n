using System;
using AutoMapper;
using Mx.Forecasting.Services.Contracts.Requests;
using Mx.Forecasting.Services.Contracts.Responses;
using Mx.Services.Shared;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    public class Entity : IConfigureAutoMapping
    {
        public Int64 EntityId { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<Entity, EntityRequest>()
                .ForMember(x => x.Id, y => y.MapFrom(z => z.EntityId));
            Mapper.CreateMap<EntityResponse, Entity>()
                .ForMember(x => x.EntityId, y => y.MapFrom(z => z.Id));
        }
    }
}