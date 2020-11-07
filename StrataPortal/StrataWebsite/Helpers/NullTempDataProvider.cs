using System.Collections.Generic;
using System.Web.Mvc;

namespace Rockend.iStrata.StrataWebsite.Helpers
{
    /// <summary>
    /// ITempDataProvider for the MVC framework that always returns no data.
    /// </summary>
    public class NullTempDataProvider : ITempDataProvider
    {
        #region ITempDataProvider Members

        /// <summary>
        /// Loads the temp data.
        /// </summary>
        /// <param name="controllerContext">The controller context.</param>
        /// <returns>IDictionary with the Temp Data.</returns>
        public IDictionary<string, object> LoadTempData(ControllerContext controllerContext)
        {
            return new Dictionary<string, object>();
        }

        /// <summary>
        /// Saves the temp data.
        /// </summary>
        /// <param name="controllerContext">The controller context.</param>
        /// <param name="values">The values.</param>
        public void SaveTempData(ControllerContext controllerContext, IDictionary<string, object> values)
        {
            // do nothing
        }

        #endregion
    }
}
