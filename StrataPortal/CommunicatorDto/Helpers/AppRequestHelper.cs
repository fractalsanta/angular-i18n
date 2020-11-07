using System;
using System.ServiceModel;
using Agile.Diagnostics.Logging;
using CommunicatorDto;
using Rockend.Common.Helpers;
using System.ServiceModel.Description;

namespace Rockend.CommunicatorDto.Helpers
{
    public interface IAppRequestHelper
    {
        IAppRequest ConnectToAppRequestService();
    }

    public class AppRequestHelper : IAppRequestHelper
    {
        /// <summary>
        /// ctor
        /// </summary>
        public AppRequestHelper()
        {
            Logger.Debug("AppRequestHelper");
        }

        private ChannelFactory<IAppRequest> appRequestChannelFactory;

        // Instance should be removed in favour of an IOC/DI container approach, but need to wait for 
        // all processors that use this to be upgraded.
        private static AppRequestHelper instance;
        public static AppRequestHelper Instance
        {
            get
            {
                if (instance == null)
                    instance = new AppRequestHelper();
                return instance;
            }
        }
        
        private ChannelFactory<IAppRequest> CreateAppRequestChannelFactory()
        {
            var factory = new ChannelFactory<IAppRequest>(EnvironmentHelper.GetAppConnectBinding(), EnvironmentHelper.GetAppConnectServiceAddress());

            // increased the number of items that can be serialized to be sent to service
            foreach (OperationDescription op in factory.Endpoint.Contract.Operations)
            {
                var dataContractBehavior = op.Behaviors.Find<DataContractSerializerOperationBehavior>() as DataContractSerializerOperationBehavior;
                if (dataContractBehavior != null)
                {
                    dataContractBehavior.MaxItemsInObjectGraph = 2147483647;
                }
            }

            return factory;
        }

        private ChannelFactory<IAppRequest> AppRequestChannelFactory
        {
            get
            {
                if (appRequestChannelFactory == null)
                {
                    appRequestChannelFactory = CreateAppRequestChannelFactory();
                    Logger.Debug("AppRequest Channel Factory created-Address: {0}", appRequestChannelFactory.Endpoint.Address);
                }
                else
                {
                    if (appRequestChannelFactory.State == CommunicationState.Faulted)
                    {
                        Logger.Debug("AppConnect Connection - Faulted");
                        appRequestChannelFactory.Abort();
                        appRequestChannelFactory = CreateAppRequestChannelFactory();
                    }
                    if (appRequestChannelFactory.State == CommunicationState.Closed)
                    {
                        Logger.Debug("Opening Connection to AppConnect");
                        appRequestChannelFactory.Open();
                    }
                }
                return appRequestChannelFactory;
            }
        }

        public IAppRequest ConnectToAppRequestService()
        {
            Logger.Debug("Connecting to AppRequest. [{0}]", EnvironmentHelper.GetEnvironment() ?? "--");
            return AppRequestChannelFactory.CreateChannel();
        }
    }
}
