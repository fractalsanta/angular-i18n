using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.NetworkInformation;
using System.ServiceModel;
using System.Text;
using Agile.Diagnostics.Logging;

namespace Rockend.Common
{
    public static class ExtensionMethods
    {

        public static void EndpointNotFoundExHandler(this EndpointNotFoundException endpointEx, string methodName)
        {
            try
            {
                // don't log as an error
                Logger.Warning("{0}\r\nEX:{1}{2}", methodName, endpointEx.Message
                    , (endpointEx.InnerException != null) ? string.Format("\r\n[InnerEx] {0}", endpointEx.InnerException.Message) : string.Empty);
                Logger.Info("[EX] IsNetworkAvailable={0}", NetworkInterface.GetIsNetworkAvailable());
                if (NetworkInterface.GetIsNetworkAvailable())
                {
                    // if there is a network available and we got an EndpointNotFound ex then can we hit google?
                    var canPingGoogle = CanPingGoogle();
                    Logger.Info("[EX] CanPingGoogle={0}", canPingGoogle);
                }
            }
            catch (Exception ex) // just to be overly safe and make certain an ex cannot be thrown from this method.
            {
                Logger.Error(ex, "EndpointNotFoundExHandler");
            }
        }

        private static bool CanPingGoogle()
        {
            try
            {
                var ping = new Ping();
                var pingStatus = ping.Send(IPAddress.Parse("139.130.4.5"));
                return pingStatus != null && pingStatus.Status == IPStatus.Success;
            }
            catch (PingException ex)
            {
                Logger.Warning("Got a Ping Exception. This typically occurs when there is a problem with the network card. Ex Details in following error.");
                Logger.Error(ex, "CanPingGoogle");
                return false;
            }
            catch (Exception ex)
            { // the PingException is what we are expecting, but DO handle all exceptions because if an ex occurs here the AMH will come to a grinding halt
                Logger.Error(ex, "CanPingGoogle");
                return false;
            }
        }
    }
}
