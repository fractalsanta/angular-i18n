using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Rockend.WebAccess.Common.Helpers
{
    public class WebAccessException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="StrataWebException"/> class.
        /// </summary>
        public WebAccessException()
            : base()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="StrataWebException"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        public WebAccessException(string message)
            : base(message)
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="StrataWebException"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        /// <param name="innerException">The inner exception.</param>
        public WebAccessException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
