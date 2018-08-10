using AutoMapper;
using Mx.Administration.Services.Contracts.Responses;
using Mx.Web.UI.Config.T4;
using Mx.Services.Shared;

namespace Mx.Web.UI.Areas.Core.Api.Models
{
    [MapToTypeScript]
    public class JsTreeNode : IConfigureAutoMapping
    {
        public string id { get; set; }
        public string text { get; set; }
        public string parent { get; set; }
        public object data { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<EntityResponse, JsTreeNode>()
                .ForMember(x => x.id, y => y.MapFrom(z => z.Id))
                .ForMember(x => x.text, y => y.MapFrom(z => z.Name))
                .ForMember(x => x.parent, y => y.MapFrom(z => z.ParentId))
                .ForMember(x => x.data, y => y.MapFrom(z => z.TypeId));
        }
    }
}