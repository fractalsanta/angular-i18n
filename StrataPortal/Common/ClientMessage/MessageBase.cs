using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using Rockend.WebAccess.Common.Transport;
using Rockend.WebAccess.RockendMessage;

namespace Rockend.WebAccess.Common.ClientMessage
{
    [DataContract]
    public class MessageRequest : RockendRequest
    {
        [DataMember]
        public Guid AgencyGUID { get; set; }

        [DataMember]
        public Guid RequestID { get; set; }

        [DataMember]
        public string ClassName { get; set; }

        [DataMember]
        public string AssemblyName { get; set; }

        [DataMember]
        public List<string> ActivatedMachines { get; set; }

        [DataMember]
        public bool IsTimeoutResponse { get; set; }

        // Flag to indicate that nothing be returned to the AMH
        [DataMember]
        public bool OneWay { get; set; }

        [DataMember(Order=0)]
        public string DeviceType { get; set; }

        [DataMember(Order = 1)]
        public string AppVersion { get; set; }

        public int Size
        {
            get 
            {
                if (!string.IsNullOrEmpty(BodyXml))
                    return BodyXml.Length;
                else
                    return 0;
            }
        }

        public MessageRequest()
        {
            OneWay = false;
        }

        public virtual void PopulateFrom(ApplicationRequest request)
        {
            ActionName = request.ActionName;
            ApplicationCode = request.ApplicationCode;
            ApplicationKey = request.ApplicationKey;
            Body = request.BodyXml;
            ServiceKey = request.ServiceKey;
            ServicePassword = request.ServicePassword;
            SessionID = request.SessionID;
            TimeoutMS = request.TimeoutMS;
            DeviceType = request.DeviceType;
            AppVersion = request.AppVersion;
        }

        public virtual void PopulateFrom(RockendRequest source)
        {
            ActionName = source.ActionName;
            ApplicationKey = source.ApplicationKey;
            ApplicationCode = source.ApplicationCode;
            Body = source.Body;
            ServiceKey = source.ServiceKey;
            ServicePassword = source.ServicePassword;
            SessionID = source.SessionID;
            TimeoutMS = source.TimeoutMS;
        }

        public virtual MessageRequest CopyForNewBody()
        {
            return new MessageRequest()
                       {
                           AgencyGUID = this.AgencyGUID,
                           ApplicationKey = this.ApplicationKey,
                           ApplicationCode = this.ApplicationCode,
                           RequestID = this.RequestID,
                           SessionID = this.SessionID,
                           ServiceKey = this.ServiceKey,
                           ActionName = this.ActionName,
                           ClassName = this.ClassName,
                           AssemblyName = this.AssemblyName,
                           TimeoutMS = this.TimeoutMS
                       };
        }

        public ApplicationResponse CopyToApplicationResponse()
        {
            ApplicationResponse result = new ApplicationResponse();

            result.Data = BodyXml;
            result.ApplicationCode = ApplicationCode;
            result.ApplicationKey = ApplicationKey;
            result.RequestID = RequestID;

            return result;
        }

        public bool IsError
        {
            get { return ClassName == typeof(ErrorResponse).Name; }
        }

        public ErrorResponse Error
        {
            get
            {
                if (!IsError) return null;
                return BodyXml.DeserializeFromXML<ErrorResponse>();
            }
        }
    }
}
