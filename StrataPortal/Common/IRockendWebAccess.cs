using System.ServiceModel;
using Rockend.WebAccess.Common.ClientMessage;
using System.Collections.Generic;
using Rockend.WebAccess.Common.Transport;
using System;

namespace Rockend.WebAccess.Common
{
    /// <summary>
    /// This interface defines the contract for the Strata Master Handler's WCF component
    /// </summary>
    [ServiceContract]
    public interface IRockendWebAccess
    {
        [OperationContract]
        [ServiceKnownType(typeof(StrataMessage))]
        void ProcessRequest(MessageRequest request);

        [OperationContract]
        VersionCheckRequest GetCurrentVersion();

        [OperationContract]
        void RegistrationResult(RockendApplication app);

        [OperationContract]
        bool IsWebEnabled(RockendApplication app);

        [OperationContract]
        bool Ping();
    }
}
