using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Rockend.WebAccess.Common.ClientMessage
{
    public interface IMessageTool
    {
        void ProcessCommand();
        object GetResponse();
    }
}
