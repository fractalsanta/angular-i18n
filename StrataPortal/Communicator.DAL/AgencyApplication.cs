using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Agile.Diagnostics.Logging;
using CommunicatorDto;

namespace Communicator.DAL
{

    public partial class AgencyApplication 
    {

        partial void OnLoaded()
        {
            // The property changed events don't get fired during initial load.
            // we need to have Active etc set immediately.
            OnListenedChanged();
        }


        public void UpdateValues(AgencyApplication item)
        {
            if (AgencyApplicationID != item.AgencyApplicationID)
                throw new Exception(string.Format("UpdateValues but id's do not match! {0}", item));

            AgencyAccessID = item.AgencyAccessID;
            ApplicationCode = item.ApplicationCode;
            ApplicationKey = item.ApplicationKey;
            AmhMachine = item.AmhMachine;
            AppMachine = item.AppMachine;
            Rockend = item.Rockend;
            Description = item.Description;
            Listened = item.Listened;
            RWACVersion = item.RWACVersion;
            AppmhVersion = item.AppmhVersion;
            Version = item.Version;
            SerialNumber = item.SerialNumber;
            WordVersion = item.WordVersion;
            Word64 = item.Word64;
            ExcelVersion = item.ExcelVersion;
            Excel64 = item.Excel64;
            ReporterVersion = item.ReporterVersion;
            MachineNow = item.MachineNow;
            Timezone = item.Timezone;
            TimeOffset = item.TimeOffset;
            LastUpdated = item.LastUpdated;            
        }


        public override string ToString()
        {
            return string.Format("[{0}] key:{1} sn:{2} rwac:{3}"
                , AgencyApplicationID, ApplicationKey, SerialNumber, RWACVersion);
        }

        public string GetAgencyName()
        {
            var name = "";

            if(AgencyAccess != null)
                name = AgencyAccess.SageName ?? AgencyAccess.AgencyName;
            
            if(string.IsNullOrEmpty(name))
                name = Description ?? "";
            
            return name;
        }

        public bool IsStrata {
            get { return ApplicationCode == "SM"; }
        }

        /// <summary>
        /// Get the (not nullable) Application Key
        /// </summary>
        public int AppKey {
            get { return ApplicationKey.HasValue ? ApplicationKey.Value : 0; }
        }

        /// <summary>
        /// Is the app currently actively listening
        /// </summary>
        public bool Active { get; set; }

        public bool ActiveStrata { get; set; }

        public bool ActiveRest { get; set; }

        public string Starred {
            get { return string.IsNullOrEmpty(AltSageClientCode) ? "" : "* "; }
        }

        partial void OnListenedChanged()
        {
            Active = (Listened != null && DateTime.Now.Subtract(Listened.Value.ToLocalTime()) < TimeSpan.FromSeconds(70));
            ActiveStrata = Active && ApplicationCode.EndsWith("SM");
            ActiveRest = Active && ApplicationCode.EndsWith("RP");

            activeSnapshot = Active;
        }

        private bool activeSnapshot;

        public bool ActiveSnapshot
        {
            get { return activeSnapshot; }
        }

        public string ToolTipText {
            get
            {
                var amh = string.Format("\r\nAMH: {0} ({1})", RWACVersion, AmhMachine ?? "");
                var altSageCode = (string.IsNullOrEmpty(AltSageClientCode)) ? "" : string.Format("\r\n* Client Code in SAGE: {0}", AltSageClientCode);
                return string.Format(@"{0}
Last Listened: {1}{2}{3}
MH: {4}"
                    , Description
                    , Listened.HasValue ? Listened.Value.ToString("s") : ""
                    , amh
                    , altSageCode
                    , AppMachine ?? "");
            }
        }


        public AgencyApplicationDTO ToDto()
        {
            var result = new AgencyApplicationDTO
            {
                AgencyAccessId = AgencyAccessID,
                ApplicationCode = ApplicationCode,
                AgencyApplicationId = AgencyApplicationID,
                ApplicationKey = ApplicationKey,
                Description = Description,
                Listened = Listened,
                SerialNumber = SerialNumber
            };

            if (AgencyAccess != null)
                result.AgencyAccess = AgencyAccess.ToDto();
            return result;
        }

        public AgencyApplication ToEntity(AgencyApplicationDTO dto)
        {
            var result = new AgencyApplication
            {
                AgencyAccessID = dto.AgencyAccessId,
                AgencyApplicationID = dto.AgencyApplicationId,
                ApplicationCode = dto.ApplicationCode,
                ApplicationKey = dto.ApplicationKey,
                Description = dto.Description,
                Listened = dto.Listened,
                SerialNumber = dto.SerialNumber
            };
            return result;
        }


        /// <summary>
        /// Testing
        /// </summary>
        public static class Testing
        {
            /// <summary>
            /// returns a test record
            /// </summary>
            public static AgencyApplication GetTestRecord()
            {
                var app = new AgencyApplication 
                {
                    AgencyAccessID = 1, // always use 1 for now (then don't have to create a record)
                    ApplicationCode = "RP",
                    ApplicationKey = 991991,
                    SerialNumber = "99919991",
                    Description = "description test test"
                };
                
                return app;
            }
        }
    }
}
