using System.Collections.Generic;
using System.ServiceModel;
using System;
using Rockend.WebAccess.Common.ClientMessage;
using Rockend.WebAccess.Common.Transport;
using Rockend.WebAccess.RockendMessage;

namespace Rockend.WebAccess.Common
{
    [ServiceContract]
    public interface IRequestService
    {
        int WaitBeforeUpdatingTestUseOnly { get; set; }

        [OperationContract]
        MessageRequest Process(RockendRequest request);

        [OperationContract]
        MessageRequest ProcessStrata(StrataMessage request);

        [OperationContract]
        ApplicationResponse ProcessRequest(ApplicationRequest request);

        [OperationContract]
        void PostResponse(MessageRequest response);

        [OperationContract]
        VersionCheckResponse VersionCheck(VersionCheckRequest version);

#if !IOS
        [OperationContract]
        List<RockendApplication> GetAgencyGuidAndSetRWACVersion(AgencyGuidRequest applicationKeys);

        [OperationContract]
        List<RockendApplication> GetAgencyGUID(List<RockendApplication> applicationKeys);

        [OperationContract]
        UpdateResponse UpdateClientSchedules(List<int> applicationKeys);
#endif

        [OperationContract]
        DownloadFileResponse GetProcessor(string assemblyName);

        [OperationContract]
        FileCheckResponse CheckProcessor(FileCheckRequest request);

        [OperationContract]
        [ServiceKnownType(typeof(StrataMessage))]
        List<MessageRequest> RegisterAgencyListener(GetMessageRequest amhListenerRequest);
    }
}
