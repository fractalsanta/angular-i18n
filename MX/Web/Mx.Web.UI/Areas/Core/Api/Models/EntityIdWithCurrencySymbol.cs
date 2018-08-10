using AutoMapper;
using Mx.Administration.Services.Contracts.Responses;
using Mx.Services.Shared;
using Mx.Web.UI.Config.T4;

namespace Mx.Web.UI.Areas.Core.Api.Models
{
    [MapToTypeScript]    
    public class EntityIdWithCurrencySymbol : IConfigureAutoMapping
    {
        public long EntityId { get; set; }
        public long CurrencyId { get; set; }
        public string CurrencySymbol { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<EntityResponse, EntityIdWithCurrencySymbol>()
                .ForMember(x => x.EntityId, y=> y.MapFrom(z=>z.Id))
                .ForMember(x => x.CurrencySymbol, y => y.MapFrom(z => z.Currency.Symbol));
        }
    }
}