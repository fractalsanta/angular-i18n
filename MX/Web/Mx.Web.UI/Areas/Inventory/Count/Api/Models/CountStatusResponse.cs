using Mx.Web.UI.Config.Mapping;

namespace Mx.Web.UI.Areas.Inventory.Count.Api.Models
{
    [MapFrom(typeof(Mx.Inventory.Services.Contracts.Responses.CountStatusResponse))]
    public class CountStatusResponse
    {
        public CountType CountOf { get; set; }
        public bool IsActive { get; set; }
    }
}