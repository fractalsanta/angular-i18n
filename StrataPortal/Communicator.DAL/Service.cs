using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Communicator.DAL
{
    public static class ApplicationCode
    {
        public const string REST = "RP";
        public const string Strata = "ST";
    }


    public partial class Service
    {

        public static Service RESTPortal = new Service
        {
            ServiceID = 1,
            ServiceName = "REST Portal",
            ServiceKey = 1000000,
            ServicePassword = "r0ckend",
            AppCode = ApplicationCode.REST
        };

        public static Service RESTMobile = new Service
        {
            ServiceID = 2,
            ServiceName = "REST Mobile",
            ServiceKey = 2000001,
            ServicePassword = "E4#172",
            AppCode = ApplicationCode.REST
        };

        public static Service StrataMobile = new Service
        {
            ServiceID = 3,
            ServiceName = "Strata Mobile",
            ServiceKey = 2000002,
            ServicePassword = "T7@411",
            AppCode = ApplicationCode.Strata
        };

        public static Service REIWA = new Service
        {
            ServiceID = 4,
            ServiceName = "REIWA",
            ServiceKey = 1000001,
            ServicePassword = "xx",
            AppCode = ApplicationCode.REST
        };

        public static Service KPI = new Service
        {
            ServiceID = 5,
            ServiceName = "KPI",
            ServiceKey = 1000002,
            ServicePassword = "xx",
            AppCode = ApplicationCode.REST
        };

        public static Service InspectionManager = new Service
        {
            ServiceID = 6,
            ServiceName = "Inspection Manager",
            ServiceKey = 1000007,
            ServicePassword = "GMqcFtK4",
            AppCode = ApplicationCode.REST
        };

        public static Service Rockend = new Service
        {
            ServiceID = 7,
            ServiceName = "Rockend",
            ServiceKey = 9990999,
            ServicePassword = "5NrYz7%)",
            AppCode = ApplicationCode.REST
        };

        public static Service RockendCRM = new Service
        {
            ServiceID = 8,
            ServiceName = "Rockend CRM",
            ServiceKey = 1000008,
            ServicePassword = "k@Kt!Z76tz,LTe/",
            AppCode = ApplicationCode.REST
        };

        public static Service StrataPortals = new Service
        {
            ServiceID = 9,
            ServiceName = "Strata Portals",
            ServiceKey = 2000000,
            ServicePassword = "r0ckend",
            AppCode = ApplicationCode.Strata
        };

        public static Service DocsOnPortals = new Service
        {
            ServiceID = 10,
            ServiceName = "Docs On Portals",
            ServiceKey = 1000009,
            ServicePassword = "xx",
            AppCode = ApplicationCode.REST
        };

        public static Service StrataMeetingApp = new Service
        {
            ServiceID = 11,
            ServiceName = "Strata Meeting App",
            ServiceKey = 1000010,
            ServicePassword = "xPf0rmD3v",
            AppCode = ApplicationCode.Strata
        };

        public static Service Benchmarking = new Service
        {
            ServiceID = 13,
            ServiceName = "Benchmarking",
            ServiceKey = 1000015,
            ServicePassword = "b3nchM4rk1ng",
            AppCode = ApplicationCode.REST
        };

        public static List<Service> AllStatic = new List<Service>
        {
            Benchmarking, StrataMeetingApp, DocsOnPortals, StrataPortals, RockendCRM, Rockend, InspectionManager, KPI, REIWA, StrataMobile, RESTMobile, RESTPortal
        }; 
    }
}
