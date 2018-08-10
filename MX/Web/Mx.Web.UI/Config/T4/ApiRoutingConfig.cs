/////////////////////////////////////////////////////////////////////////////////////////////////
//
//    Routing configuration for REST WebAPI services 
//    WARNING: This file has been automatically generated. Any changes may be lost on the next run.
//
/////////////////////////////////////////////////////////////////////////////////////////////////

using System.Web.Http;
using System.Web.Routing;

namespace Mx.Web.UI.Config
{
	public static partial class ApiRoutingConfig
	{
		public static void Map(RouteCollection routes)
		{
            routes.MapHttpRoute("Map Administration/DataLoad/Api/{controller}/{id}", "Administration/DataLoad/Api/{controller}/{id}", new { id = RouteParameter.Optional });
            routes.MapHttpRoute("Map Administration/DayCharacteristic/Api/{controller}/{id}", "Administration/DayCharacteristic/Api/{controller}/{id}", new { id = RouteParameter.Optional });
            routes.MapHttpRoute("Map Administration/Hierarchy/Api/{controller}/{id}", "Administration/Hierarchy/Api/{controller}/{id}", new { id = RouteParameter.Optional });
            routes.MapHttpRoute("Map Administration/MyAccount/Api/{controller}/{id}", "Administration/MyAccount/Api/{controller}/{id}", new { id = RouteParameter.Optional });
            routes.MapHttpRoute("Map Administration/Settings/Api/{controller}/{id}", "Administration/Settings/Api/{controller}/{id}", new { id = RouteParameter.Optional });
            routes.MapHttpRoute("Map Administration/User/Api/{controller}/{id}", "Administration/User/Api/{controller}/{id}", new { id = RouteParameter.Optional });
            routes.MapHttpRoute("Map Core/Api/{controller}/{id}", "Core/Api/{controller}/{id}", new { id = RouteParameter.Optional });
            routes.MapHttpRoute("Map Core/Auth/Api/{controller}/{id}", "Core/Auth/Api/{controller}/{id}", new { id = RouteParameter.Optional });
            routes.MapHttpRoute("Map Core/Diagnostics/Api/Services/{controller}/{id}", "Core/Diagnostics/Api/Services/{controller}/{id}", new { id = RouteParameter.Optional });
            routes.MapHttpRoute("Map Core/PartnerRedirect/Api/{controller}/{id}", "Core/PartnerRedirect/Api/{controller}/{id}", new { id = RouteParameter.Optional });
            routes.MapHttpRoute("Map Forecasting/Api/{controller}/{id}", "Forecasting/Api/{controller}/{id}", new { id = RouteParameter.Optional });
            routes.MapHttpRoute("Map Inventory/Count/Api/{controller}/{id}", "Inventory/Count/Api/{controller}/{id}", new { id = RouteParameter.Optional });
            routes.MapHttpRoute("Map Inventory/Order/Api/{controller}/{id}", "Inventory/Order/Api/{controller}/{id}", new { id = RouteParameter.Optional });
            routes.MapHttpRoute("Map Inventory/Production/Api/{controller}/{id}", "Inventory/Production/Api/{controller}/{id}", new { id = RouteParameter.Optional });
            routes.MapHttpRoute("Map Inventory/Transfer/Api/{controller}/{id}", "Inventory/Transfer/Api/{controller}/{id}", new { id = RouteParameter.Optional });
            routes.MapHttpRoute("Map Inventory/Waste/Api/{controller}/{id}", "Inventory/Waste/Api/{controller}/{id}", new { id = RouteParameter.Optional });
            routes.MapHttpRoute("Map Operations/Reporting/Api/{controller}/{id}", "Operations/Reporting/Api/{controller}/{id}", new { id = RouteParameter.Optional });
            routes.MapHttpRoute("Map Reporting/Dashboard/Api/{controller}/{id}", "Reporting/Dashboard/Api/{controller}/{id}", new { id = RouteParameter.Optional });
            routes.MapHttpRoute("Map Workforce/Deliveries/Api/{controller}/{id}", "Workforce/Deliveries/Api/{controller}/{id}", new { id = RouteParameter.Optional });
            routes.MapHttpRoute("Map Workforce/DriverDistance/Api/{controller}/{id}", "Workforce/DriverDistance/Api/{controller}/{id}", new { id = RouteParameter.Optional });
            routes.MapHttpRoute("Map Workforce/MyAvailability/Api/{controller}/{id}", "Workforce/MyAvailability/Api/{controller}/{id}", new { id = RouteParameter.Optional });
            routes.MapHttpRoute("Map Workforce/MyDetails/Api/{controller}/{id}", "Workforce/MyDetails/Api/{controller}/{id}", new { id = RouteParameter.Optional });
            routes.MapHttpRoute("Map Workforce/MySchedule/Api/{controller}/{id}", "Workforce/MySchedule/Api/{controller}/{id}", new { id = RouteParameter.Optional });
            routes.MapHttpRoute("Map Workforce/MyTimeCard/Api/{controller}/{id}", "Workforce/MyTimeCard/Api/{controller}/{id}", new { id = RouteParameter.Optional });
            routes.MapHttpRoute("Map Workforce/MyTimeOff/Api/{controller}/{id}", "Workforce/MyTimeOff/Api/{controller}/{id}", new { id = RouteParameter.Optional });
            routes.MapHttpRoute("Map Workforce/PeriodClose/Api/{controller}/{id}", "Workforce/PeriodClose/Api/{controller}/{id}", new { id = RouteParameter.Optional });
			
			ExtendMap(routes);
		}
	}
}