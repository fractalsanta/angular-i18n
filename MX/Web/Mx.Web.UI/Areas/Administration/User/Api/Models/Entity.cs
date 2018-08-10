using System;
using Mx.Web.UI.Config.Mapping;
using Mx.Administration.Services.Contracts.Responses;

namespace Mx.Web.UI.Areas.Administration.User.Api.Models
{
    [MapFrom(typeof(EntityResponse))]
    public class Entity
    {
        public Int64 Id { get; set; }
        public String Name { get; set; }
        public String Number { get; set; }
    }
}