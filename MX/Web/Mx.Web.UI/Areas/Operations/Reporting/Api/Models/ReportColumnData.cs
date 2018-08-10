using System.Collections.Generic;
using AutoMapper;
using Mx.OperationalReporting.Services.Contracts.ColumnQueries;
using Mx.Services.Shared;

namespace Mx.Web.UI.Areas.Operations.Reporting.Api.Models
{
    public class ReportColumnData : IConfigureAutoMapping
    {
        public IEnumerable<object> Values { get; set; }
        public object Summary { get; set; }
        public bool IsSortable { get; set; }
        public short ColumnId { get; set; }
        public string ColumnLocalisationKey { get; set; }
        public ReportColumnValueType ColumnValueType { get; set; }

        public static void ConfigureAutoMapping()
        {
            Mapper.CreateMap<ColumnData, ReportColumnData>()
                .ForMember(x => x.Values, opt => opt.Ignore())
                .ForMember(x => x.ColumnId, opt => opt.MapFrom(x => (short)x.ColumnId));
        }
    }
}