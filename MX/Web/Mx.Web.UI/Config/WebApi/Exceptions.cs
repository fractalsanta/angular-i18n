using System;
using System.Net;
using System.Security;

namespace Mx.Web.UI.Config.WebApi
{
	public class InvalidCredentialsException : SecurityException
	{ 
		public InvalidCredentialsException() : base("Invalid credentials.")
		{}
	}

	public class InvalidTokenException : SecurityException
	{ 
		public InvalidTokenException() : base("Invalid security token.")
		{}
	}

    public class CustomErrorMessageException : Exception
    {
        public HttpStatusCode StatusCode { get; set; }
        public ErrorMessage CustomMessage { get; set; }

        public CustomErrorMessageException(HttpStatusCode statusCode, ErrorMessage customMessage)
        {
            StatusCode = statusCode;
            CustomMessage = customMessage;
        }
    }
}
