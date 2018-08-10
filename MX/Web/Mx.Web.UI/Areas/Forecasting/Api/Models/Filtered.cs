using System;

namespace Mx.Web.UI.Areas.Forecasting.Api.Models
{
    public class Filtered<T>
    {
        public Int32? FilterId { get; set; }
        public T Data { get; set; }
    }
}
