using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;

namespace Rockend.WebAccess.Common.Transport
{
    public class RockendApplication
    {
        private volatile bool webEnabled;

        public override string ToString()
        {
            return string.Format("AppKey:{0} SN:{1} DSID:{2} Machine:{3}"
                , ApplicationKey, SerialNumber, DataSourceID, MachineName);
        }

        public Guid? AgencyGUID { get; set; } 
        public string ApplicationCode { get; set; }
        public int ApplicationKey { get; set; }
        public string SerialNumber { get; set; }
        public string AgencyName { get; set; }
        public string Description { get; set; }
        public EndpointAddress10 EndPoint { get; set; }
        public int DataSourceID { get; set; }
        public string MachineName { get; set; }
        public bool IsDataLocal { get; set; }
        public bool IsActive { get; set; }
        public int Version { get; set; }

        public int RWACVersion { get; set; }
        public int AppmhVersion { get; set; }

        public bool WebEnabled
        {
            get { return webEnabled; }
            set { webEnabled = value; }
        }


        #region Testing

        /// <summary>
        /// Testing use only!
        /// </summary>
        public static class Testing
        {
            public static List<RockendApplication> GetTwo()
            {
                return new List<RockendApplication> 
                {
                    GetTestOne(), 
                    GetTestTwo() 
                };
            }

            public static RockendApplication GetWebEnabled(int appKey = 1111)
            {
                return new RockendApplication
                {
                    ApplicationKey = appKey,
                    SerialNumber = "11111122",
                    MachineName = string.Format("Machine{0}", appKey),
                    IsDataLocal = true,
                    WebEnabled = true
                };
            }

            public static RockendApplication GetTestOne()
            {
                return new RockendApplication 
                {
                    ApplicationKey = 1111, 
                    SerialNumber = "11111122", 
                    MachineName = "MachineOne",
                    IsDataLocal = true
                };
            }
            public static RockendApplication GetTestTwo()
            {
                return new RockendApplication
                {
                    ApplicationKey = 2222,
                    SerialNumber = "22222211",
                    MachineName = "MachineTwo",
                    IsDataLocal = true
                };
            }

            public static RockendApplication GetTestThree()
            {
                return new RockendApplication
                {
                    ApplicationKey = 3333,
                    SerialNumber = "33333322",
                    MachineName = "MachineThree",
                    IsDataLocal = false,
                    Description = "three"
                };
            }
        }

        #endregion // Testing
    }
}
