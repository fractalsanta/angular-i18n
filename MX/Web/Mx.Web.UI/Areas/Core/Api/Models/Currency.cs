using Mx.Administration.Services.Contracts.Responses;
using Mx.Web.UI.Config.Mapping;
using Mx.Web.UI.Config.T4;

namespace Mx.Web.UI.Areas.Core.Api.Models
{
    [MapToTypeScript]
    [MapFrom(typeof(CurrencyResponse))]
    public class Currency
    {
        public virtual long CurrencyId { get; set; }
        public virtual string CurrencyCode { get; set; }
        public virtual string Title { get; set; }
        public virtual double ConversionRate { get; set; }
        public virtual double ReportingRate { get; set; }
        public virtual string Symbol { get; set; }
        public virtual string DenominatonCode { get; set; }
        public virtual string Format { get; set; }
        public virtual string DecimalSep { get; set; }
        public virtual string ThousandsSep { get; set; }
        public virtual string DenominationSet { get; set; }
        public virtual string MinorSymbol { get; set; }
        public virtual string MerchantCurrencyCode { get; set; }
    }
}