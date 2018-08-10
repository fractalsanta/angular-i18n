using System;
using Mx.Inventory.Services.Contracts.Responses;
using Mx.Web.UI.Config.Converters;
using Mx.Web.UI.Config.Mapping;
using Newtonsoft.Json;

namespace Mx.Web.UI.Areas.Inventory.Count.Api.Models
{
    /// <summary>
    /// Settings grabbed at beginning of finish processing
    /// </summary>
    [MapFrom(typeof(ApplyDateResponse))]
    public class ApplyDateSettings
    {
        /// <summary>
        /// Current store time
        /// </summary>
        [JsonConverter(typeof(DateTimeConverter))]
        public DateTime StoreDateTime { get; set; }

        /// <summary>
        /// Apply date time, normally store time but may be overridden by client specific logic
        /// </summary>
        [JsonConverter(typeof(DateTimeConverter))]
        public DateTime ApplyDateTime { get; set; }

        /// <summary>
        /// Do we allow our end user to change the apply date, can be set by option or some client specific logic
        /// </summary>
        public bool IsApplyReadOnly { get; set; }

        /// <summary>
        /// Basically BBI setting, allows a custom date to be entered by option on finish screen
        /// </summary>
        public bool AllowCustomDate { get; set; }

        /// <summary>
        /// Optional client description sent to the screen by client specific logic
        /// </summary>
        public string Detail { get; set; }
    }
}
