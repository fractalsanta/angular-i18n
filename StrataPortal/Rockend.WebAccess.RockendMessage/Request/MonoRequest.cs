using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Rockend.WebAccess.RockendMessage.Request
{
    public class MonoRequest : RockendRequest
    {
        public void SetBodyXml(string content)
        {
            base.BodyXml = content;
        }
    }
}
