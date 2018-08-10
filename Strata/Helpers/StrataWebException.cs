using System;

namespace Rockend.iStrata.StrataWebsite.Helpers
{
    /// <summary>
    /// Exception class to simplify error handling and display to the user.
    /// </summary>
    public class StrataWebException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="StrataWebException"/> class.
        /// </summary>
        public StrataWebException()
            : base()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="StrataWebException"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        public StrataWebException(string message)
            : base(message)
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="StrataWebException"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        /// <param name="innerException">The inner exception.</param>
        public StrataWebException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
