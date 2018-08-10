using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MMS.Utilities;

namespace Mx.Web.UI.Areas.Administration.Settings.Api.Models
{
    public enum SettingEnums
    {
        Application = 0,
        Global = 1,
        Store = 2
    }

    public enum SettingToleranceFormatEnums
    {
        [EnumDescription("c0")] Currency = 0,
        [EnumDescription("p")] Percentage = 1,
        [EnumDescription("n0")] Number = 2
    }
}