using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Mx.Administration.Services.Contracts.Responses;
using Mx.Web.UI.Config.Converters;
using Mx.Web.UI.Config.Mapping;
using Newtonsoft.Json;

namespace Mx.Web.UI.Areas.Core.Api.Models
{
    [MapFrom(typeof(EntityResponse))]
    public class EntityModel
    {
        public Int64 Id { get; set; }
        public String Name { get; set; }
        public String Number { get; set; }
        public String Status { get; set; }
        public Int64 ParentId { get; set; }
        public Int64 TypeId { get; set; }
        public String CultureName { get; set; }

        public DateTime CurrentStoreTime { get; set; }
        [JsonConverter(typeof(DateNoTimezoneConverter))]
        public DateTime CurrentBusinessDay { get; set; }
    }
}