using System;
using System.Net;
using System.Web.Http;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Services.Shared.Exceptions;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Config.WebApi;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
    public abstract class ForecastControllerBase : RESTController
    {
        protected readonly IAuthorizationService _authorizationService;
        protected readonly IAuthenticationService _authenticationService;

        protected ForecastControllerBase(
            IUserAuthenticationQueryService userAuthenticationQueryService,
            IAuthorizationService authorizationService,
            IAuthenticationService authenticationService) : base(userAuthenticationQueryService)
        {
            _authenticationService = authenticationService;
            _authorizationService = authorizationService;
        }

        protected Boolean IsDayLocked(DateTime currentDate, DateTime businessDay)
        {
            if (_authenticationService.User == null)
            {
                return false;
            }

            var canEditforecast = _authorizationService.HasAuthorization(Task.Forecasting_CanEdit);
            var canEditInPast = _authorizationService.HasAuthorization(Task.Forecasting_PastDates_CanEdit);
            var isSameDayorAfter = businessDay.Date >= currentDate.Date;

            return (canEditInPast == false && isSameDayorAfter == false) || !canEditforecast;
        }

        protected void EnsureCanViewForecast()
        {
            if (_authenticationService.User != null)
            {
                if (!_authorizationService.HasAuthorization(Task.Forecasting_CanView))
                {
                    throw new HttpResponseException(HttpStatusCode.Forbidden);
                }
            }
        }

        protected void EnsureCanEditForecast()
        {
            if (_authenticationService.User != null)
            {
                if (!_authorizationService.HasAuthorization(Task.Forecasting_CanEdit))
                {
                    throw new HttpResponseException(HttpStatusCode.Forbidden);
                }
            }
        }

        protected T EnsureResource<T>(String name, T resource) where T : class
        {
            if (resource == null)
            {
                throw new MissingResourceException(String.Format("{0} not found.", name));
            }
            return resource;
        }
    }
}
