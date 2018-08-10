using System;
using AutoMapper;
using Mx.Administration.Services.Contracts.Responses;
using Mx.Reporting.Services.Contracts.Responses;
using Mx.Services.Shared;
using Mx.Web.UI.Config.Mapping;

namespace Mx.Web.UI.Areas.Administration.Settings.Api.Models
{
    [MapFrom(typeof(ReportMeasureConfigResponse))]
    public class SettingMeasure : IConfigureAutoMapping
    {
        public String MeasureKey { get; set; }
        public Int64 EntityId { get; set; }
        public Boolean Enabled { get; set; }
        public Decimal ToleranceMin { get; set; }
        public Decimal ToleranceMax { get; set; }
        public Boolean Visible { get; set; }
        public String DisplayName { get; set; }
        public String ToleranceFormat { get; set; }
        public String Group { get; set; }
        public String GroupHeading { get; set; }
        public Boolean ToleranceReadOnly { get; set; }
        public SettingEnums SettingType { get; set; }
        public SettingToleranceFormatEnums ToleranceFormatEnum { get; set; }
        public string ToleranceSymbol { get; set; }
        public decimal EditableToleranceMin { get; set; }
        public decimal EditableToleranceMax { get; set; }
        
    }
}