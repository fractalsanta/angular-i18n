using System;
using System.Web.Http;
using System.Web.Routing;

namespace Mx.Web.UI.Config
{
	public partial class ApiRoutingConfig
	{
		public static void ExtendMap(RouteCollection routes)
		{
            routes.MapHttpRoute(
                name: "Api",
                routeTemplate: "api/{controller}/{id}",
                defaults : new { id = RouteParameter.Optional }
            );

            routes.MapHttpRoute(
                name: "EntityBusinessDayApi",
                routeTemplate: "api/Entity/{entityId}/{controller}/{businessDay}",
                defaults: new { businessDay = DateTime.MinValue },
                constraints: new { businessDay = @"[0-9]{4}-[0-1][0-9]-[0-3][0-9]"}
            );
            
            routes.MapHttpRoute(
				name: "EntityApi",
				routeTemplate: "api/Entity/{entityId}/{controller}/{id}",
				defaults: new { id = RouteParameter.Optional }
			);

            routes.MapHttpRoute(
                name: "ForecastAdjustmentSubApi",
                routeTemplate: "api/Entity/{entityId}/Forecast/{businessDay}/{controller}",
                defaults: new { businessDay = DateTime.MinValue },
                constraints: new { businessDay = @"[0-9]{4}-[0-1][0-9]-[0-3][0-9]"}
            );

            routes.MapHttpRoute(
				name: "ForecastSubApi",
				routeTemplate: "api/Entity/{entityId}/Forecast/{forecastId}/{controller}s/{id}",
				defaults: new { id = RouteParameter.Optional }
			);

            routes.MapHttpRoute(
                name: "ForecastSalesItemSubApi",
                routeTemplate: "api/Entity/{entityId}/Forecast/{forecastId}/SalesItem/{salesItemId}/{controller}s"
            );

			routes.MapHttpRoute(
				name: "ForecastEvaluationSubApi",
				routeTemplate: "api/Entity/{entityId}/ForecastEvaluation/{forecastEvaluationId}/{controller}s/{id}",
				defaults: new { id = RouteParameter.Optional }
			);

        }
	}
}