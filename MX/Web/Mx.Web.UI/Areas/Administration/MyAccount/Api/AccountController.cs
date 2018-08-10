using System;
using System.Web.Http;
using AutoMapper;
using Mx.Foundation.Services.Contracts.CommandServices;
using Mx.Foundation.Services.Contracts.Requests;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Config.WebApi;
using System.Net;


namespace Mx.Web.UI.Areas.Administration.MyAccount.Api
{
    public class AccountController : ApiController
    {
        private readonly IUserAuthenticationCommandService _userAuthCommandService;
        private readonly IAuthenticationService _authenticationService;

        public AccountController(
            IUserAuthenticationCommandService userAuthCommandService,
            IAuthenticationService authenticationService)
        {
            _userAuthCommandService = userAuthCommandService;
            _authenticationService = authenticationService;
        }

        public String PostPinNumber(String password, String pin)
        {
            var user = _authenticationService.User;

            var response = _userAuthCommandService.SetUserPin(user.UserName, password, pin);

            if (!response.IsValid)
            {
                throw new HttpResponseException(HttpStatusCode.NotAcceptable);
            }

            return response.PinToken;
        }

        public void DeleteUserPin()
        {
            var user = _authenticationService.User;

            _userAuthCommandService.RemoveUserPin(user.UserName);
        }
    }
}