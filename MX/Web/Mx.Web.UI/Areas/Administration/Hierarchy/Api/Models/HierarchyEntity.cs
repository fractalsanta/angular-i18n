using System;
using System.Collections.Generic;
using Mx.Web.UI.Config.Mapping;
using Mx.Administration.Services.Contracts.Responses;

namespace Mx.Web.UI.Areas.Administration.Hierarchy.Api.Models
{
    [MapFrom(typeof(HierarchyEntityResponse))]
    public class HierarchyEntity
    {
        public Int64 Id { get; set; }
        public String Name { get; set; }
        public String Number { get; set; }
        public String Status { get; set; }
        public Int32 Type { get; set; }

        public List<HierarchyEntity> Children { get; set; }
    }
}