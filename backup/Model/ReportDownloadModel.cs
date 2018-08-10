using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;

namespace Rockend.iStrata.StrataWebsite.Model
{
    public class ReportDownloadModel
    {
        public string FileName { get; set; }
        public string Reference { get; set; }
        public string Referrer { get; set; }
    }
}
