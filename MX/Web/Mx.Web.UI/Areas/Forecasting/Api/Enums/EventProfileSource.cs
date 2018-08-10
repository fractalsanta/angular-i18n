
namespace Mx.Web.UI.Areas.Forecasting.Api.Enums
{
    public enum EventProfileSource
    {

        /// <summary>
        /// Event adjustments are calculated by the system based on historical data.
        /// </summary>
        Empirical = 1,

        /// <summary>
        /// Event adjustments are manually specified by the operator when the event profile is created.
        /// </summary>
        Manual,
    }
}
