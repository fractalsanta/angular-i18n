using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.Text;
using System.Threading;
using System.Xml;
using Agile.Diagnostics.Logging;
using Rockend.Common;
using Rockend.Common.Helpers;
using Rockend.WebAccess.Common.ClientMessage;
using Rockend.WebAccess.RockendMessage;

namespace Rockend.WebAccess.Common.Helpers
{
    public static class RmhClient
    {

        private static IEnvironmentService environmentService;

        private static IEnvironmentService EnvironmentService
        {
            get { return environmentService ?? (environmentService = SimpleContainer.GetInstance<IEnvironmentService>()); }
        }


        public static MessageRequest SendToRMH(RockendRequest message, int timeout = 60000)
        {
            Logger.Debug(MethodBase.GetCurrentMethod().Name);
            message.TimeoutMS = timeout;

            var binding = GeHttpsBinding();
            var address = GetRmhEndpointAddress();
            
            var factory = new ChannelFactory<IRequestService>(binding, address);
            try
            {
                var rmh = factory.CreateChannel();
                return rmh.Process(message);
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "RmhClient.SendToRmh. Proces or CreateChannel.");
                return null;
            }
            finally
            {
                try
                {
                    if(factory.State != CommunicationState.Closed && factory.State != CommunicationState.Closing)
                        factory.Close();
                }
                catch (Exception ex)
                {
                    Logger.Error(ex, "RmhClient.SendToRmh. Closing factory");
                }
            }
        }

        private static EndpointAddress GetRmhEndpointAddress()
        {
            string address;

            if(EnvironmentService.IsProduction)
                address = "https://rmh.rockendcommunicator.com.au/requestService.svc";
            else if(EnvironmentService.IsUat)
                address = "https://rmh-uat.rockendcommunicator.com.au/requestservice.svc";
            else if(EnvironmentService.IsDev)
                address = "https://rockendmessagehandler-dev.azurewebsites.net/requestservice.svc";  // "https://rmhservice.local/requestservice.svc";
            else
                address = string.Format("https://rmh-{0}.rockendcommunicator.com.au/RequestService.svc", EnvironmentService.GetEnvironment());


            return new EndpointAddress(address);
        }

        private static Binding GeHttpsBinding()
        {
            var result = new WSHttpBinding
            {
                ReceiveTimeout = new TimeSpan(0, 0, 3, 30),
                SendTimeout = new TimeSpan(0, 0, 3, 30),
                OpenTimeout = new TimeSpan(0, 0, 3, 30),
                CloseTimeout = new TimeSpan(0, 0, 3, 30),
                MaxReceivedMessageSize = int.MaxValue,
                Security = new WSHttpSecurity()
                {
                    Mode = SecurityMode.Transport,
                    Transport = new HttpTransportSecurity()
                    {
                        ClientCredentialType = HttpClientCredentialType.None
                    }
                },
                ReaderQuotas = new XmlDictionaryReaderQuotas()
                {
                    MaxStringContentLength = int.MaxValue,
                    MaxArrayLength = int.MaxValue
                }
            };

            return result;
        }

    }
}
