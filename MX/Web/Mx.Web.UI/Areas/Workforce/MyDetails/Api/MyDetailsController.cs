using AutoMapper;
using Mx.Foundation.Services.Contracts.CommandServices;
using Mx.Foundation.Services.Contracts.QueryServices;
using Mx.Foundation.Services.Contracts.Requests;
using Mx.Web.UI.Areas.Core.Api.Models;
using Mx.Web.UI.Areas.Core.Api.Services;
using Mx.Web.UI.Areas.Workforce.MyDetails.Api.Models;
using Mx.Web.UI.Config.WebApi;
using System.Web.Http;

namespace Mx.Web.UI.Areas.Workforce.MyDetails.Api
{
    [Permission(Task.Labor_EmployeePortal_MyDetails_CanView)]
    public class MyDetailsController : ApiController
    {
        private readonly IMappingEngine _mapper;
        private readonly IAuthenticationService _authenticationService;
        private readonly IUserContactQueryService _userContactQueryService;
        private readonly IUserContactCommandService _userContactCommandService;

        public MyDetailsController(
            IMappingEngine mapper,
            IAuthenticationService authenticationService,
            IUserContactQueryService userContactQueryService,
            IUserContactCommandService userContactCommandService)
        {
            _mapper = mapper;
            _authenticationService = authenticationService;
            _userContactQueryService = userContactQueryService;
            _userContactCommandService = userContactCommandService;
        }

        public UserContact GetUserById()
        {
            var result = _userContactQueryService.GetByUserId(_authenticationService.User.Id);

            var user = _mapper.Map<UserContact>(result);

            return user;
        }

        [Permission(Task.Labor_EmployeePortal_MyDetails_CanUpdate)]
        public void PutUserContact(
            [FromBody] UserContact userContact)
        {
            var request = _mapper.Map<UserContactRequest>(userContact);

            _userContactCommandService.UpdateUserContact(_authenticationService.User.Id, request);
        }
    }
}