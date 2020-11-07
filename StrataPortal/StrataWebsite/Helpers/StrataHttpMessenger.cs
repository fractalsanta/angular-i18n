using Agile.Diagnostics.Logging;

namespace Rockend.iStrata.StrataWebsite.Helpers
{
    /// <summary>
    /// Implementation of the IMessager interface using the RMH as the data source.
    /// </summary>
    public class StrataHttpMessenger : HttpMessenger
    {

        /// <summary>
        /// Initializes a new instance of the <see cref="HttpMessenger"/> class.
        /// </summary>
        public StrataHttpMessenger()
        {
            Logger.Debug("StrataHttpMessenger ctor");
        }

    }
}
