using System;
using AutoMapper;
using Mx.Administration.Services.Contracts.Responses;
using Mx.Reporting.Services.Contracts.Responses;
using Mx.Services.Shared;
using Mx.Web.UI.Config.Mapping;

namespace Mx.Web.UI.Areas.Administration.Settings.Api.Models
{
    public class SiteSettings
    {
        public Int16 LoginColorScheme { get; set; }
    }
}