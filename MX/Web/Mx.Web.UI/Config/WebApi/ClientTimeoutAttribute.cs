using System;

namespace Mx.Web.UI.Config.WebApi
{
    [AttributeUsage(AttributeTargets.Method)]
    public class ClientTimeoutAttribute: Attribute
    {
        public ClientTimeoutAttribute(int timeoutSeconds)
        {
            TimeoutSeconds = timeoutSeconds;
        }

        public int TimeoutSeconds { get; private set; }
    }
}