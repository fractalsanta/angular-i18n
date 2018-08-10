using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Mx.Administration.Services.Contracts.Responses;
using Mx.Reporting.Services.Contracts.Responses;
using Mx.Web.UI.Config.Mapping;

namespace Mx.Web.UI.Areas.Administration.Settings.Api.Models
{
    public class SettingGroup
    {
        public long GroupId { get; set; }
        public String Group { get; set; }
        public SettingMeasure[] Measures { get; set; }
    }
}