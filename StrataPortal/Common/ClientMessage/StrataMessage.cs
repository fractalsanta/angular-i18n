using System.Runtime.Serialization;
using Rockend.WebAccess.RockendMessage;

namespace Rockend.WebAccess.Common.ClientMessage
{
    [DataContract]
    public class StrataMessage : MessageRequest
    {
        public StrataMessage()
        {
            
        }

        public override string ToString()
        {
            return string.Format("[{0}] Action:{1}"
                , ContactID, ActionName ?? "NoAction"); 
        }

        [DataMember]
        public int ContactID { get; set; }

        [DataMember]
        public dynamic BodyJson { get; set; }
        

        public override void PopulateFrom(RockendRequest source)
        {
            base.PopulateFrom(source);

            StrataMessage strataMessage = source as StrataMessage;
            if(strataMessage != null)
                ContactID = strataMessage.ContactID;
        }
    }
}
