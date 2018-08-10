using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Mx.Administration.Services.Contracts.Responses;
using Mx.Web.UI.Config.Mapping;

namespace Mx.Web.UI.Areas.Core.Api.Models
{
    [MapFrom(typeof(ZoneResponse))]
    public class Zone
    {
        public int ZoneId { get; set; }
        public string ZoneName { get; set; }
    }
}