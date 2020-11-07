using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CommunicatorDto
{
    [DataContract]
    [Serializable]
    public class ServiceDto
    {
        [DataMember]
        public int ServiceId { get; set; }

        [DataMember]
        public string ServiceName { get; set; }

        [DataMember]
        public int ServiceKey { get; set; }


        public static ServiceDto RESTPortal = new ServiceDto
        {
            ServiceId = 1,
            ServiceName = "REST Portal",
            ServiceKey = 1000000,
        };

        public static ServiceDto RESTMobile = new ServiceDto
        {
            ServiceId = 2,
            ServiceName = "REST Mobile",
            ServiceKey = 2000001,
        };

        public static ServiceDto StrataMobile = new ServiceDto
        {
            ServiceId = 3,
            ServiceName = "Strata Mobile",
            ServiceKey = 2000002,
        };

        public static ServiceDto REIWA = new ServiceDto
        {
            ServiceId = 4,
            ServiceName = "REIWA",
            ServiceKey = 1000001,
        };

        public static ServiceDto KPI = new ServiceDto
        {
            ServiceId = 5,
            ServiceName = "KPI",
            ServiceKey = 1000002,
        };

        public static ServiceDto InspectionManager = new ServiceDto
        {
            ServiceId = 6,
            ServiceName = "Inspection Manager",
            ServiceKey = 1000007,
        };

        public static ServiceDto Rockend = new ServiceDto
        {
            ServiceId = 7,
            ServiceName = "Rockend",
            ServiceKey = 9990999,
        };

        public static ServiceDto RockendCRM = new ServiceDto
        {
            ServiceId = 8,
            ServiceName = "Rockend CRM",
            ServiceKey = 1000008,
        };

        public static ServiceDto StrataPortals = new ServiceDto
        {
            ServiceId = 9,
            ServiceName = "Strata Portals",
            ServiceKey = 2000000,
        };

        public static ServiceDto DocsOnPortals = new ServiceDto
        {
            ServiceId = 10,
            ServiceName = "Docs On Portals",
            ServiceKey = 1000009,
        };

        public static ServiceDto StrataMeetingApp = new ServiceDto
        {
            ServiceId = 11,
            ServiceName = "Strata Meeting App",
            ServiceKey = 1000010,
        };

        public static ServiceDto Benchmarking = new ServiceDto
        {
            ServiceId = 12,
            ServiceName = "Benchmarking",
            ServiceKey = 1000015,
        };

        public static List<ServiceDto> AllStatic = new List<ServiceDto>
        {
            Benchmarking, StrataMeetingApp, DocsOnPortals, StrataPortals, RockendCRM, Rockend, InspectionManager, KPI, REIWA, StrataMobile, RESTMobile, RESTPortal
        };
    }
}
