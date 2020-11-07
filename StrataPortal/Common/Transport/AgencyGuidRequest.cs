using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Rockend.WebAccess.Common.Transport
{
    public class AgencyGuidRequest
    {
        public List<RockendApplication> Applications { get; set; }
        public int RWACVersion { get; set; }
    }
}
