using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Rockend.iStrata.StrataWebsite.Model
{
    public class DocumentDistributionModel
    {
        public string Type { get; set; }
        public string Recipient { get; set; }
        public string Method { get; set; }
        public string Value { get; set; }
    }
}
