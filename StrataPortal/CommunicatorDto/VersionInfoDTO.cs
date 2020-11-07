using System;

namespace CommunicatorDto
{
    public class VersionInfoDTO
    {   
        public int? AppKey { get; set; }
        public string SerialNumber { get; set; }
        public string ApplicationCode { get; set; }               
        public string AppmhVersion { get; set; }
        public string AppMachine { get; set; }        
        public DateTimeOffset? MachineNow { get; set; }
        public string Timezone { get; set; }
        public string TimeOffset { get; set; }
        public string WordVersion { get; set; }
        public bool? Word64 { get; set; }
        public string ExcelVersion { get; set; }
        public bool? Excel64 { get; set; }
        public string ReporterVersion { get; set; }
        public DateTimeOffset Created { get; set; }
    }
}
