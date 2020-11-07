using System.ServiceModel;
using System;
using Rockend.WebAccess.Common.ClientMessage;
using Rockend.WebAccess.Common.Transport;
using System.Collections.Generic;

namespace Rockend.WebAccess.Common
{
    [ServiceContract]
    public interface IAgencyListener
    {
        [OperationContract]
        void SendToWebSite(MessageRequest message);

        [OperationContract]
        string RegisterApplicationHandler(ApplicationRegistration registrationDetails);

        [OperationContract]
        DownloadFileResponse GetProcessor(string assemblyName);

        [OperationContract]
        FileCheckResponse CheckProcessor(FileCheckRequest request);

        [OperationContract]
        VersionCheckResponse VersionCheck(VersionCheckRequest version);

        [OperationContract]
        bool Ping();

        [OperationContract]
        List<RockendApplication> GetApplicationList();

        [OperationContract]
        List<RockendApplication> GetBackupApplicationList();
        
        [OperationContract]
        ActionCheckResponse GetActionDetails(ActionCheckRequest request);
    }
}
